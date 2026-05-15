// DI Injector — adiciona BPMNShape para lanes no BPMNPlane
// Uso: node di-injector.js <input.bpmn> <output.bpmn>
// Requer: bpmn-auto-layout já executado (BPMNShape de nós presentes)

const fs = require('fs');

const inputFile = process.argv[2];
const outputFile = process.argv[3];

if (!inputFile || !outputFile) {
  console.error('Uso: node di-injector.js <input.bpmn> <output.bpmn>');
  process.exit(1);
}

const xml = fs.readFileSync(inputFile, 'utf8');

// Extrai bounds de cada BPMNShape de nó (gerado pelo bpmn-auto-layout)
const nodeBounds = {};
const shapeRe = /<bpmndi:BPMNShape[^>]*bpmnElement="([^"]+)"[^>]*>[\s\S]*?<dc:Bounds\s+x="([^"]+)"\s+y="([^"]+)"\s+width="([^"]+)"\s+height="([^"]+)"/g;
let m;
while ((m = shapeRe.exec(xml)) !== null) {
  nodeBounds[m[1]] = { x: +m[2], y: +m[3], w: +m[4], h: +m[5] };
}

// Extrai lanes e seus flowNodeRefs
const lanes = [];
const laneRe = /<lane\s[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/lane>/g;
while ((m = laneRe.exec(xml)) !== null) {
  const nodeIds = [...m[2].matchAll(/<flowNodeRef>([^<]+)<\/flowNodeRef>/g)]
    .map(x => x[1].trim());
  lanes.push({ id: m[1], nodeIds });
}

// Calcula bounding box por lane e gera BPMNShape
const PAD = 20;
const laneShapeXml = lanes.map(lane => {
  const bounds = lane.nodeIds.map(id => nodeBounds[id]).filter(Boolean);
  if (!bounds.length) return null;
  const minY = Math.min(...bounds.map(b => b.y)) - PAD;
  const maxY = Math.max(...bounds.map(b => b.y + b.h)) + PAD;
  return [
    `    <bpmndi:BPMNShape id="${lane.id}_di" bpmnElement="${lane.id}" isHorizontal="true">`,
    `      <dc:Bounds x="30" y="${minY}" width="1200" height="${maxY - minY}" />`,
    `    </bpmndi:BPMNShape>`
  ].join('\n');
}).filter(Boolean).join('\n');

// Injeta após a tag de abertura do BPMNPlane
const result = xml.replace(
  /(<bpmndi:BPMNPlane[^>]*>)/,
  `$1\n${laneShapeXml}`
);

fs.writeFileSync(outputFile, result, 'utf8');

const count = (laneShapeXml.match(/BPMNShape/g) || []).length / 2;
console.log(`DI Injector: ${count} lane shapes injetadas → ${outputFile}`);
