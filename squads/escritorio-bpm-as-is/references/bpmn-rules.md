# Regras BPMN 2.0 — Escritório de BPM

> Fonte primária: BPMN 2.0 (OMG), GNOFI Curso Completo, ABPMP BPM CBOK v4.0  
> Estas regras se aplicam a todos os agentes do pipeline AS-IS e TO-BE.

---

## 1. Eventos

### 1.1 Start Event
- Cada processo tem **exatamente um** `<startEvent>`, salvo em processos com múltiplos gatilhos explícitos
- Representa o estado ou contexto que dispara o processo — sem verbo conjugado
- Nomenclatura: máx 4 palavras. Ex: `"Necessidade de aquisição identificada"`

### 1.2 End Event
- Cada **caminho terminal** tem seu **próprio `<endEvent>` independente** — nunca reutilize um único endEvent para múltiplos caminhos
- Representa o estado resultante do processo naquele caminho
- Nomenclatura: máx 3 palavras. Ex: `"Chamado fechado"`, `"Pedido cancelado"`
- **PROIBIDO**: encerrar o processo sem endEvent — todo caminho deve terminar em um endEvent

### 1.3 Intermediate Catch Event (Timer)
- Obrigatório em todo loop de retorno (back-edge)
- O timer é um **passo sequencial ANTES do gateway de decisão** — nunca na branch "Não"
- Padrão correto: `[atividade-de-ação] → [timer] → [gateway] → Sim → avança / Não → volta`
- Deve estar listado no `<flowNodeRef>` da lane correta

---

## 2. Atividades (Tasks)

| Tipo | Tag XML | Quando usar |
|---|---|---|
| `userTask` | `<userTask>` | Humano executa manualmente (análise, aprovação, contato interpessoal) |
| `serviceTask` | `<serviceTask>` | Sistema executa automaticamente (integração ERP, geração NF, e-mail automático) |
| `scriptTask` | `<scriptTask>` | Regra automática do motor de processo (raro no AS-IS) |

**Regras de classificação:**
- `ator_responsavel` é `sis-XX` → sempre `serviceTask`
- Humano inicia e sistema executa (ex: "lançar no ERP", "emitir NF") → `serviceTask`
- Humano julga, aprova, analisa, contata → `userTask`
- Dúvida → `userTask`

**Nomenclatura:** Verbo Infinitivo + Objeto, máx 4 palavras, sem artigos, sem parênteses  
Ex correto: `"Emitir Requisição de Compra"` | Ex errado: `"Emitir RC com descrição..."`  
- Se o mesmo conceito aparece com atores ou tipos diferentes, crie nomes distintos  
Ex: `"Baixar Título via Sistema"` (serviceTask) vs `"Baixar Título Manual"` (userTask)

---

## 3. Gateways

### 3.1 Exclusive Gateway Divergente (XOR — split)
- Usado quando apenas **um** caminho é escolhido
- Cada `<sequenceFlow>` de saída **DEVE** ter `name=` com o label da condição (`"Sim"` ou `"Não"`) e `<conditionExpression>`
- Nenhum caminho pode ficar sem destino
- Nomenclatura: pergunta fechada terminando com `"?"`, máx 6 palavras  
  Ex correto: `"RC está clara e correta?"` | Ex errado: `"O fornecedor já está ativo na carteira?"`

### 3.2 Exclusive Gateway Convergente (XOR — merge)
- **Obrigatório** sempre que dois ou mais caminhos alternativos se reúnem em uma task ou endEvent comum
- Sem `name=` e sem `conditionExpression` nas saídas (tem apenas uma saída)
- **PROIBIDO** convergência implícita (múltiplas setas chegando diretamente em uma task sem gateway)

### 3.3 Ordenação de sequenceFlows na declaração XML
O motor de layout usa DFS — a ordem de declaração determina a posição visual:
1. Declare **PRIMEIRO** o fluxo para atividade com `<messageFlow>` (comunicação externa)
2. Declare **DEPOIS** os fluxos para atividades puramente internas

---

## 4. Pools e Lanes (Swimlanes)

### 4.1 Regra fundamental por tipo de ator

| Tipo de ator | Representação BPMN |
|---|---|
| `"interno"` | Lane dentro do Pool principal (`proc_as_is`) |
| `"externo"` | Pool Black Box separado — **NUNCA Lane** |
| `"sistema"` | serviceTask na lane do responsável humano — **sem Lane/Pool próprio** |

**Atores externos** são sempre: fornecedor, cliente, banco, transportadora, órgão regulador, parceiro B2B.

### 4.2 Regras de lanes
- **Nunca crie lane vazia** (sem nenhum `<flowNodeRef>`)
- Todo elemento de fluxo (`startEvent`, `endEvent`, `intermediateCatchEvent`, `userTask`, `serviceTask`, `scriptTask`, `exclusiveGateway`) **DEVE** estar listado em `<flowNodeRef>` de uma lane
- `startEvent` e `endEvent` vão na lane do ator com a atividade adjacente

### 4.3 Posicionamento de atividades com handoff para lane inferior
Quando uma atividade da lane A envia o fluxo para lane B (abaixo), declare essa atividade **por último** no `<flowNodeRef>` da sua lane. O layout a posicionará na base da lane, próximo à fronteira, minimizando cruzamentos visuais.

```xml
<lane id="lane-atendente" name="Atendente Nível 1">
  <flowNodeRef>ev-01</flowNodeRef>
  <flowNodeRef>ativ-01</flowNodeRef>
  <flowNodeRef>gw-01</flowNodeRef>
  <flowNodeRef>ativ-03</flowNodeRef>   <!-- atividade interna (sem cruzamento) -->
  <flowNodeRef>ativ-02</flowNodeRef>   <!-- ÚLTIMO: handoff para lane inferior -->
</lane>
```

---

## 5. Fluxos de Conexão

### 5.1 Sequence Flow
- Conecta elementos **dentro do mesmo Pool**
- **PROIBIDO** cruzar fronteira de Pool com sequenceFlow

### 5.2 Message Flow
- Conecta atividades internas com Pools externos (atores externos)
- Declarado dentro do elemento `<collaboration>`
- Saída interna → externo: `sourceRef="[id-atividade]"` `targetRef="part-[ator-externo]"`
- Entrada externo → interno: `sourceRef="part-[ator-externo]"` `targetRef="[id-atividade]"`

---

## 6. Estrutura XML

### 6.1 Sem atores externos
```xml
<process id="proc_as_is" name="..." isExecutable="false">
  <laneSet id="ls_01">
    <!-- lanes de atores internos -->
  </laneSet>
  <!-- elementos de fluxo -->
</process>
<bpmndi:BPMNDiagram>
  <bpmndi:BPMNPlane bpmnElement="proc_as_is"/>
</bpmndi:BPMNDiagram>
```

### 6.2 Com atores externos
```xml
<collaboration id="collab_01">
  <participant id="part-empresa" name="[Nome]" processRef="proc_as_is"/>
  <participant id="part-[ator]" name="[Ator Externo]" isExecutable="false"/>
  <messageFlow id="mf-[ativ]-[part]" sourceRef="[id]" targetRef="[id]"/>
</collaboration>
<process id="proc_as_is" ...>...</process>
<bpmndi:BPMNDiagram>
  <bpmndi:BPMNPlane bpmnElement="collab_01"/>
</bpmndi:BPMNDiagram>
```

---

## 7. Convenções de IDs

| Elemento | Prefixo | Exemplo |
|---|---|---|
| Atividade | `ativ-` | `ativ-01` |
| Gateway | `gw-` | `gw-01`, `gw-conv-01` |
| Evento start/end | `ev-` | `ev-01` |
| Timer | `timer-` | `timer-gw-01` |
| Lane | `lane-` | `lane-analista` |
| Sequence Flow | `sf-{origem}-{destino}` | `sf-ativ01-gw01` |
| Message Flow | `mf-{origem}-{destino}` | `mf-ativ03-part-fornecedor` |

---

## 8. Proibições absolutas (resumo)

1. Lane para ator externo
2. Lane vazia
3. sequenceFlow cruzando Pool
4. Gateway com ramo de saída sem destino
5. `name=` ausente em sequenceFlow saindo de gateway divergente
6. Convergência implícita — múltiplas setas chegando em task sem gateway convergente
7. Timer na branch "Não" do gateway — timer vai ANTES do gateway
9. Estado no particípio passado sem ação subsequente como `<userTask>` — é sempre `<endEvent>`
10. Elemento de fluxo sem `<flowNodeRef>` em nenhuma lane

---

## 9. Referências

- BPMN 2.0 Specification — OMG Document formal/2011-01-03
- GNOFI Curso Completo BPMN (`skills/bpm-modelagem/references/gnofi-curso-completo.md`)
- ABPMP BPM CBOK v4.0 — Capítulo 4: Modelação de Processos (`skills/bpm-auditoria/references/cbok-cap4.md`)
