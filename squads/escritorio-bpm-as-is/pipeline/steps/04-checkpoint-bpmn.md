---
type: checkpoint
message: |
  O Modelador gerou o XML BPMN.
  
  Execute os seguintes passos antes de aprovar:
  
  1. Rode o bpmn-auto-layout no arquivo gerado:
     node -e "const {layoutProcess}=require('bpmn-auto-layout');const fs=require('fs');const xml=fs.readFileSync('squads/escritorio-bpm-as-is/output/processo-as-is.bpmn','utf8');layoutProcess(xml).then(r=>fs.writeFileSync('squads/escritorio-bpm-as-is/output/processo-as-is-layout.bpmn',r));"
  
  2. Rode o DI Injector para adicionar shapes de lanes:
     node squads/escritorio-bpm-as-is/scripts/di-injector.js squads/escritorio-bpm-as-is/output/processo-as-is-layout.bpmn squads/escritorio-bpm-as-is/output/processo-as-is-final.bpmn
  
  3. Abra processo-as-is-final.bpmn no bpmn.io e confirme:
     - Todas as lanes estão presentes
     - Todos os gateways estão presentes
     - Sem elementos faltando
  
  Para continuar para o Auditor: cole o conteúdo completo do arquivo elicitacao.json como resposta a este checkpoint. O Auditor usará esse JSON para diagnosticar o processo AS-IS.
  
  Se o BPMN tiver problemas estruturais, descreva aqui antes de passar o JSON.
---

Valide o BPMN e forneça o elicitacao.json para o Auditor.
