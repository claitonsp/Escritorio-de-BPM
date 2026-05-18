#!/usr/bin/env node
// bpmn-layout.js — Layout engine próprio para BPMN 2.0 com swimlanes
// Substitui: bpmn-auto-layout + di-injector + edge-injector
//
// Uso: node bpmn-layout.js <input.bpmn> <output.bpmn>
//
// Algoritmo:
//   1. Parse do XML via regex (sem dependências externas)
//   2. Detecção de lanes e mapeamento elemento → lane
//   3. DFS iterativo com pilha explícita → ordem topológica + back-edges (ciclos)
//      [Kahn's foi descartado: não resolve grafos com ciclos de negócio — nós do
//       ciclo ficavam presos com inDeg>0 e eram inseridos em posição arbitrária,
//       corrompendo o longest-path e gerando setas que atravessavam o diagrama]
//   4. Longest-path no DAG (ignorando back-edges) → coluna = profundidade máxima
//   5. Geração de BPMNShape para pool, lanes e nós
//   6. Roteamento Port-Aware com separação de corredores:
//      - Back-edge intra-lane Row 1 : PISO da raia (laneY + laneH - 15) → sai/entra pelo fundo
//      - Back-edge intra-lane Row 0 : TETO da raia (laneY + 15) → sai/entra pelo topo
//      - Back-edge cross-lane       : calha inferior global (backEdgeY)
//      - MessageFlow                : calha lateral (gutter) da coluna de origem
//      - SequenceFlow mesmo Y       : horizontal direta (direita → esquerda)
//      - SequenceFlow descendo      : sai pelo fundo, L via srcMidX, entra na esquerda
//      - SequenceFlow subindo       : sai pelo topo, L via srcMidX, entra na esquerda

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
const LANE_H         = 120;  // altura mínima de cada swimlane
const COL_W          = 180;  // largura de cada coluna
const COL_PAD        = 40;   // padding horizontal entre colunas
const ELEM_W         = 120;  // largura padrão de tarefas/eventos/gateways
const TASK_H         = 60;
const EVENT_W        = 36;
const GW_W           = 50;
const BACK_MARGIN    = 40;   // espaço abaixo das lanes para back-edges
// ── Gutters de raia: corredores livres para loops e message flows ─────────────
// TOP_GUTTER garante 30px acima de todos os elementos → loop pode passar em y=15
// BOTTOM_GUTTER garante 30px abaixo → seta de descida tem espaço antes da calha inferior
// ROW_PAD é o espaço vertical entre linhas de elementos na mesma lane
const TOP_GUTTER     = 30;
const BOTTOM_GUTTER  = 30;
const ROW_PAD        = 120;
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
const nodeTagRe = /<(?:[\w-]+:)?(startEvent|endEvent|userTask|serviceTask|manualTask|scriptTask|receiveTask|sendTask|callActivity|subProcess|exclusiveGateway|parallelGateway|inclusiveGateway|eventBasedGateway|complexGateway|boundaryEvent|intermediateCatchEvent|intermediateThrowEvent|dataObjectReference)\s([^>]*?)(?:\/>|>)/g;
let nm;
while ((nm = nodeTagRe.exec(xml)) !== null) {
  const type  = nm[1];
  const attrs = parseAttrs(nm[2]);
  if (!attrs.id) continue;
  nodes[attrs.id] = { id: attrs.id, type, name: attrs.name || '' };
}

// Mapeamento de dataObjectReferences para suas atividades associadas
const docToActivity = {}; // docRefId -> { activityId, type: 'input' | 'output', assocId }

// Parse de top-level associations (ligação explícita de documentos para maior compatibilidade com o Bizagi)
const associationRe = /<association\s([^>]*?)(?:\/>|>[\s\S]*?<\/association>)/g;
let am;
while ((am = associationRe.exec(xml)) !== null) {
  const attrs = parseAttrs(am[1]);
  if (attrs.id && attrs.sourceRef && attrs.targetRef) {
    const isSourceDoc = attrs.sourceRef.startsWith('DataObj_');
    const isTargetDoc = attrs.targetRef.startsWith('DataObj_');
    
    if (isSourceDoc && !isTargetDoc) {
      // Documento -> Atividade (Input)
      docToActivity[attrs.sourceRef] = { activityId: attrs.targetRef, type: 'input', assocId: attrs.id };
    } else if (!isSourceDoc && isTargetDoc) {
      // Atividade -> Documento (Output)
      docToActivity[attrs.targetRef] = { activityId: attrs.sourceRef, type: 'output', assocId: attrs.id };
    }
  }
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

// Adiciona data associations à lista de flows para renderização de edges
const associationRe2 = /<association\s([^>]*?)(?:\/>|>[\s\S]*?<\/association>)/g;
let am2;
while ((am2 = associationRe2.exec(xml)) !== null) {
  const attrs = parseAttrs(am2[1]);
  if (attrs.id && attrs.sourceRef && attrs.targetRef) {
    flows.push({ id: attrs.id, source: attrs.sourceRef, target: attrs.targetRef, name: '', type: 'association' });
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

// ─── 4. TOPOLOGICAL SORT (DFS iterativo) + LONGEST-PATH ─────────────────────
// Filtramos dataObjectReference dos nós que participam do fluxo
const logicalNodeIds = Object.keys(nodes).filter(id => nodes[id].type !== 'dataObjectReference');

const adj = {};
for (const id of logicalNodeIds) adj[id] = [];
for (const f of flows) {
  if (f.type === 'sequence' && adj[f.source]) adj[f.source].push({ target: f.target, flowId: f.id });
}

// DFS iterativo com detecção de back-edges (estado por nó: 0=novo 1=na pilha 2=concluído)
const state = {};
for (const id of logicalNodeIds) state[id] = 0;
const backEdgeSet = new Set();
const topoOrder   = [];

// Acha nós de entrada para iniciar a DFS
const inDeg = {};
for (const id of logicalNodeIds) inDeg[id] = 0;
for (const f of flows) {
  if (f.type === 'sequence' && inDeg[f.target] !== undefined) inDeg[f.target]++;
}
const startNodes = logicalNodeIds.filter(id => inDeg[id] === 0);
const allNodes   = [...startNodes, ...logicalNodeIds.filter(id => inDeg[id] > 0)];

for (const root of allNodes) {
  if (state[root] !== 0) continue;

  // Pilha explícita: cada frame guarda [nodeId, índice do próximo filho a processar]
  const stack = [[root, 0]];
  state[root] = 1;

  while (stack.length > 0) {
    const frame = stack[stack.length - 1];
    const [u, idx] = frame;

    if (idx < adj[u].length) {
      frame[1]++;                    // avança o cursor do frame
      const { target: v, flowId } = adj[u][idx];

      if (state[v] === 1) {
        backEdgeSet.add(flowId);     // aresta de retorno = back-edge (ciclo)
      } else if (state[v] === 0) {
        state[v] = 1;
        stack.push([v, 0]);
      }
    } else {
      stack.pop();
      state[u] = 2;
      topoOrder.push(u);            // push + reverse no fim = O(n), não O(n²)
    }
  }
}
topoOrder.reverse();

// Longest-path no DAG ignorando back-edges → coluna de cada nó
const col = {};
for (const id of logicalNodeIds) col[id] = 0;
for (const id of topoOrder) {
  for (const { target: v, flowId } of adj[id]) {
    if (backEdgeSet.has(flowId)) continue;
    if ((col[v] ?? 0) <= col[id]) col[v] = col[id] + 1;
  }
}

// Atribui coluna e lane dos dataObjectReferences de forma associativa
for (const id of Object.keys(nodes)) {
  if (nodes[id].type === 'dataObjectReference' && docToActivity[id]) {
    const actId = docToActivity[id].activityId;
    col[id] = col[actId] ?? 0;
    elemToLane[id] = elemToLane[actId];
  }
}


// ─── 5. ASSIGNMENT DE LINHAS COM Y-SORTING POR ATRAÇÃO DE BORDA ─────────────
// O algoritmo padrão (ordem de chegada do DFS) é cego para quem tem MessageFlow.
// Isso causa cruzamentos: nós puramente internos ficam no topo, e nós com
// MessageFlow ficam embaixo — a linha de mensagem rasga os nós intermediários.
//
// Regra de Atração de Borda (Border Magnetism):
//   Peso  1 → nó tem MessageFlow com pool externo → afunda para a base da lane (row 1, 2...)
//   Peso  0 → nó puramente interno                → topo (row 0)
//
// Efeito: "Baixar Título via Sistema" (sem fluxo externo) fica no topo;
// "Acionar Cliente" (messageFlow para parte-cliente) afunda para a base da célula.
// Como o pool externo fica embaixo da pipeline, a linha de mensagem cai limpa sem cruzar ninguém.

// IDs de pools externos (participants sem processRef = Black Box pools)
const _sortParticipants = getParticipants();
const _extPoolIds       = new Set(
  _sortParticipants.filter(p => !p.processRef).map(p => p.id)
);

// Peso direcional: 1 se o nó se comunica (origem ou destino) com pool externo (fundo)
function _msgBorderWeight(nodeId) {
  for (const f of flows) {
    if (f.type !== 'message') continue;
    if (f.source === nodeId && _extPoolIds.has(f.target)) return 1;
    if (f.target === nodeId && _extPoolIds.has(f.source)) return 1;
  }
  return 0;
}

// Agrupar nós por (lane × col) em ordem topológica (garante DFS order no empate)
const _cellGroups = {};
for (const id of topoOrder) {
  const laneId = elemToLane[id];
  if (!laneId) continue;
  const c   = col[id] ?? 0;
  const key = `${laneId}|${c}`;
  if (!_cellGroups[key]) _cellGroups[key] = [];
  _cellGroups[key].push(id);
}

// Ordenar cada célula por peso (−1 primeiro = topo) e atribuir rows
const cellCount = {};
const nodeRow   = {};

for (const [key, group] of Object.entries(_cellGroups)) {
  group.sort((a, b) => _msgBorderWeight(a) - _msgBorderWeight(b));
  group.forEach((id, i) => { nodeRow[id] = i; });
  cellCount[key] = group.length;
}

// Altura real de cada lane com GUTTERS explícitos:
//   laneH = TOP_GUTTER + (maxRows × TASK_H) + ((maxRows-1) × ROW_PAD) + BOTTOM_GUTTER
// TOP_GUTTER (30px) → corredor livre para loops no teto e descidas de message flow
// BOTTOM_GUTTER (30px) → corredor livre antes da calha inferior
// ROW_PAD (20px) → espaço respirável entre linhas de elementos
const laneHeights = {};
for (const laneId of laneOrder) {
  let maxRows = 1;
  for (const key of Object.keys(cellCount)) {
    const [lid] = key.split('|');
    if (lid === laneId) maxRows = Math.max(maxRows, cellCount[key]);
  }
  laneHeights[laneId] = Math.max(
    LANE_H,
    TOP_GUTTER + (maxRows * TASK_H) + ((maxRows - 1) * ROW_PAD) + BOTTOM_GUTTER
  );
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
  const t = type.toLowerCase();
  if (t === 'dataobjectreference') {
    return { w: 36, h: 50 };
  }
  if (t === 'startevent' || t === 'endevent' ||
      t.includes('intermediatecatch') || t.includes('intermediatethrow')) {
    return { w: EVENT_W, h: EVENT_W };
  }
  if (t.includes('gateway')) {
    return { w: GW_W, h: GW_W };
  }
  return { w: ELEM_W, h: TASK_H };
}

const bounds = {};  // nodeId → {x, y, w, h}
for (const id of Object.keys(nodes)) {
  if (nodes[id].type === 'dataObjectReference') continue;
  const laneId = elemToLane[id];
  if (!laneId) continue;
  const c   = col[id] ?? 0;
  const row = nodeRow[id] ?? 0;
  const { w, h } = elemSize(nodes[id].type);

  const x = CONTENT_X0 + c * COL_W + (COL_W - w) / 2;

  // Y com gutters explícitos:
  //   yCenter = laneY + TOP_GUTTER + row*(TASK_H + ROW_PAD) + TASK_H/2
  //   y = yCenter - h/2
  // TASK_H/2 centraliza elementos de qualquer altura dentro do slot de 60px.
  // Eventos (h=36) e gateways (h=50) ficam centrados no slot, tasks (h=60) o preenchem.
  const yCenter = laneY[laneId] + TOP_GUTTER + (row * (TASK_H + ROW_PAD)) + (TASK_H / 2);
  const y       = yCenter - (h / 2);

  bounds[id] = { x: Math.round(x), y: Math.round(y), w, h };
}

// Segundo pass: calcula bounds dos dataObjectReferences com distribuição horizontal simétrica
const actDocs = {}; // activityId -> { inputs: [], outputs: [] }
for (const id of Object.keys(nodes)) {
  if (nodes[id].type !== 'dataObjectReference') continue;
  const assoc = docToActivity[id];
  if (assoc) {
    if (!actDocs[assoc.activityId]) {
      actDocs[assoc.activityId] = { inputs: [], outputs: [] };
    }
    if (assoc.type === 'input') {
      actDocs[assoc.activityId].inputs.push(id);
    } else {
      actDocs[assoc.activityId].outputs.push(id);
    }
  }
}

for (const [actId, docs] of Object.entries(actDocs)) {
  const actB = bounds[actId];
  if (!actB) continue;
  
  const w = 36;
  const h = 50;
  
  // Posiciona múltiplos inputs acima do elemento de forma distribuída
  if (docs.inputs.length > 0) {
    const totalW = docs.inputs.length * w + (docs.inputs.length - 1) * 15;
    let startX = actB.x + (actB.w - totalW) / 2;
    docs.inputs.forEach((id, index) => {
      const x = startX + index * (w + 15);
      const y = actB.y - 65;
      bounds[id] = { x: Math.round(x), y: Math.round(y), w, h };
    });
  }
  
  // Posiciona múltiplos outputs abaixo do elemento de forma distribuída
  if (docs.outputs.length > 0) {
    const totalW = docs.outputs.length * w + (docs.outputs.length - 1) * 15;
    let startX = actB.x + (actB.w - totalW) / 2;
    docs.outputs.forEach((id, index) => {
      const x = startX + index * (w + 15);
      const y = actB.y + actB.h + 15;
      bounds[id] = { x: Math.round(x), y: Math.round(y), w, h };
    });
  }
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
// poolH engloba a calha de back-edges quando existirem, para que as setas de retorno
// fiquem dentro do contêiner principal e não no "limbo" entre as piscinas.
const backEdgeY  = totalLanesH + BACK_MARGIN;
const poolH      = backEdgeSet.size > 0 ? totalLanesH + BACK_MARGIN * 2 : totalLanesH;
const extPoolsY0 = poolH + 20;

const shapeLines = [];

// Pool shape (contentor externo)
shapeLines.push(
  `    <bpmndi:BPMNShape id="${mainPartId}_di" bpmnElement="${mainPartId}" isHorizontal="true">`,
  `      <dc:Bounds x="0" y="0" width="${totalW}" height="${poolH}" />`,
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
  
  if (nodes[id].type === 'dataObjectReference') {
    const assoc = docToActivity[id];
    const isInput = assoc && assoc.type === 'input';
    const labelW = 120;
    const labelH = 30; // 30px de altura para suportar quebra de linha elegante no Bizagi
    const labelX = Math.round(b.x + (b.w - labelW) / 2);
    // Se for input, coloca o label ACIMA (b.y - 35). Se for output, coloca ABAIXO (b.y + b.h + 5)
    const labelY = Math.round(isInput ? b.y - 35 : b.y + b.h + 5);
    
    shapeLines.push(
      `    <bpmndi:BPMNShape id="${id}_di" bpmnElement="${id}">`,
      `      <dc:Bounds x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" />`,
      `      <bpmndi:BPMNLabel>`,
      `        <dc:Bounds x="${labelX}" y="${labelY}" width="${labelW}" height="${labelH}" />`,
      `      </bpmndi:BPMNLabel>`,
      `    </bpmndi:BPMNShape>`
    );
  } else {
    shapeLines.push(
      `    <bpmndi:BPMNShape id="${id}_di" bpmnElement="${id}"${extra}>`,
      `      <dc:Bounds x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" />`,
      `    </bpmndi:BPMNShape>`
    );
  }
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
    const srcLane = elemToLane[f.source];
    const tgtLane = elemToLane[f.target];

    if (srcLane && tgtLane && srcLane === tgtLane) {
      // Verifica se a origem OU o destino estão na linha de baixo (Row 1)
      const srcIsBottom = src.y > laneY[srcLane] + (laneHeights[srcLane] / 2) - 20;
      const tgtIsBottom = tgt.y > laneY[tgtLane] + (laneHeights[tgtLane] / 2) - 20;
      const useBottom = srcIsBottom || tgtIsBottom;

      if (useBottom) {
        // Loop saindo do Fundo (Piso da Raia) para não cruzar a Row 0
        const bottomGutterY = laneY[srcLane] + laneHeights[srcLane] - 15;
        waypoints = [
          { x: Math.round(src.x + src.w / 2), y: src.y + src.h }, // Sai por baixo
          { x: Math.round(src.x + src.w / 2), y: bottomGutterY },
          { x: Math.round(tgt.x + tgt.w / 2), y: bottomGutterY },
          { x: Math.round(tgt.x + tgt.w / 2), y: tgt.y + tgt.h }  // Entra por baixo
        ];
      } else {
        // Loop saindo do Teto da Raia (Row 0)
        const topGutterY = laneY[srcLane] + 15;
        waypoints = [
          { x: Math.round(src.x + src.w / 2), y: src.y },          // Sai por cima
          { x: Math.round(src.x + src.w / 2), y: topGutterY },
          { x: Math.round(tgt.x + tgt.w / 2), y: topGutterY },
          { x: Math.round(tgt.x + tgt.w / 2), y: tgt.y }           // Entra por cima
        ];
      }
    } else {
      // Loop Global (Cross-lane)
      waypoints = [
        { x: Math.round(src.x + src.w / 2), y: src.y + src.h },
        { x: Math.round(src.x + src.w / 2), y: backEdgeY },
        { x: Math.round(tgt.x + tgt.w / 2), y: backEdgeY },
        { x: Math.round(tgt.x + tgt.w / 2), y: tgt.y + tgt.h }
      ];
    }
  } else if (isMessage) {
    // ── Message Flow: linhas verticais limpas com conexão nas bordas corretas ─
    //
    // Princípio: MessageFlow cruza fronteiras de pool — deve ir verticalmente
    // pelo ponto de conexão do elemento (centro-X), sem cotovelos desnecessários
    // que criem tráfego no mesmo corredor que os back-edges de retrabalho.
    //
    // Separação de corredores:
    //   Back-edges intra-lane  → piso da raia (laneY + laneH - 15)
    //   Message Flows          → corredor central (srcMidX vertical)
    //   Sequence Flows cross-Y → calhas entre colunas (gX)
    const srcMidX   = Math.round(src.x + src.w / 2);
    const tgtMidX   = Math.round(tgt.x + tgt.w / 2);
    const srcIsPool = src.w === totalW;
    const tgtIsPool = tgt.w === totalW;

    // X da calha à direita da coluna do nó de origem.
    // Usamos o espaço entre o elemento (ELEM_W) e o fim da coluna (COL_W).
    const srcColIdx = col[f.source] !== undefined ? col[f.source] : 0;
    const gX = Math.round(CONTENT_X0 + srcColIdx * COL_W + ELEM_W + (COL_W - ELEM_W)/2);

    if (srcIsPool) {
      // Pool externo → Nó interno: linha vertical alinhada ao midX do nó destino.
      // Nó destino geralmente em col 0–1 com espaço livre à esquerda.
      const startY = src.y < tgt.y ? src.y + src.h : src.y;
      const endY   = tgt.y < src.y ? tgt.y + tgt.h : tgt.y;
      waypoints = [
        { x: tgtMidX, y: startY },
        { x: tgtMidX, y: endY }
      ];
    } else if (tgtIsPool) {
      // Nó interno → Pool externo: usa CALHA (gutter) da coluna do nó.
      // Evita qualquer elemento que esteja na mesma coluna (mesmo row diferente).
      // Corredor: fundo do nó → cotovelo horizontal → calha livre → topo do pool.
      const goDown = src.y < tgt.y;
      if (goDown) {
        const srcLane = elemToLane[f.source];
        const isBottomRow = srcLane && src.y > laneY[srcLane] + (laneHeights[srcLane] / 2) - 20;
        
        if (isBottomRow) {
          waypoints = [
            { x: srcMidX, y: src.y + src.h }, // saída pelo fundo do nó
            { x: srcMidX, y: tgt.y }          // desce direto sem cotovelos
          ];
        } else {
          waypoints = [
            { x: srcMidX, y: src.y + src.h },  // saída pelo fundo do nó
            { x: srcMidX, y: src.y + src.h + (ROW_PAD/2) }, // desce até o meio do gap
            { x: gX,      y: src.y + src.h + (ROW_PAD/2) }, // cotovelo horizontal → calha
            { x: gX,      y: tgt.y }           // descida pela calha até o topo do pool
          ];
        }
      } else {
        waypoints = [
          { x: srcMidX, y: src.y },          // saída pelo topo do nó
          { x: gX,      y: src.y },          // cotovelo horizontal → calha
          { x: gX,      y: tgt.y + tgt.h }  // subida pela calha até o fundo do pool
        ];
      }
    } else {
      // Nó → Nó (pools diferentes): cotovelo em L pela calha da coluna de origem
      if (src.y < tgt.y) {
        waypoints = [
          { x: srcMidX, y: src.y + src.h },
          { x: gX,      y: src.y + src.h },
          { x: gX,      y: tgt.y },
          { x: tgtMidX, y: tgt.y }
        ];
      } else {
        waypoints = [
          { x: srcMidX, y: src.y },
          { x: gX,      y: src.y },
          { x: gX,      y: tgt.y + tgt.h },
          { x: tgtMidX, y: tgt.y + tgt.h }
        ];
      }
    }
  } else if (f.type === 'association') {
    // Linha reta vertical entre o documento e a atividade
    const srcMidX = Math.round(src.x + src.w / 2);
    const tgtMidX = Math.round(tgt.x + tgt.w / 2);
    const isDocSource = nodes[f.source]?.type === 'dataObjectReference';
    
    if (isDocSource) {
      // Documento -> Atividade: sai de baixo do doc, entra em cima da atividade
      waypoints = [
        { x: srcMidX, y: src.y + src.h },
        { x: tgtMidX, y: tgt.y }
      ];
    } else {
      // Atividade -> Documento: sai de baixo da atividade, entra em cima do doc
      waypoints = [
        { x: srcMidX, y: src.y + src.h },
        { x: tgtMidX, y: tgt.y }
      ];
    }
  } else {
    // ── Sequence Flow: Port-Aware Routing ────────────────────────────────────
    //
    // Três casos:
    //   1. Mesmo midY (< 10px) → linha horizontal direta: sai da direita, entra na esquerda
    //   2. Origem ACIMA do destino → sai pelo fundo, desce em L, entra na esquerda
    //   3. Origem ABAIXO do destino → sai pelo topo, sobe em L, entra na esquerda
    const srcMidY = Math.round(src.y + src.h / 2);
    const tgtMidY = Math.round(tgt.y + tgt.h / 2);
    const srcMidX = Math.round(src.x + src.w / 2);

    if (Math.abs(srcMidY - tgtMidY) < 10) {
      // Mesma Linha: Sai da Direita, entra na Esquerda
      waypoints = [
        { x: Math.round(src.x + src.w), y: srcMidY },
        { x: Math.round(tgt.x),         y: tgtMidY }
      ];
    } else {
      // Diferente Linha: Sai da direita, desce/sobe pela calha direita, entra na esquerda
      const srcRight = Math.round(src.x + src.w);
      const tgtLeft = Math.round(tgt.x);
      const srcColIdx = col[f.source] !== undefined ? col[f.source] : 0;
      const gX = Math.round(CONTENT_X0 + srcColIdx * COL_W + ELEM_W + (COL_W - ELEM_W)/2);
      
      waypoints = [
        { x: srcRight, y: srcMidY },        // Sai da direita
        { x: gX,       y: srcMidY },        // Vai até a calha
        { x: gX,       y: tgtMidY },        // Sobe/Desce pela calha
        { x: tgtLeft,  y: tgtMidY }         // Entra na esquerda do alvo
      ];
    }
  }

  const wStr = waypoints.map(p => `      <di:waypoint x="${p.x}" y="${p.y}" />`).join('\n');

  // BPMNLabel: usa o segmento central da aresta para ancorar o texto.
  // Se o segmento é horizontal, empurra o label para cima (claro sobre a linha).
  // Se o segmento é vertical, empurra para a direita (evita sobreposição).
  let labelStr = '';
  if (f.name) {
    const midIdx  = Math.floor(waypoints.length / 2);
    const ptA     = waypoints[midIdx - 1] || waypoints[0];
    const ptB     = waypoints[midIdx];
    const segDx   = Math.abs(ptB.x - ptA.x);
    const segDy   = Math.abs(ptB.y - ptA.y);
    let labelX, labelY;
    if (segDx >= segDy) {
      // Segmento horizontal — label acima da linha
      labelX = Math.round((ptA.x + ptB.x) / 2) - 25;
      labelY = Math.round((ptA.y + ptB.y) / 2) - 22;
    } else {
      // Segmento vertical — label à direita da linha
      labelX = Math.round((ptA.x + ptB.x) / 2) + 6;
      labelY = Math.round((ptA.y + ptB.y) / 2) - 7;
    }
    labelStr = `\n      <bpmndi:BPMNLabel>\n        <dc:Bounds x="${labelX}" y="${labelY}" width="50" height="14" />\n      </bpmndi:BPMNLabel>`;
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
