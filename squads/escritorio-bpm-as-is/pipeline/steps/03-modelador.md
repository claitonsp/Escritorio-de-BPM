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

Use o campo `task_type` do JSON de entrada como fonte de verdade:

| `task_type`    | Tag BPMN            | Quando usar |
|---|---|---|
| `"userTask"`   | `<userTask>`        | Humano executa manualmente (análise, aprovação, contato) |
| `"serviceTask"`| `<serviceTask>`     | Sistema executa sem intervenção humana no momento (integração ERP, geração de NF, e-mail automático) |
| `"scriptTask"` | `<scriptTask>`      | Regra automática do motor de processo (raro no AS-IS) |

Se `task_type` estiver ausente no JSON: use `<userTask>` para `ator_responsavel` humano e `<serviceTask>` para `ator_responsavel` do tipo sistema (`sis-XX`).

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

**Gateway convergente obrigatório:** sempre que um gateway exclusivo divergir em dois ou mais caminhos que se reúnem numa tarefa comum posterior, insira um `<exclusiveGateway>` sem rótulo como ponto de convergência. Exemplo:

```xml
<!-- ERRADO — convergência implícita: duas setas chegando direto em ativ-05 -->
<sequenceFlow sourceRef="gw-01" targetRef="ativ-03" name="Sim"/>
<sequenceFlow sourceRef="gw-01" targetRef="ativ-05" name="Não"/>
<sequenceFlow sourceRef="ativ-03" targetRef="ativ-05"/>

<!-- CORRETO — gateway convergente antes da tarefa comum -->
<sequenceFlow sourceRef="gw-01" targetRef="ativ-03" name="Sim"/>
<sequenceFlow sourceRef="gw-01" targetRef="gw-conv-01" name="Não"/>
<sequenceFlow sourceRef="ativ-03" targetRef="gw-conv-01"/>
<exclusiveGateway id="gw-conv-01"/>
<sequenceFlow sourceRef="gw-conv-01" targetRef="ativ-05"/>
```

### 5. Loops — Sequence Flow de retorno com controle obrigatório

Quando `destino_tipo == "loop"`, gere um `<sequenceFlow>` apontando de volta para `destino_id`. Não gere End Event.

End Events (`<endEvent>`) são gerados apenas quando `destino_tipo == "evento_fim"`, indicando encerramento definitivo do processo naquele caminho.

**Controle de loop obrigatório:** Todo loop de retorno deve incluir um `<intermediateCatchEvent>` com `<timerEventDefinition>` entre o gateway e a atividade de destino. Use duração ISO 8601 `PT24H` como padrão quando nenhum intervalo for especificado. Isso impede loop cego em execução por BPMS.

Estrutura obrigatória:
```xml
<intermediateCatchEvent id="timer-[gw-id]" name="Aguardar 24h">
  <timerEventDefinition id="ted-[gw-id]">
    <timeDuration xsi:type="tFormalExpression">PT24H</timeDuration>
  </timerEventDefinition>
</intermediateCatchEvent>
<sequenceFlow id="sf-[gw-id]-timer" name="Não" sourceRef="[gw-id]" targetRef="timer-[gw-id]">
  <conditionExpression>Não</conditionExpression>
</sequenceFlow>
<sequenceFlow id="sf-timer-[destino]" sourceRef="timer-[gw-id]" targetRef="[destino_id]"/>
```

Adicione também o `timer-[gw-id]` na `<lane>` correta (mesma lane do destino do loop). Se o JSON definir um intervalo explícito, use-o no lugar de `PT24H`.

### 6. Message Flows — interações com atores externos

Para cada atividade interna que envia ou recebe informação de um ator externo, adicione um `<messageFlow>` na `<collaboration>`. Nunca use `<sequenceFlow>` para cruzar a fronteira entre pools.

- Saída da empresa para externo: `sourceRef="[id-atividade-interna]"` e `targetRef="part-[id-ator-externo]"`
- Entrada do externo para empresa: `sourceRef="part-[id-ator-externo]"` e `targetRef="[id-atividade-interna]"`

Atividades que tipicamente interagem com fornecedor: solicitar cotações, enviar pedido, confirmar recebimento, realizar follow-up.

**Erro crítico a evitar:**
```xml
<!-- ERRADO — sequenceFlow cruzando pool: inválido BPMN 2.0 -->
<sequenceFlow id="sf-ativ03-part-fornecedor" sourceRef="ativ-03" targetRef="part-fornecedor"/>

<!-- CORRETO — messageFlow dentro da collaboration -->
<messageFlow id="mf-ativ03-part-fornecedor" sourceRef="ativ-03" targetRef="part-fornecedor"/>
```
Regra de detecção: se targetRef ou sourceRef de um <sequenceFlow> for o ID de um <participant>, você cometeu o erro acima. Revise antes de entregar.


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
5. Toda atividade que não possui nenhum `<sequenceFlow>` de saída definido no JSON (não é origem de nenhuma seta, não tem gateway subsequente) DEVE ser seguida imediatamente por um `<endEvent>`. Gere: `<endEvent id="ev-fim-[ativ-id]" name="[nome curto do estado final]"/>` e conecte com um `<sequenceFlow>`. Nunca deixe uma atividade sem saída — um token preso é um processo zumbi.

### 9. Proibições absolutas

- Não crie Lane para ator externo
- Não crie Lane vazia
- Não use Sequence Flow cruzando fronteira de Pool (use Message Flow)
- Não deixe gateway com ramo de saída sem destino
- Não use End Event quando a condição indica retorno/loop
- Não omita o `name=` nos Sequence Flows que saem de gateways
- Não use descrições longas como rótulo de elemento BPMN
- Não deixe múltiplas setas chegando em uma mesma tarefa sem um gateway convergente antes dela (convergência implícita). Se um gateway divergente abre caminhos alternativos, feche-os com um segundo `<exclusiveGateway>` vazio antes da próxima tarefa comum
- Não modele "Plano B acionado" ou equivalentes como `<userTask>`. Estado no particípio passado sem ação subsequente definida é sempre um `<endEvent>`, nunca uma tarefa

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
