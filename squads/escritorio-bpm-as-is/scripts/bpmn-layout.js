#!/usr/bin/env node
// bpmn-layout.js — Layout engine próprio para BPMN 2.0 com swimlanes
// Substitui: bpmn-auto-layout + di-injector + edge-injector
//
// Uso: node bpmn-layout.js <input.bpmn> <output.bpmn>
//
// Algoritmo:
//   1. Parse do XML via regex (sem dependências externas)
//   2. Detecção de lanes e mapeamento elemento → lane
//   3. Ordenação topológica com longest-path (coluna = profundidade máxima)
//   4. Detecção de back-edges (ciclos) — roteados abaixo do diagrama
//   5. Geração de BPMNShape para pool, lanes e nós
//   6. Geração de BPMNEdge com waypoints em cotovelo (L-shape) para cross-lane
//      e linha reta para same-lane; back-edges roteados por baixo

'use strict';
const fs = require('fs');

// ─── CLI ────────────────────────────────────────────────────────────────────
const [,, inputFile, outputFile] = process.argv;
if (!inputFile || !outputFile) {
  console.error('Uso: node bpmn-layout.js <input.bpmn> <output.bpmn>');
  process.exit(1);
}
const xml = fs.readFileSync(inputFile, 'utf8');

// ─── CONSTANTES DE LAYOUT ───────────────────────────────────────────────────
const POOL_LABEL_W   = 30;   // largura do rótulo vertical do pool
const LANE_LABEL_W   = 120;  // largura do rótulo da lane
const LANE_H         = 120;  // altura de cada swimlane
const COL_W          = 180;  // largura de cada coluna
const COL_PAD        = 20;   // padding horizontal entre colunas
const ELEM_W         = 120;  // largura padrão de tarefas/eventos/gateways
const TASK_H         = 60;
const EVENT_W        = 36;
const GW_W           = 50;
const BACK_MARGIN    = 40;   // espaço abaixo das lanes para back-edges
const CONTENT_X0     = POOL_LABEL_W + LANE_LABEL_W; // x onde começam as colunas

// ─── HELPERS DE PARSE ───────────────────────────────────────────────────────
function parseAttrs(tag) {
  const attrs = {};
  const re = /(\w[\w:-]*)="([^"]*)"/g;
  let m;
  while ((m = re.exec(tag)) !== null) attrs[m[1]] = m[2];
  return attrs;
}

function getProcessId() {
  const m = xml.match(/<process\s[^>]*id="([^"]+)"/);
  return m ? m[1] : 'proc_1';
}

function getCollaborationId() {
  const m = xml.match(/<collaboration\s[^>]*id="([^"]+)"/);
  return m ? m[1] : null;
}

function getParticipants() {
  const participants = [];
  const re = /<participant\s([^>]*?)(?:\/>|>)/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const attrs = parseAttrs(m[1]);
    if (attrs.id) {
      participants.push({
        id: attrs.id,
        name: attrs.name || attrs.id,
        processRef: attrs.processRef || null,
      });
    }
  }
  return participants;
}

// ─── 1. EXTRAÇÃO DE LANES ───────────────────────────────────────────────────
const laneOrder = [];   // [laneId, ...]  — ordem de aparição no XML
const laneNames = {};   // laneId → name
const elemToLane = {};  // elemId → laneId

const laneRe = /<lane\s([^>]*)>([\s\S]*?)<\/lane>/g;
let lm;
while ((lm = laneRe.exec(xml)) !== null) {
  const attrs = parseAttrs(lm[1]);
  const id   = attrs.id;
  const name = attrs.name || id;
  laneOrder.push(id);
  laneNames[id] = name;
  const refRe = /<flowNodeRef>([^<]+)<\/flowNodeRef>/g;
  let rm;
  while ((rm = refRe.exec(lm[2])) !== null) {
    elemToLane[rm[1].trim()] = id;
  }
}

// ─── 2. EXTRAÇÃO DE NÓS ─────────────────────────────────────────────────────
const nodes = {};  // id → { id, type, name }
const nodeTagRe = /<(startEvent|endEvent|userTask|serviceTask|manualTask|scriptTask|receiveTask|sendTask|callActivity|subProcess|exclusiveGateway|parallelGateway|inclusiveGateway|eventBasedGateway|complexGateway|boundaryEvent|intermediateCatchEvent|intermediateThrowEvent)\s([^>]*?)(?:\/>|>)/g;
let nm;
while ((nm = nodeTagRe.exec(xml)) !== null) {
  const type  = nm[1];
  const attrs = parseAttrs(nm[2]);
  if (!attrs.id) continue;
  nodes[attrs.id] = { id: attrs.id, type, name: attrs.name || '' };
}

// ─── 3. EXTRAÇÃO DE FLOWS (Sequence e Message) ──────────────────────────────
const flows = [];   // { id, source, target, name, type: 'sequence' | 'message' }
const sequenceFlowRe = /<sequenceFlow\s([^>]*?)(?:\/>|>[\s\S]*?<\/sequenceFlow>)/g;
let sfm;
while ((sfm = sequenceFlowRe.exec(xml)) !== null) {
  const attrs = parseAttrs(sfm[1]);
  if (attrs.id && attrs.sourceRef && attrs.targetRef) {
    flows.push({ id: attrs.id, source: attrs.sourceRef, target: attrs.targetRef, name: attrs.name || '', type: 'sequence' });
  }
}

const messageFlowRe = /<messageFlow\s([^>]*?)(?:\/>|>[\s\S]*?<\/messageFlow>)/g;
let mfm;
while ((mfm = messageFlowRe.exec(xml)) !== null) {
  const attrs = parseAttrs(mfm[1]);
  if (attrs.id && attrs.sourceRef && attrs.targetRef) {
    flows.push({ id: attrs.id, source: attrs.sourceRef, target: attrs.targetRef, name: attrs.name || '', type: 'message' });
  }
}

if (Object.keys(nodes).length === 0) {
  console.error('bpmn-layout: nenhum nó encontrado no XML. Verifique o arquivo de entrada.');
  process.exit(1);
}

// ─── 3b. AUDITORIA: Sequence Flows cruzando pools ───────────────────────────
// Um sequenceFlow cujo source está em uma lane (pool interno) e o target NÃO
// está em nenhuma lane (pool externo) é uma violação BPMN 2.0 — deve ser messageFlow.
const crossPoolFlows = flows.filter(f =>
  f.type === 'sequence' &&
  ((elemToLane[f.source] && !elemToLane[f.target]) ||
   (!elemToLane[f.source] && elemToLane[f.target]))
);
if (crossPoolFlows.length > 0) {
  console.warn(`\n  ⚠ AVISO BPMN 2.0 — ${crossPoolFlows.length} sequenceFlow(s) cruzando fronteira de pool:`);
  for (const f of crossPoolFlows) {
    console.warn(`    [${f.id}] ${f.source} → ${f.target} (deve ser messageFlow)`);
  }
  console.warn(`  Estes fluxos serão ignorados no layout. Corrija o modelo no 03-modelador.\n`);
}

// ─── 4. TOPOLOGICAL SORT + LONGEST-PATH (coluna) ────────────────────────────
// Construção do grafo de adjacência (apenas para sequence flows)
const adj  = {};   // id → [id, ...]  (forward edges)
const radj = {};   // id → [id, ...]  (reverse edges)
for (const id of Object.keys(nodes)) { adj[id] = []; radj[id] = []; }
for (const f of flows) {
  if (f.type !== 'sequence') continue;
  if (adj[f.source])  adj[f.source].push(f.target);
  if (radj[f.target]) radj[f.target].push(f.source);
}

// Kahn's algorithm para detectar back-edges e obter topological order
const inDeg = {};
for (const id of Object.keys(nodes)) inDeg[id] = 0;
for (const f of flows) { 
  if (f.type === 'sequence' && inDeg[f.target] !== undefined) inDeg[f.target]++; 
}

const queue = Object.keys(nodes).filter(id => inDeg[id] === 0);
const topoOrder = [];
const visited = new Set();
while (queue.length > 0) {
  const cur = queue.shift();
  if (visited.has(cur)) continue;
  visited.add(cur);
  topoOrder.push(cur);
  for (const nxt of adj[cur]) {
    if (!visited.has(nxt)) {
      inDeg[nxt]--;
      if (inDeg[nxt] <= 0) queue.push(nxt);
    }
  }
}
// Nós não alcançados (ciclos) → adicionar no fim
for (const id of Object.keys(nodes)) {
  if (!visited.has(id)) topoOrder.push(id);
}

// Detecção de back-edges: uma aresta (u→v) é back-edge se v aparece antes de u na ordem topo
const topoPos = {};
topoOrder.forEach((id, i) => topoPos[id] = i);
const backEdgeSet = new Set(); // flowId
for (const f of flows) {
  if (f.type === 'sequence' && (topoPos[f.source] ?? 0) >= (topoPos[f.target] ?? 0)) {
    backEdgeSet.add(f.id);
  }
}

// Longest-path em DAG (ignorando back-edges) → determina coluna de cada nó
const col = {};
for (const id of Object.keys(nodes)) col[id] = 0;
for (const id of topoOrder) {
  for (const f of flows) {
    if (f.type !== 'sequence' || f.source !== id) continue;
    if (backEdgeSet.has(f.id)) continue;
    if ((col[f.target] ?? 0) <= col[id]) {
      col[f.target] = col[id] + 1;
    }
  }
}

// ─── 5. ASSIGNMENT DE LINHAS DENTRO DE CADA (lane × col) ────────────────────
// Conta quantos elementos há por (lane, col) → row dentro da célula
const cellCount = {};  // `${laneId}|${col}` → count
const nodeRow   = {};  // nodeId → row dentro da célula (0-indexed)

for (const id of topoOrder) {
  const laneId = elemToLane[id];
  if (!laneId) continue;
  const c = col[id] ?? 0;
  const key = `${laneId}|${c}`;
  const row = cellCount[key] ?? 0;
  nodeRow[id] = row;
  cellCount[key] = row + 1;
}

// Altura real de cada lane (min LANE_H, mas cresce se muitos elementos por célula)
const laneHeights = {};
for (const laneId of laneOrder) {
  let maxRows = 1;
  for (const key of Object.keys(cellCount)) {
    const [lid] = key.split('|');
    if (lid === laneId) maxRows = Math.max(maxRows, cellCount[key]);
  }
  laneHeights[laneId] = Math.max(LANE_H, maxRows * (TASK_H + 20));
}

// Y de início de cada lane
const laneY = {};
let curY = 0;
for (const laneId of laneOrder) {
  laneY[laneId] = curY;
  curY += laneHeights[laneId];
}
const totalLanesH = curY;

// Número de colunas
const maxCol = Math.max(0, ...Object.values(col)) + 1;
const totalW = CONTENT_X0 + maxCol * COL_W + COL_PAD;

// ─── 6. CÁLCULO DE BOUNDS POR NÓ ────────────────────────────────────────────
function elemSize(type) {
  if (type === 'startEvent' || type === 'endEvent' ||
      type.includes('IntermediateCatch') || type.includes('IntermediateThrow')) {
    return { w: EVENT_W, h: EVENT_W };
  }
  if (type.includes('Gateway')) {
    return { w: GW_W, h: GW_W };
  }
  return { w: ELEM_W, h: TASK_H };
}

const bounds = {};  // nodeId → {x, y, w, h}
for (const id of Object.keys(nodes)) {
  const laneId = elemToLane[id];
  if (!laneId) continue;
  const c       = col[id] ?? 0;
  const row     = nodeRow[id] ?? 0;
  const { w, h } = elemSize(nodes[id].type);
  const lH      = laneHeights[laneId];
  const rowH    = lH / (cellCount[`${laneId}|${c}`] || 1);

  const x = CONTENT_X0 + c * COL_W + (COL_W - w) / 2;
  const y = laneY[laneId] + row * rowH + (rowH - h) / 2;
  bounds[id] = { x: Math.round(x), y: Math.round(y), w, h };
}

// ─── 7. GERAÇÃO DO XML DI ───────────────────────────────────────────────────
const processId       = getProcessId();
const collaborationId = getCollaborationId();
const participants    = getParticipants();
const mainParticipant = participants.find(p => p.processRef === processId);
const mainPartId      = mainParticipant ? mainParticipant.id : `pool_${processId}`;
const externalParticipants = participants.filter(p => !p.processRef);

const EXT_POOL_H      = 60;
const EXT_POOL_MARGIN = 20;

// Y para os pools externos e margem de back-edges
const extPoolsY0 = totalLanesH + 100; // Afasta os pools externos para dar espaço a back-edges
const backEdgeY  = totalLanesH + BACK_MARGIN; 

const shapeLines = [];

// Pool shape (contentor externo)
shapeLines.push(
  `    <bpmndi:BPMNShape id="${mainPartId}_di" bpmnElement="${mainPartId}" isHorizontal="true">`,
  `      <dc:Bounds x="0" y="0" width="${totalW}" height="${totalLanesH}" />`,
  `    </bpmndi:BPMNShape>`
);

// Adicionar bounds dos pools externos ao mapa de bounds para roteamento de MessageFlow
let extY = extPoolsY0;
for (const ext of externalParticipants) {
  bounds[ext.id] = { x: 0, y: extY, w: totalW, h: EXT_POOL_H };
  shapeLines.push(
    `    <bpmndi:BPMNShape id="${ext.id}_di" bpmnElement="${ext.id}" isHorizontal="true">`,
    `      <dc:Bounds x="0" y="${extY}" width="${totalW}" height="${EXT_POOL_H}" />`,
    `    </bpmndi:BPMNShape>`
  );
  extY += EXT_POOL_H + EXT_POOL_MARGIN;
}

// Lane shapes
for (const laneId of laneOrder) {
  const y = laneY[laneId];
  const h = laneHeights[laneId];
  shapeLines.push(
    `    <bpmndi:BPMNShape id="${laneId}_di" bpmnElement="${laneId}" isHorizontal="true">`,
    `      <dc:Bounds x="${POOL_LABEL_W}" y="${y}" width="${totalW - POOL_LABEL_W}" height="${h}" />`,
    `    </bpmndi:BPMNShape>`
  );
}

// Node shapes
for (const id of Object.keys(nodes)) {
  const b = bounds[id];
  if (!b) continue;
  const isGateway = nodes[id].type.includes('Gateway');
  const extra = isGateway ? ' isMarkerVisible="true"' : '';
  shapeLines.push(
    `    <bpmndi:BPMNShape id="${id}_di" bpmnElement="${id}"${extra}>`,
    `      <dc:Bounds x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" />`,
    `    </bpmndi:BPMNShape>`
  );
}

// Edge shapes (BPMNEdge com waypoints)
const edgeLines = [];

for (const f of flows) {
  const src = bounds[f.source];
  const tgt = bounds[f.target];
  if (!src || !tgt) continue;

  const isBack = backEdgeSet.has(f.id);
  const isMessage = f.type === 'message';

  let waypoints = [];

  if (isBack) {
    // Back-edge: sai por baixo, passa pela calha BACK_MARGIN, entra por baixo
    waypoints = [
      { x: Math.round(src.x + src.w / 2), y: src.y + src.h },
      { x: Math.round(src.x + src.w / 2), y: backEdgeY },
      { x: Math.round(tgt.x + tgt.w / 2), y: backEdgeY },
      { x: Math.round(tgt.x + tgt.w / 2), y: tgt.y + tgt.h }
    ];
  } else if (isMessage) {
    // Message Flow: liga centro-inferior da origem ao centro-superior do destino (ou vice-versa)
    // Usa X de cada extremidade corretamente (fix: antes usava src.x para ambos os pontos)
    const srcMidX = Math.round(src.x + src.w / 2);
    const tgtMidX = Math.round(tgt.x + tgt.w / 2);
    if (src.y < tgt.y) {
      waypoints = [
        { x: srcMidX, y: src.y + src.h },
        { x: tgtMidX, y: tgt.y }
      ];
    } else {
      waypoints = [
        { x: srcMidX, y: src.y },
        { x: tgtMidX, y: tgt.y + tgt.h }
      ];
    }
  } else {
    // Sequence Flow padrão (cotovelo L se mudar de lane, reta se mesma lane)
    const srcLane = elemToLane[f.source];
    const tgtLane = elemToLane[f.target];
    if (srcLane && tgtLane && srcLane !== tgtLane) {
      const midX = Math.round(src.x + src.w + (tgt.x - (src.x + src.w)) / 2);
      waypoints = [
        { x: src.x + src.w, y: Math.round(src.y + src.h / 2) },
        { x: midX, y: Math.round(src.y + src.h / 2) },
        { x: midX, y: Math.round(tgt.y + tgt.h / 2) },
        { x: tgt.x, y: Math.round(tgt.y + tgt.h / 2) }
      ];
    } else {
      waypoints = [
        { x: src.x + src.w, y: Math.round(src.y + src.h / 2) },
        { x: tgt.x, y: Math.round(tgt.y + tgt.h / 2) }
      ];
    }
  }

  const wStr = waypoints.map(p => `      <di:waypoint x="${p.x}" y="${p.y}" />`).join('\n');

  // BPMNLabel: posiciona o texto no ponto médio da aresta (fix: antes era omitido)
  let labelStr = '';
  if (f.name) {
    const midX = Math.round((waypoints[0].x + waypoints[waypoints.length - 1].x) / 2) - 25;
    const midY = Math.round((waypoints[0].y + waypoints[waypoints.length - 1].y) / 2) - 14;
    labelStr = `\n      <bpmndi:BPMNLabel>\n        <dc:Bounds x="${midX}" y="${midY}" width="50" height="14" />\n      </bpmndi:BPMNLabel>`;
  }

  edgeLines.push(
    `    <bpmndi:BPMNEdge id="${f.id}_di" bpmnElement="${f.id}">`,
    wStr + labelStr,
    `    </bpmndi:BPMNEdge>`
  );
}

// ─── 8. INJEÇÃO E LIMPEZA FINAL ─────────────────────────────────────────────
const diBlock = [
  `  <bpmndi:BPMNDiagram id="BPMNDiagram_1">`,
  `    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${collaborationId || processId}">`,
  shapeLines.join('\n'),
  edgeLines.join('\n'),
  `    </bpmndi:BPMNPlane>`,
  `  </bpmndi:BPMNDiagram>`
].join('\n');

let result = xml;

// Limpeza de atributos não padrão que quebram o Bizagi (isExecutable em participant)
result = result.replace(/(<participant\s[^>]*)\sisExecutable="[^"]*"/g, '$1');

// Substitui bloco BPMNDiagram completo
if (/<bpmndi:BPMNDiagram[\s\S]*?<\/bpmndi:BPMNDiagram>/.test(result)) {
  result = result.replace(/<bpmndi:BPMNDiagram[\s\S]*?<\/bpmndi:BPMNDiagram>/, diBlock);
} else {
  result = result.replace(/<\/definitions>/, `${diBlock}\n</definitions>`);
}

fs.writeFileSync(outputFile, result, 'utf8');

console.log(`bpmn-layout: OK (incluindo MessageFlows e correções Bizagi)`);
console.log(`  Output  : ${outputFile}`);


// ─── RELATÓRIO ──────────────────────────────────────────────────────────────
const nShapes  = Object.keys(nodes).length + laneOrder.length + 1; // +1 pool
const nEdges   = edgeLines.length / 3; // cada edge tem 3 linhas
const nBack    = [...backEdgeSet].length;

console.log(`bpmn-layout: OK`);
console.log(`  Lanes   : ${laneOrder.length} (${laneOrder.map(id => laneNames[id]).join(', ')})`);
console.log(`  Colunas : ${maxCol}`);
console.log(`  Shapes  : ${nShapes} (${Object.keys(nodes).length} nós + ${laneOrder.length} lanes + 1 pool)`);
console.log(`  Edges   : ${Math.round(nEdges)} (${nBack} back-edge${nBack !== 1 ? 's' : ''} roteado${nBack !== 1 ? 's' : ''} abaixo das lanes)`);
console.log(`  Output  : ${outputFile}`);
