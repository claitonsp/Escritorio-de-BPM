---
agent: modelador
outputFile: processo-as-is.bpmn
execution: inline
---

Transforme o JSON de elicitação em XML BPMN 2.0 válido. Siga rigorosamente as regras em `squads/escritorio-bpm-as-is/references/bpmn-rules.md`. Retorne APENAS o XML. A primeira linha DEVE ser `<?xml version="1.0" encoding="UTF-8"?>` e a última `</definitions>`.

## Input

{{input}}

## Regras obrigatórias (OMG BPMN 2.0.2 & XML Schema Compliant)

Você deve seguir rigorosamente as especificações oficiais da OMG BPMN 2.0.2 (Seções 7.3 a 7.6) e as convenções do Escritório de BPM:

### 1. Estrutura XML e Namespaces Obrigatórios
O arquivo gerado DEVE possuir a raiz `<definitions>` contendo os namespaces oficiais de modelo e Diagram Interchange (DI) exatamente assim:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
             xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
             xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
             targetNamespace="http://escritorio-bpm/as-is"
             id="definitions_as_is">
```

### 2. Atores Internos vs Externos (Swimlanes e Black Box)
- **`tipo: "interno"`** → Representado como **Lane** dentro do Pool principal (`proc_as_is`).
  - **NUNCA** crie raias (lanes) vazias.
  - Todo elemento de fluxo (`startEvent`, `endEvent`, `userTask`, `serviceTask`, `exclusiveGateway`, `intermediateCatchEvent`) **DEVE** estar listado dentro de um `<flowNodeRef>` de alguma Lane (incluindo serviceTasks de sistema).
- **`tipo: "externo"`** → Representado como **Pool separado (Black Box)** na tag `<collaboration>`.
  - **NUNCA** coloque um ator externo dentro de uma Lane do pool interno.
  - Só crie Pool externo se houver fluxos explícitos de ida E volta. Se o ator externo apenas dispara o processo, use apenas um `<startEvent>` descritivo no fluxo interno.

### 3. Matriz Estrita de Conexão (OMG p. 40-41)
- **`<sequenceFlow>` (Fluxo de Controle):**
  - Conecta **apenas** elementos dentro do mesmo Pool.
  * **PROIBIDO** cruzar fronteira de Pool com sequenceFlow.
  * **PROIBIDO** conectar sequenceFlow de/para raias (lanes), pools, Data Objects ou Text Annotations.
- **`<messageFlow>` (Fluxo de Mensagem):**
  - Conecta **apenas** pools diferentes ou elementos em pools diferentes (Tasks, Catching/Throwing Events).
  * **PROIBIDO** usar messageFlow dentro do mesmo Pool.
  * **PROIBIDO** conectar messageFlow de/para Gateways ou outros sequenceFlows.
  * **PROIBIDO** usar `<startEvent>` comum como origem (sourceRef) de messageFlow (startEvent apenas recepta).

### 4. Tipos de Tarefa e Nomenclatura
- Humano executa (análise, aprovação, contato): `<userTask>`.
- Sistema executa (`ator_responsavel` iniciado com `sis-`): `<serviceTask>`.
- **Nomenclatura das Tarefas:** Verbo Infinitivo + Objeto, máx 4 palavras, sem artigos, sem parênteses. (Ex: `"Emitir Requisição Compra"`, não `"Formulário preenchido"`).

### 5. Gateways de Decisão (XOR)
- **Divergente (Split):** `<exclusiveGateway>`. Deve possuir rótulo de pergunta fechada terminando com `"?"` (Ex: `"Documento está correto?"`).
  - Cada sequenceFlow de saída **DEVE** ter `name="Sim"` ou `name="Não"`, e conter uma `<conditionExpression>` de lógica interna.
- **Convergente (Merge):** `<exclusiveGateway>`. Obrigatório sempre que caminhos alternativos se reúnem em tarefa comum.
  - **PROIBIDO** convergência implícita (múltiplas setas chegando na mesma tarefa).
  - Gateways convergentes **NÃO DEVEM** ter atributo `name` no XML para evitar poluição visual.

### 6. Loops — Timer Obrigatório
Quando `destino_tipo == "loop"`, você deve inserir um `<intermediateCatchEvent>` com `<timerEventDefinition>` configurado com `PT24H` sequencialmente **ANTES do gateway de decisão** (não no branch de retorno "Não").
Padrão correto: `[atividade] → [timer] → [gateway] → Sim (avança) / Não (retorna para atividade)`.

### 7. Organização e Layout DFS
- Ao declarar sequenceFlows saindo de gateways XOR, coloque **PRIMEIRO** o fluxo que aponta para atividades com comunicação externa (`<messageFlow>`), e **DEPOIS** atividades puramente internas.
- Quando uma atividade da Lane A envia o fluxo para a Lane B (handoff), declare essa atividade **por último** no `<flowNodeRef>` da Lane A.

### 8. Modelagem de Dados e Documentos (OMG p. 201+ / CBOK v4.0)
Quando uma atividade contiver `"documentos_entrada"` ou `"documentos_saida"`, gere os elementos de dados correspondentes no XML:
1. Declare cada documento com `<dataObject id="doc-[id]" name="[Nome]"/>` e seu respectivo `<dataObjectReference id="doc-[id]-ref" dataObjectRef="doc-[id]" name="[Nome]"/>` diretamente dentro do bloco `<process id="proc_as_is">` (antes das atividades).
2. Dentro da tag da atividade correspondente (ex: `<userTask>` ou `<serviceTask>`), declare:
   - Para entrada:
     ```xml
     <dataInputAssociation id="dia-[ativ-id]-[doc-id]">
       <sourceRef>doc-[id]-ref</sourceRef>
     </dataInputAssociation>
     ```
   - Para saída:
     ```xml
     <dataOutputAssociation id="doa-[ativ-id]-[doc-id]">
       <targetRef>doc-[id]-ref</targetRef>
     </dataOutputAssociation>
     ```
   * Nota: normalize o `doc-[id]` usando minúsculas e hífen (ex: `"doc-requisicao-compra"`).

### 9. Proibições Absolutas
- Não use sequenceFlow cruzando Pools.
- Não use messageFlow no mesmo Pool.
- Não conecte Start Event como origem de messageFlow.
- Não crie Lanes vazias.
- Não deixe nenhuma atividade sem fluxo de saída (atividades zumbi).
- Não use convergência implícita em tarefas.
- Todo elemento de fluxo deve pertencer a uma Lane (via `<flowNodeRef>`).

### 10. Convenções de IDs Estritos
- Atividade: `ativ-XX`
- Gateway: `gw-XX` ou `gw-conv-XX`
- Evento: `ev-start` ou `ev-end-XX`
- Timer: `timer-gw-XX`
- Lane: `lane-analista`
- Sequence Flow: `sf-{origem}-{destino}`
- Message Flow: `mf-{origem}-{destino}`
- Documento: `doc-{nome-normalizado}`


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
