// Edge Injector — adiciona BPMNEdge para sequenceFlows no BPMNPlane
// Uso: node edge-injector.js <input.bpmn> <output.bpmn>
// Requer: di-injector já executado (BPMNShape de nós e lanes presentes)
//
// Waypoints calculados para layout horizontal (esquerda → direita):
//   Saída: centro-direita da origem  → x + width,     y + height/2
//   Entrada: centro-esquerda do destino → x,           y + height/2
// Para layout vertical (cima → baixo), substituir por:
//   Saída: centro-baixo da origem   → x + width/2,   y + height
//   Entrada: centro-topo do destino → x + width/2,   y

const fs = require('fs');

const inputFile = process.argv[2];
const outputFile = process.argv[3];

if (!inputFile || !outputFile) {
  console.error('Uso: node edge-injector.js <input.bpmn> <output.bpmn>');
  process.exit(1);
}

const xml = fs.readFileSync(inputFile, 'utf8');

// Extrai bounds de cada BPMNShape (nós gerados pelo bpmn-auto-layout)
const nodeBounds = {};
const shapeRe = /<bpmndi:BPMNShape[^>]*bpmnElement="([^"]+)"[^>]*>[\s\S]*?<dc:Bounds\s+x="([^"]+)"\s+y="([^"]+)"\s+width="([^"]+)"\s+height="([^"]+)"/g;
let m;
while ((m = shapeRe.exec(xml)) !== null) {
  nodeBounds[m[1]] = { x: +m[2], y: +m[3], w: +m[4], h: +m[5] };
}

// Extrai todos os sequenceFlows do processo (tolerante à ordem dos atributos)
const flows = [];
const flowRe = /<sequenceFlow\s[^/]*(?:\/?>|>)/g;
const attrRe = /(\w+)="([^"]+)"/g;
let flowMatch;
while ((flowMatch = flowRe.exec(xml)) !== null) {
  const attrs = {};
  let attrMatch;
  attrRe.lastIndex = 0;
  while ((attrMatch = attrRe.exec(flowMatch[0])) !== null) {
    attrs[attrMatch[1]] = attrMatch[2];
  }
  if (attrs.id && attrs.sourceRef && attrs.targetRef) {
    flows.push({ id: attrs.id, source: attrs.sourceRef, target: attrs.targetRef });
  }
}

if (flows.length === 0) {
  console.error('Edge Injector: nenhum sequenceFlow encontrado no arquivo. Verifique o BPMN de entrada.');
  process.exit(1);
}

// Gera BPMNEdge com dois waypoints por sequenceFlow
const missing = [];
const edgeLines = flows.map(flow => {
  const src = nodeBounds[flow.source];
  const tgt = nodeBounds[flow.target];
  if (!src || !tgt) {
    missing.push({ id: flow.id, falta: !src ? flow.source : flow.target });
    return null;
  }
  // Saída: centro-direita da origem
  const x1 = Math.round(src.x + src.w);
  const y1 = Math.round(src.y + src.h / 2);
  // Entrada: centro-esquerda do destino
  const x2 = Math.round(tgt.x);
  const y2 = Math.round(tgt.y + tgt.h / 2);
  return [
    `    <bpmndi:BPMNEdge id="${flow.id}_di" bpmnElement="${flow.id}">`,
    `      <di:waypoint x="${x1}" y="${y1}" />`,
    `      <di:waypoint x="${x2}" y="${y2}" />`,
    `    </bpmndi:BPMNEdge>`
  ].join('\n');
}).filter(Boolean);

const edgeXml = edgeLines.join('\n');

// Injeta antes do fechamento do BPMNPlane
const result = xml.replace(
  /(\s*<\/bpmndi:BPMNPlane>)/,
  `\n${edgeXml}\n  </bpmndi:BPMNPlane>`
);

fs.writeFileSync(outputFile, result, 'utf8');

console.log(`Edge Injector: ${edgeLines.length} de ${flows.length} edges injetados → ${outputFile}`);
if (missing.length) {
  console.warn(`Aviso: ${missing.length} sequenceFlow(s) sem BPMNShape correspondente (nó ausente no layout):`);
  missing.forEach(e => console.warn(`  - ${e.id}: nó "${e.falta}" não encontrado nos BPMNShape`));
  console.warn('Causa provável: bpmn-auto-layout não processou esses elementos. Verifique o XML de entrada.');
}
