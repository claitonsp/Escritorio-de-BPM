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

// ─── 3. EXTRAÇÃO DE SEQUENCEFLOWS ───────────────────────────────────────────
const flows = [];   // { id, source, target, name }
const flowRe = /<sequenceFlow\s([^>]*?)(?:\/>|>[\s\S]*?<\/sequenceFlow>)/g;
let fm;
while ((fm = flowRe.exec(xml)) !== null) {
  const attrs = parseAttrs(fm[1]);
  if (attrs.id && attrs.sourceRef && attrs.targetRef) {
    flows.push({ id: attrs.id, source: attrs.sourceRef, target: attrs.targetRef, name: attrs.name || '' });
  }
}

if (Object.keys(nodes).length === 0) {
  console.error('bpmn-layout: nenhum nó encontrado no XML. Verifique o arquivo de entrada.');
  process.exit(1);
}

// ─── 4. TOPOLOGICAL SORT + LONGEST-PATH (coluna) ────────────────────────────
// Construção do grafo de adjacência
const adj  = {};   // id → [id, ...]  (forward edges)
const radj = {};   // id → [id, ...]  (reverse edges)
for (const id of Object.keys(nodes)) { adj[id] = []; radj[id] = []; }
for (const f of flows) {
  if (adj[f.source])  adj[f.source].push(f.target);
  if (radj[f.target]) radj[f.target].push(f.source);
}

// Kahn's algorithm para detectar back-edges e obter topological order
const inDeg = {};
for (const id of Object.keys(nodes)) inDeg[id] = 0;
for (const f of flows) { if (inDeg[f.target] !== undefined) inDeg[f.target]++; }

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
  if ((topoPos[f.source] ?? 0) >= (topoPos[f.target] ?? 0)) {
    backEdgeSet.add(f.id);
  }
}

// Longest-path em DAG (ignorando back-edges) → determina coluna de cada nó
const col = {};
for (const id of Object.keys(nodes)) col[id] = 0;
for (const id of topoOrder) {
  for (const f of flows) {
    if (f.source !== id) continue;
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
const processId = getProcessId();
const poolId    = `pool_${processId}`;

const shapeLines = [];

// Pool shape (contentor externo)
shapeLines.push(
  `    <bpmndi:BPMNShape id="${poolId}_di" bpmnElement="${poolId}" isHorizontal="true">`,
  `      <dc:Bounds x="0" y="0" width="${totalW}" height="${totalLanesH}" />`,
  `    </bpmndi:BPMNShape>`
);

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
  const isEvent   = nodes[id].type === 'startEvent' || nodes[id].type === 'endEvent' ||
                    nodes[id].type.includes('Intermediate');
  const extra = isGateway ? ' isMarkerVisible="true"' : '';
  shapeLines.push(
    `    <bpmndi:BPMNShape id="${id}_di" bpmnElement="${id}"${extra}>`,
    `      <dc:Bounds x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" />`,
    `    </bpmndi:BPMNShape>`
  );
}

// Edge shapes (BPMNEdge com waypoints)
const edgeLines = [];
const backEdgeY = totalLanesH + BACK_MARGIN; // Y para rotear back-edges abaixo das lanes

for (const f of flows) {
  const src = bounds[f.source];
  const tgt = bounds[f.target];
  if (!src || !tgt) {
    console.warn(`  Aviso: edge ${f.id} sem bounds (${f.source} ou ${f.target} não posicionado)`);
    continue;
  }

  const srcLane = elemToLane[f.source];
  const tgtLane = elemToLane[f.target];
  const crossLane = srcLane !== tgtLane;
  const isBack    = backEdgeSet.has(f.id);

  // Pontos de saída / entrada (centro-direita / centro-esquerda por padrão)
  const x1 = src.x + src.w;
  const y1 = Math.round(src.y + src.h / 2);
  const x2 = tgt.x;
  const y2 = Math.round(tgt.y + tgt.h / 2);

  let waypoints;

  if (isBack) {
    // Back-edge: sai pela parte inferior da origem, desce abaixo das lanes, entra pelo topo do destino
    const srcBot = src.y + src.h;
    const tgtBot = tgt.y + tgt.h;
    const mx     = Math.round((src.x + src.w / 2 + tgt.x + tgt.w / 2) / 2);
    waypoints = [
      { x: Math.round(src.x + src.w / 2), y: srcBot },
      { x: Math.round(src.x + src.w / 2), y: backEdgeY },
      { x: Math.round(tgt.x + tgt.w / 2), y: backEdgeY },
      { x: Math.round(tgt.x + tgt.w / 2), y: tgt.y }
    ];
  } else if (crossLane) {
    // Seta em L: horizontal até o ponto médio X, depois vertical até a lane alvo, depois horizontal
    const midX = Math.round(x1 + (x2 - x1) / 2);
    waypoints = [
      { x: x1, y: y1 },
      { x: midX, y: y1 },
      { x: midX, y: y2 },
      { x: x2, y: y2 }
    ];
  } else {
    // Mesma lane: linha reta
    waypoints = [
      { x: x1, y: y1 },
      { x: x2, y: y2 }
    ];
  }

  const wStr = waypoints.map(p => `      <di:waypoint x="${p.x}" y="${p.y}" />`).join('\n');
  edgeLines.push(
    `    <bpmndi:BPMNEdge id="${f.id}_di" bpmnElement="${f.id}">`,
    wStr,
    `    </bpmndi:BPMNEdge>`
  );
}

// ─── 8. INJEÇÃO DO DI NO XML ORIGINAL ───────────────────────────────────────
// Limpa qualquer BPMNPlane existente e substitui
const diBlock = [
  `  <bpmndi:BPMNDiagram id="BPMNDiagram_1">`,
  `    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${processId}">`,
  shapeLines.join('\n'),
  edgeLines.join('\n'),
  `    </bpmndi:BPMNPlane>`,
  `  </bpmndi:BPMNDiagram>`
].join('\n');

// Substitui bloco BPMNDiagram completo (ou injeta antes de </definitions>)
let result;
if (/<bpmndi:BPMNDiagram[\s\S]*?<\/bpmndi:BPMNDiagram>/.test(xml)) {
  result = xml.replace(/<bpmndi:BPMNDiagram[\s\S]*?<\/bpmndi:BPMNDiagram>/, diBlock);
} else {
  result = xml.replace(/<\/definitions>/, `${diBlock}\n</definitions>`);
}

fs.writeFileSync(outputFile, result, 'utf8');

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
