---
type: checkpoint
message: |
  O Modelador gerou o XML BPMN.

  Execute o seguinte passo antes de aprovar:

  1. Rode o bpmn-layout.js para gerar o diagrama com DI completo:
     node squads/escritorio-bpm-as-is/scripts/bpmn-layout.js <caminho/processo-as-is.bpmn> <caminho/processo-as-is-layout.bpmn>

     Substitua <caminho/...> pelo caminho real do output desta run (ex: squads/escritorio-bpm-as-is/output/2026-05-14-000001/v1/).

  2. Abra processo-as-is-layout.bpmn no bpmn.io e confirme:
     - 7 lanes horizontais presentes (Solicitante, Supervisor, Gerente de Compras, Setor de Cadastro, Fornecedor, Almoxarifado, Financeiro)
     - Todos os gateways com label terminando em "?"
     - Setas visíveis entre todos os elementos
     - Nenhum elemento sobreposto

  Para continuar para o Auditor: cole o conteúdo completo do arquivo elicitacao.json como resposta a este checkpoint. O Auditor usará esse JSON para diagnosticar o processo AS-IS.

  Se o BPMN tiver problemas estruturais, descreva aqui antes de passar o JSON.
---

Valide o BPMN e forneça o elicitacao.json para o Auditor.
