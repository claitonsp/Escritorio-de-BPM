---
agent: modelador
outputFile: processo-as-is.bpmn
execution: inline
---

Você receberá um JSON de elicitação de processo e deverá gerar XML BPMN 2.0 completo e válido.

## Input

{{input}}

## Convenções obrigatórias

### Lanes
Crie uma lane para cada ator com tipo "interno" ou "externo". Atores com tipo "sistema" NÃO recebem lane própria.

### Tipos de tarefa
- Atividades com `ator_responsavel` apontando para humano ou externo: `<userTask>`
- Atividades com `ator_responsavel` apontando para sistema: `<serviceTask>` na lane do ator humano que executou a atividade imediatamente anterior

### Gateways
Todos os gateways são do tipo exclusivo. Use `<exclusiveGateway>`. Cada saída deve ter `<conditionExpression>`.

### Regras de inferência de sequência

Derive a sequência seguindo estas regras em ordem de prioridade:

1. Comece pelo evento start e conecte à primeira atividade do primeiro ator do array
2. Siga a ordem lógica das atividades conforme as descrições (verbos indicam sequência)
3. Cada gateway tem exatamente uma saída por condição em `condicoes`
4. Condições negativas ("Não", "sem orçamento", "indisponível") geralmente levam a caminhos alternativos que terminam em endEvent
5. Handoff entre atores indica sequência (atividade do ator A → atividade do ator B)
6. Se houver fluxo sem fim definido na transcrição, gere endEvent com name="Fluxo indefinido — [descrição do ponto]"

### Proibições absolutas
- Não gere elementos ausentes no JSON
- Não omita elementos presentes no JSON
- Não altere nomes ou descrições

### IDs
Use os IDs do JSON (ativ-01, gw-01, ev-01, etc.). Para sequenceFlows: `sf-{origem}-{destino}`.

### Estrutura raiz obrigatória

```xml
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
             xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
             xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
             targetNamespace="http://escritorio-bpm/as-is"
             id="definitions_as_is">
  <process id="proc_as_is" name="..." isExecutable="false">
    <laneSet id="ls_01">
      <!-- lanes -->
    </laneSet>
    <!-- elementos de fluxo -->
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="proc_as_is">
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>
```
Retorne APENAS o XML. Comece com <?xml e termine com </definitions>.
