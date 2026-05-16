---
agent: modelador
outputFile: processo-as-is.bpmn
execution: inline
---

Você receberá um JSON de elicitação de processo e deverá gerar XML BPMN 2.0 completo e válido, seguindo rigorosamente a especificação OMG BPMN 2.0 e as diretrizes do BPM CBOK v4.0.

## Input

{{input}}

## Convenções obrigatórias

### 1. Atores internos vs externos — regra fundamental

Analise o campo `tipo` de cada ator:

- `tipo: "interno"` → recebe **Lane** dentro do Pool principal (`proc_as_is`)
- `tipo: "externo"` → recebe **Pool separado (Black Box)** — NUNCA uma Lane
- `tipo: "sistema"` → NÃO recebe Lane nem Pool; é representado como `<serviceTask>` na lane do humano responsável

**Quando existir pelo menos um ator externo**, a estrutura raiz muda:
- Adicione um elemento `<collaboration>` antes do `<process>`
- Dentro da collaboration, declare um `<participant>` para a empresa (apontando para `proc_as_is`) e um `<participant isExecutable="false">` para cada ator externo
- Use `<messageFlow>` para conectar atividades internas que interagem com atores externos

Estrutura quando há atores externos:
```xml
<collaboration id="collab_01">
  <participant id="part-empresa" name="[nome da empresa ou processo]" processRef="proc_as_is"/>
  <participant id="part-[id-ator]" name="[nome do ator externo]" isExecutable="false"/>
  <!-- messageFlows -->
  <messageFlow id="mf-[origem]-[destino]" sourceRef="[id-atividade]" targetRef="part-[id-ator]"/>
</collaboration>
<process id="proc_as_is" name="..." isExecutable="false">
  <!-- apenas atores internos aqui -->
</process>
```

### 2. Lanes — somente para atores internos com atividades

- Crie lane apenas para atores com `tipo: "interno"` que possuem ao menos uma atividade atribuída
- **Nunca crie lane vazia** (sem nenhum `<flowNodeRef>`)
- Atores externos NÃO aparecem como lane

### 3. Tipos de tarefa

- Atividade cujo `ator_responsavel` é humano interno ou externo: `<userTask>`
- Atividade cujo `ator_responsavel` é sistema (`sis-XX`): `<serviceTask>` posicionada na lane do humano da atividade imediatamente anterior

### 4. Gateways — rótulos obrigatórios nas saídas

Todos os gateways são exclusivos: use `<exclusiveGateway>`.

O JSON de entrada tem `condicoes` com `label`, `destino_tipo` e `destino_id`. Mapeie assim:

| `destino_tipo` | O que gerar |
|---|---|
| `"atividade"` | `<sequenceFlow>` com `targetRef="[destino_id]"` |
| `"evento_fim"` | `<sequenceFlow>` → `<endEvent>` com nome do estado final |
| `"loop"` | `<sequenceFlow>` de volta com `targetRef="[destino_id]"` (atividade anterior) |

**Regra crítica**: cada `<sequenceFlow>` saindo de um gateway DEVE ter `name=` igual ao `label` da condição (`"Sim"` ou `"Não"`).

Exemplo:
```xml
<sequenceFlow id="sf-gw01-ativ02" name="Sim" sourceRef="gw-01" targetRef="ativ-02">
  <conditionExpression>Sim</conditionExpression>
</sequenceFlow>
<sequenceFlow id="sf-gw01-ativ01" name="Não" sourceRef="gw-01" targetRef="ativ-01">
  <conditionExpression>Não</conditionExpression>
</sequenceFlow>
```

**Todo gateway divergente deve ter TODOS os ramos definidos** — nenhum caminho pode ficar sem destino.

### 5. Loops — Sequence Flow de retorno, nunca End Event

Quando `destino_tipo == "loop"`, gere um `<sequenceFlow>` apontando de volta para `destino_id`. Não gere End Event.

End Events (`<endEvent>`) são gerados apenas quando `destino_tipo == "evento_fim"`, indicando encerramento definitivo do processo naquele caminho.

### 6. Message Flows — interações com atores externos

Para cada atividade interna que envia ou recebe informação de um ator externo, adicione um `<messageFlow>` na `<collaboration>`:
- Saída da empresa para externo: `sourceRef="[id-atividade-interna]"` e `targetRef="part-[id-ator-externo]"`
- Entrada do externo para empresa: `sourceRef="part-[id-ator-externo]"` e `targetRef="[id-atividade-interna]"`

Atividades que tipicamente interagem com fornecedor: solicitar cotações, enviar pedido, confirmar recebimento, realizar follow-up.

### 7. Atributo `name=` no XML

- Use **sempre** o campo `nome_bpmn` do JSON como valor do atributo `name=` de cada elemento BPMN
- Nunca use o campo `descricao` como `name=` — ele existe apenas como contexto interno
- Se um elemento não tiver `nome_bpmn`, gere um nome curto seguindo a convenção (Verbo + Objeto, máx 4 palavras)

### 8. Regras de inferência de sequência

Derive a sequência seguindo estas regras em ordem de prioridade:

1. Comece pelo evento start e conecte à primeira atividade do primeiro ator interno
2. Siga a ordem lógica das atividades conforme as descrições (verbos indicam sequência)
3. Cada gateway tem exatamente uma saída por condição em `condicoes`
4. Handoff entre atores indica sequência (atividade do ator A → atividade do ator B)
5. Se houver fluxo sem fim definido na transcrição, gere `<endEvent name="Fluxo indefinido — [ponto]"/>`

### 9. Proibições absolutas

- Não crie Lane para ator externo
- Não crie Lane vazia
- Não use Sequence Flow cruzando fronteira de Pool (use Message Flow)
- Não deixe gateway com ramo de saída sem destino
- Não use End Event quando a condição indica retorno/loop
- Não omita o `name=` nos Sequence Flows que saem de gateways
- Não use descrições longas como rótulo de elemento BPMN

### 10. IDs

Use os IDs do JSON (ativ-01, gw-01, ev-01, etc.). Para sequenceFlows: `sf-{origem}-{destino}`. Para messageFlows: `mf-{origem}-{destino}`.

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
      <!-- apenas lanes de atores internos com atividades -->
    </laneSet>
    <!-- elementos de fluxo -->
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="proc_as_is">
    </bpmndi:BPMNPlane>
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
    <participant id="part-empresa" name="[Nome da Empresa]" processRef="proc_as_is"/>
    <participant id="part-[ator-externo]" name="[Nome Ator Externo]" isExecutable="false"/>
    <messageFlow id="mf-[ativ]-[part]" sourceRef="[id-atividade]" targetRef="part-[ator-externo]"/>
  </collaboration>
  <process id="proc_as_is" name="..." isExecutable="false">
    <laneSet id="ls_01">
      <!-- apenas atores internos -->
    </laneSet>
    <!-- elementos de fluxo -->
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="collab_01">
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>
```

Retorne APENAS o XML. Comece com `<?xml` e termine com `</definitions>`.
