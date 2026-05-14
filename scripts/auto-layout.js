const { layoutProcess } = require('bpmn-auto-layout');
const fs = require('fs');
const path = require('path');

async function main() {
  const inputPath  = 'squads/spike-bpmn/output/2026-05-14-173000/v1/processo.bpmn';
  const outputPath = 'squads/spike-bpmn/output/2026-05-14-173000/v1/processo-layout.bpmn';

  const xml    = fs.readFileSync(inputPath, 'utf8');
  const result = await layoutProcess(xml);

  fs.writeFileSync(outputPath, result, 'utf8');
  console.log('Layout gerado: ' + outputPath);
}

main().catch(err => {
  console.error('Erro:', err.message);
  process.exit(1);
});
