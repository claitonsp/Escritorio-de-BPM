---
agent: tobe
outputFile: processo-tobe.bpmn
execution: inline
---

Você receberá dois JSONs concatenados: primeiro o elicitacao.json (estrutura AS-IS), depois o diagnostico-as-is.json (achados e recomendações). Gere o XML BPMN 2.0 do processo TO-BE incorporando as melhorias listadas abaixo.

## Input

{{input}}

## Estrutura AS-IS de referência

O processo AS-IS tem:
- 7 lanes: Solicitante, Supervisor, Gerente de Compras, Setor de Cadastro, Fornecedor, Almoxarifado, Financeiro
- IDs de atores: ator-01 a ator-07 (SAP = sis-01)
- IDs de atividades: ativ-01 a ativ-15
- IDs de gateways: gw-01 a gw-04
- IDs de eventos: ev-01, ev-02, ev-03, ev-04

## Mudanças obrigatórias no TO-BE

### 1. ativ-06 vira serviceTask (achado ach-06)
- ID permanece: ativ-06
- Nome permanece: "Validar cadastro do fornecedor automaticamente"
- Tipo muda de userTask para serviceTask
- Ator responsável: sis-01 (SAP), mas fica na lane do Gerente de Compras (lane-ator-03)
- Rationale: automação via SAP elimina verificação manual

### 2. Nova atividade ativ-16 antes de ativ-06 (achado ach-07)
- ID: ativ-16
- Nome: "Registrar comparativo de cotações e selecionar fornecedor"
- Tipo: userTask
- Lane: Gerente de Compras (lane-ator-03)
- Sistema: sis-01 (SAP)
- Posição no fluxo: após ativ-05, antes de ativ-06
- Sequência: ativ-05 → ativ-16 → ativ-06 (substitui ativ-05 → ativ-06)
- Rationale: registro de decisão exigido pela ISO 9001 cl. 8.4.1

### 3. Tratamento de divergência com três saídas (achado ach-02)
- ev-04 é REMOVIDO do processo TO-BE
- Após ativ-13, inserir gateway exclusivo gw-05:
  - ID: gw-05
  - Nome: "Resolução da divergência"
  - Lane: Gerente de Compras (lane-ator-03)
  - Condições e destinos:
    a. "Divergência resolvida" → ativ-12 (Dar entrada no estoque — Almoxarifado)
    b. "Devolução ao fornecedor" → ativ-17 (nova atividade, Almoxarifado)
    c. "Escalada para Diretoria" → ativ-18 (nova atividade, Gerente de Compras)

### 4. Nova atividade ativ-17 (achado ach-02 — caminho de devolução)
- ID: ativ-17
- Nome: "Devolver mercadoria ao fornecedor"
- Tipo: userTask
- Lane: Almoxarifado (lane-ator-06)
- Sequência: gw-05 → ativ-17 → ev-05

### 5. Nova atividade ativ-18 (achado ach-02 — caminho de escalada)
- ID: ativ-18
- Nome: "Escalar divergência para Diretoria"
- Tipo: userTask
- Lane: Gerente de Compras (lane-ator-03)
- Sequência: gw-05 → ativ-18 → ev-06

### 6. Novos eventos finais ev-05 e ev-06 (achado ach-02)
- ev-05: endEvent, nome "Mercadoria devolvida ao fornecedor", lane Almoxarifado
- ev-06: endEvent, nome "Caso escalado para Diretoria", lane Gerente de Compras

## O que NÃO muda

Todos os demais elementos do AS-IS permanecem sem alteração de ID, nome, tipo ou sequência:
- ev-01, ev-02, ev-03 (mantidos)
- ativ-01, ativ-02, ativ-03, ativ-04, ativ-05, ativ-07, ativ-08, ativ-09, ativ-10, ativ-11, ativ-12, ativ-13, ativ-14, ativ-15 (mantidos, com os tipos originais)
- gw-01, gw-02, gw-03, gw-04 (mantidos)
- Todas as lanes e seus flowNodeRefs (atualizados para incluir novos elementos)
- Todos os sequenceFlows existentes, exceto sf-ativ05-ativ06 (substituído) e sf-ativ13-ev04 (removido)

## Convenções BPMN obrigatórias

- Atores com tipo "sistema" NÃO recebem lane própria
- serviceTask para atividades automáticas (SAP), userTask para humanos
- Todos os gateways exclusivos com conditionExpression em cada saída
- IDs de sequenceFlow: sf-{origem}-{destino}
- gw-05 fica na lane do Gerente de Compras (ele avalia a resolução junto com o Almoxarifado)
- ativ-17 fica na lane do Almoxarifado (execução física da devolução)
- ativ-18 fica na lane do Gerente de Compras (comunicação com Diretoria)

## Estrutura raiz obrigatória

```xml
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
             xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
             xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
             targetNamespace="http://escritorio-bpm/tobe"
             id="definitions_tobe">
  <process id="proc_tobe" name="Processo de Aprovação de Compra — TO-BE" isExecutable="false">
    <laneSet id="ls_01">
      <!-- lanes com flowNodeRefs atualizados -->
    </laneSet>
    <!-- elementos de fluxo -->
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="proc_tobe">
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>
```

Retorne APENAS o XML. Comece com <?xml e termine com </definitions>.
