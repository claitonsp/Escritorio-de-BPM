---
type: checkpoint
message: |
  O Designer TO-BE gerou o XML BPMN do processo futuro.
  
  Execute os seguintes passos antes de aprovar:
  
  1. Rode o bpmn-auto-layout no arquivo gerado:
     node -e "const {layoutProcess}=require('bpmn-auto-layout');const fs=require('fs');const xml=fs.readFileSync('squads/escritorio-bpm-as-is/output/processo-tobe.bpmn','utf8');layoutProcess(xml).then(r=>fs.writeFileSync('squads/escritorio-bpm-as-is/output/processo-tobe-layout.bpmn',r));"
  
  2. Rode o DI Injector para adicionar shapes de lanes:
     node squads/escritorio-bpm-as-is/scripts/di-injector.js squads/escritorio-bpm-as-is/output/processo-tobe-layout.bpmn squads/escritorio-bpm-as-is/output/processo-tobe-final.bpmn
  
  3. Abra processo-tobe-final.bpmn no bpmn.io e verifique:
     - ativ-06 tem ícone de engrenagem (serviceTask)
     - ativ-16 "Registrar comparativo de cotações" está presente entre ativ-05 e ativ-06
     - gw-05 "Resolução da divergência" está presente após ativ-13 com três saídas
     - ativ-17 "Devolver mercadoria ao fornecedor" e ev-05 estão presentes
     - ativ-18 "Escalar divergência para Diretoria" e ev-06 estão presentes
     - ev-04 "Fluxo indefinido" NÃO está presente
  
  Responda 1 para aprovar ou descreva o problema encontrado.
---

Valide o BPMN TO-BE antes de encerrar o pipeline.
