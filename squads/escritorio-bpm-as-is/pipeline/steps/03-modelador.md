---
agent: modelador
outputFile: processo-as-is.bpmn
execution: inline
---

Transforme o JSON de elicitação em XML BPMN 2.0 válido. Siga rigorosamente as regras em `squads/escritorio-bpm-as-is/references/bpmn-rules.md`. Retorne APENAS o XML. A primeira linha DEVE ser `<?xml version="1.0" encoding="UTF-8"?>` e a última `</definitions>`.

## Input

{{input}}

## Regras obrigatórias

### 1. Atores internos vs externos

- `tipo: "interno"` → **Lane** dentro do Pool principal (`proc_as_is`)
- `tipo: "externo"` → **Pool separado (Black Box)** — NUNCA uma Lane
- `tipo: "sistema"` → sem Lane/Pool; representado como `<serviceTask>` na lane do responsável

Quando houver ator externo, adicione `<collaboration>` antes do `<process>` com `<participant>` para empresa e externos, e `<messageFlow>` para interações cross-pool.

### 2. Lanes — somente atores internos com atividades

- Nunca crie lane vazia
- Todo elemento de fluxo (`startEvent`, `endEvent`, `intermediateCatchEvent`, `userTask`, `serviceTask`, `scriptTask`, `exclusiveGateway`) DEVE estar em `<flowNodeRef>` de uma lane
- `startEvent` e `endEvent` vão na lane do ator com a atividade adjacente

### 3. Tipos de tarefa

Use o campo `task_type` do JSON: `"userTask"` → `<userTask>`, `"serviceTask"` → `<serviceTask>`, `"scriptTask"` → `<scriptTask>`. Se ausente: humano → `<userTask>`, sistema (`sis-XX`) → `<serviceTask>`.

### 4. Gateways — rótulos obrigatórios

Todos exclusivos: `<exclusiveGateway>`. Cada `<sequenceFlow>` saindo de gateway DEVE ter `name=` igual ao label (`"Sim"` ou `"Não"`) e `<conditionExpression>`.

Gateway convergente obrigatório: quando caminhos alternativos se reunem em tarefa comum, insira `<exclusiveGateway>` sem rótulo como ponto de convergência antes da tarefa.

```xml
<sequenceFlow id="sf-gw01-ativ03" name="Sim" sourceRef="gw-01" targetRef="ativ-03"><conditionExpression>Sim</conditionExpression></sequenceFlow>
<sequenceFlow id="sf-gw01-gw-conv-01" name="Não" sourceRef="gw-01" targetRef="gw-conv-01"><conditionExpression>Não</conditionExpression></sequenceFlow>
<sequenceFlow id="sf-ativ03-gw-conv-01" sourceRef="ativ-03" targetRef="gw-conv-01"/>
<exclusiveGateway id="gw-conv-01"/>
<sequenceFlow id="sf-gw-conv-01-ativ05" sourceRef="gw-conv-01" targetRef="ativ-05"/>
```

### 5. Loops — timer obrigatório ANTES do gateway

Quando `destino_tipo == "loop"`, gere `<intermediateCatchEvent>` com `<timerEventDefinition>` como passo sequencial ANTES do gateway (não na branch "Não"):

```xml
<intermediateCatchEvent id="timer-gw-01" name="Aguardar 24h">
  <timerEventDefinition><timeDuration xsi:type="tFormalExpression">PT24H</timeDuration></timerEventDefinition>
</intermediateCatchEvent>
<sequenceFlow id="sf-ativ01-timer" sourceRef="ativ-01" targetRef="timer-gw-01"/>
<sequenceFlow id="sf-timer-gw01" sourceRef="timer-gw-01" targetRef="gw-01"/>
<sequenceFlow id="sf-gw01-ativ02" name="Sim" sourceRef="gw-01" targetRef="ativ-02"><conditionExpression>Sim</conditionExpression></sequenceFlow>
<sequenceFlow id="sf-gw01-ativ01" name="Não" sourceRef="gw-01" targetRef="ativ-01"><conditionExpression>Não</conditionExpression></sequenceFlow>
```

Adicione `timer-[gw-id]` no `<flowNodeRef>` da lane correta.

### 6. Message Flows — interações com externos

Use `<messageFlow>` na `<collaboration>` para cruzar fronteira entre pools. NUNCA `<sequenceFlow>` cross-pool.
- Saída interna → externo: `sourceRef="[id-atividade]"` `targetRef="part-[ator-externo]"`
- Entrada externo → interno: `sourceRef="part-[ator-externo]"` `targetRef="[id-atividade]"`

**Ator externo que apenas dispara o processo (sem atividades modeladas):** NÃO crie pool externo nem `<collaboration>`. Use apenas o `<startEvent>` com nome descritivo. Só crie pool externo quando o ator externo tiver interações explícitas de ida E volta documentadas no JSON.

**Direção obrigatória do messageFlow:**
- Externo envia para interno → `sourceRef="part-[ator]"` `targetRef="[ev ou ativ interno]"`
- Interno envia para externo → `sourceRef="[ativ interno]"` `targetRef="part-[ator]"`
- NUNCA conecte um `<startEvent>` como `sourceRef` de messageFlow (startEvent não envia mensagem, recebe).

### 7. Atributo `name=`

Use sempre `nome_bpmn` do JSON. Nunca use `descricao` como `name=`.

### 8. Sequência

1. Comece pelo startEvent → primeira atividade
2. Siga ordem lógica das descrições
3. Handoff entre atores = sequência
4. Atividade sem saída definida → gere `<endEvent>` após ela. Nunca deixe atividade sem saída.

### 9. Ordenação de sequenceFlows em gateways

Ao declarar `<sequenceFlow>` de saída de `<exclusiveGateway>`, coloque PRIMEIRO o fluxo para atividade com `<messageFlow>` (comunicação externa), DEPOIS atividades internas. Isso otimiza o layout DFS.

### 10. Posicionamento de atividades que cruzam lanes (handoff para lane inferior)

Quando uma atividade pertence à lane A mas seu próximo passo é na lane B (abaixo), declare essa atividade **por último** no `<flowNodeRef>` da sua lane. O layout a posicionará na base da lane, próximo à fronteira, minimizando cruzamentos visuais.

```xml
<lane id="lane-atendente" name="Atendente Nível 1">
  <flowNodeRef>ev-01</flowNodeRef>
  <flowNodeRef>ativ-01</flowNodeRef>
  <flowNodeRef>gw-01</flowNodeRef>
  <flowNodeRef>ativ-03</flowNodeRef>   <!-- atividade interna (sem cruzamento) -->
  <flowNodeRef>ativ-02</flowNodeRef>   <!-- ÚLTIMO: handoff para lane inferior -->
</lane>
```

### 11. Proibições absolutas

- Não crie Lane para ator externo
- Não crie Lane vazia
- Não use sequenceFlow cruzando Pool (use messageFlow)
- Não deixe gateway com ramo sem destino
- Não omita `name=` em sequenceFlows saindo de gateways
- Não use convergência implícita em tasks — se dois ou mais caminhos chegam à mesma task, insira um `<exclusiveGateway>` convergente antes
- Estado no particípio passado sem ação subsequente = `<endEvent>`, nunca `<userTask>`
- Todo elemento de fluxo (`userTask`, `serviceTask`, `scriptTask`, `exclusiveGateway`, `startEvent`, `endEvent`, `intermediateCatchEvent`) DEVE estar listado em `<flowNodeRef>` de uma lane — sem exceção, incluindo serviceTasks de sistema
- Não conecte `<startEvent>` como `sourceRef` de messageFlow — startEvent recebe mensagem, nunca envia
- Não crie pool externo para ator que apenas dispara o processo sem atividades modeladas

### 13. IDs

Use IDs do JSON. sequenceFlows: `sf-{origem}-{destino}`. messageFlows: `mf-{origem}-{destino}`.

## Estrutura raiz — sem atores externos

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
      <!-- lanes de atores internos com atividades -->
    </laneSet>
    <!-- elementos de fluxo -->
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="proc_as_is"/>
  </bpmndi:BPMNDiagram>
</definitions>
```

## Estrutura raiz — com atores externos

```xml
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
             xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
             xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
             targetNamespace="http://escritorio-bpm/as-is"
             id="definitions_as_is">
  <collaboration id="collab_01">
    <participant id="part-empresa" name="[Nome]" processRef="proc_as_is"/>
    <participant id="part-[ator]" name="[Nome Externo]" isExecutable="false"/>
    <messageFlow id="mf-[ativ]-[part]" sourceRef="[id-atividade]" targetRef="part-[ator]"/>
  </collaboration>
  <process id="proc_as_is" name="..." isExecutable="false">
    <laneSet id="ls_01"><!-- apenas atores internos --></laneSet>
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="collab_01"/>
  </bpmndi:BPMNDiagram>
</definitions>
```
