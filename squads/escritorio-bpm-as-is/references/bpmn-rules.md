# Regras BPMN 2.0 — Escritório de BPM (OMG Compliant)

> Fonte primária: OMG BPMN v2.0.2 Specification (Páginas 25 a 43, Seção 7.3-7.6), GNOFI Curso Completo, ABPMP BPM CBOK v4.0.  
> Estas regras aplicam-se a todos os agentes do pipeline AS-IS e TO-BE.

---

## 1. Classificação de Elementos por Dimensão (OMG p. 28-30)

De acordo com o padrão oficial OMG BPMN 2.0.2, os elementos são classificados de forma rigorosa por dimensões semânticas e comportamentais.

### 1.1 Eventos (Events)
Um Evento é algo que "acontece" durante a execução do processo e afeta o fluxo.
* **Dimensão de Fluxo:**
  * **Start Event:** Indica onde o processo começa. Gera o token inicial.
  * **Intermediate Event:** Ocorre entre o início e o fim. Afeta o fluxo, mas não o inicia nem o encerra diretamente.
  * **End Event:** Indica onde o processo termina. Consome o token.
* **Dimensão de Comportamento:**
  * **Catching (Receptores):** Reagem a um gatilho externo. O marcador interno do círculo é **vazio/branco**.
  * **Throwing (Disparadores):** Criam um resultado ativo. O marcador interno do círculo é **preenchido/escuro** (ex: `<messageEndEvent>`).

### 1.2 Atividades (Activities)
Representam o trabalho realizado.
* **Task (Atômica):** Tarefa que não pode ser subdividida no nível de detalhe atual.
* **Sub-Process (Composta):** Atividade composta que contém um processo interno.
  * **Expanded (Expandido):** Detalhes internos são visíveis na caixa. Fluxos internos **não podem cruzar** a borda do subprocesso.
  * **Collapsed (Colapsado):** Detalhes ocultos. Deve possuir um marcador visual de **mais ("+")** na parte inferior central do retângulo.

### 1.3 Gateways
Controlam a divergência (Fork) e convergência (Merge) de tokens. O marcador interno no losango determina a lógica.
* **XOR (Exclusive):** Marcador com um "X" ou vazio. Apenas uma rota de saída é tomada.
* **AND (Parallel):** Marcador com um "+". Todos os caminhos paralelos são ativados simultaneamente.
* **OR (Inclusive):** Marcador com um "O". Um ou mais caminhos são ativados com base em condições independentes.

---

## 2. Matriz Estrita de Conexões (OMG p. 40-41)

A especificação da OMG estabelece regras rígidas de conexões para garantir a integridade estrutural do modelo.

### 2.1 Sequence Flow (Fluxo de Sequência)
* **Finalidade:** Mostrar a ordem em que as atividades serão executadas.
* **Regras de Conexão (Tabela 7.3 da OMG):**
  * Conecta **apenas** elementos de fluxo (Events, Activities, Gateways) **dentro do mesmo Pool**.
  * **PROIBIDO** cruzar a fronteira de um Pool com um Sequence Flow.
  * **PROIBIDO** conectar Sequence Flow de/para raias (Lanes), pools, artefatos (Text Annotation, Group) ou Data Objects.

### 2.2 Message Flow (Fluxo de Mensagem)
* **Finalidade:** Mostrar a troca de mensagens e comunicações entre participantes.
* **Regras de Conexão (Tabela 7.4 da OMG):**
  * Conecta **apenas** participantes (Pools) ou elementos (Activities, Catching/Throwing Events) localizados em **Pools diferentes**.
  * **PROIBIDO** usar Message Flow entre elementos contidos no **mesmo Pool**.
  * **PROIBIDO** conectar Message Flow de/para Gateways ou Sequence Flows.
  * **PROIBIDO** usar um Start Event padrão como origem (sourceRef) de um Message Flow.

---

## 3. Estrutura XML e Esquemas de Validação (BPMN 2.0 XSD)

Para garantir que o arquivo seja aceito e renderizado sem bugs no **Bizagi Modeler**, a estrutura do XML gerado pelo Modelador deve estar 100% conforme os esquemas da OMG (`BPMN20.xsd` e `BPMNDI.xsd`).

### 3.1 Raiz e Namespaces Obrigatórios
O elemento raiz de todo arquivo BPMN deve ser `<definitions>` com as seguintes declarações padrão de namespaces:
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

### 3.2 Diagram Interchange (DI)
O Bizagi exige a declaração geométrica de cada elemento em `<bpmndi:BPMNDiagram>`. Sem DI, o arquivo é importado como "vazio" ou corrompido.
* **BPMNShape (`<dc:Bounds>`):** Especifica a posição e o tamanho dos elementos na tela.
  * Atividades (Tasks): `width="100" height="80"`
  * Gateways: `width="50" height="50"`
  * Eventos: `width="36" height="36"`
* **BPMNEdge (`<di:waypoint>`):** Especifica a rota vetorial exata das setas na tela (coordenadas x, y dos pontos de curva).
  * Exemplo:
    ```xml
    <bpmndi:BPMNEdge id="sf-ativ01-gw01_di" bpmnElement="sf-ativ01-gw01">
      <di:waypoint x="200" y="100"/>
      <di:waypoint x="250" y="100"/>
    </bpmndi:BPMNEdge>
    ```

### 3.3 Intercambiabilidade de Modelos Incompletos (OMG p. 475)
* Conforme especificado na p. 475 da OMG, durante etapas preliminares ou iterações do pipeline de agentes, o XML pode omitir atributos técnicos complexos de execução (minOccurs=0 no XSD).
* No entanto, a integridade da conectividade semântica do fluxo (origem e destino bem conectados) é **obrigatória**.

---

## 4. Convenções e Restrições de Modelagem do Escritório

### 4.1 Atores e Swimlanes (Pools/Lanes)
* **Lanes (Raias):** Usadas **apenas** para subdividir responsabilidades organizacionais de atores **internos** dentro do Pool do processo principal.
  * **PROIBIDO** criar raias vazias (sem nenhum `<flowNodeRef>`).
  * Todo elemento de fluxo deve pertencer a uma Lane (incluindo serviceTasks automáticas de sistema).
* **Pools (Black Box):** Representam atores **externos** (cliente, fornecedor, banco). O processo interno não enxerga a execução dele, comunicando-se apenas via Message Flows.
  * **Ator externo que apenas inicia o fluxo:** Se um ator externo apenas envia a mensagem inicial e não interage mais, **não crie Pool para ele**. Apenas nomeie o Start Event com o gatilho (Ex: "Requisição recebida do cliente").

### 4.2 Atividades (Tasks)
* **Nomenclatura:** Verbo Infinitivo + Objeto, máx 4 palavras, sem artigos, sem parênteses.
  * Ex correto: `"Emitir Requisição Compra"`
  * Ex errado: `"Revisado o formulário pelo analista"`
* **Classificação de Tipo:**
  * Executado por humanos (decisão, análise, contato): `userTask` (`<userTask>`).
  * Executado por sistema (`ator_responsavel` iniciado com `sis-`): `serviceTask` (`<serviceTask>`).

### 4.3 Gateways de Decisão (XOR)
* **Divergente (Split):** Deve ter rótulo em forma de pergunta fechada (máx 6 palavras, terminando em `?`).
  * As branches de saída devem ser **estritamente** nomeadas como `"Sim"` ou `"Não"` em `name=` e possuir `<conditionExpression>` lógica correspondente.
* **Convergente (Merge):** **Obrigatório** sempre que caminhos alternativos se reúnem em uma atividade comum.
  * **PROIBIDO** convergência implícita (múltiplas setas chegando na mesma tarefa).
  * Gateways convergentes **não devem ter nome/rótulo** no XML para não poluir o diagrama.

### 4.4 Loops de Retorno (Timer Obrigatório)
* Todo loop de retorno (back-edge) para uma tarefa upstream exige um `<intermediateCatchEvent>` do tipo **Timer** (`<timerEventDefinition>` configurado com `PT24H` ou semelhante) posicionado **antes do gateway de decisão**.
* Padrão correto: `[tarefa] → [timer] → [gateway] → Sim (avança) / Não (retorna para tarefa)`

---

## 5. Proibições Absolutas (Resumo para Auditoria)

1. **Lanes Vazias:** Raias sem nenhum elemento associado.
2. **Lane para Ator Externo:** Modelar parceiros externos (clientes, fornecedores) dentro de raias.
3. **Convergência Implícita:** Múltiplas conexões de entrada chegando direto em um nó de atividade sem Gateway de fusão.
4. **Sequence Flow Cross-Pool:** sequenceFlow atravessando fronteiras de Pools.
5. **Message Flow Intra-Pool:** messageFlow conectando elementos dentro do mesmo Pool.
6. **Start Event como Source de MessageFlow:** Conectar a origem de uma mensagem a um Start Event.
7. **Task sem Saída (Atividades Zumbi):** Elementos sem conexão de fluxo de saída (deadlocks).
8. **Gateway Divergente sem Pergunta:** Gateways de decisão sem rótulo ou sem interrogação ("?").
9. **Branches de Decisão Sem Nome:** Sequence flows saindo de Gateways XOR sem `name="Sim"` ou `name="Não"`.
10. **Elementos Órfãos:** Qualquer atividade, gateway ou evento que não esteja associado a uma Lane.

---

## 6. IDs de Elementos Padronizados

| Elemento | Prefixo | Exemplo |
|---|---|---|
| Atividade | `ativ-` | `ativ-01` |
| Gateway | `gw-` | `gw-01`, `gw-conv-01` |
| Evento | `ev-` | `ev-start`, `ev-end-01` |
| Timer | `timer-` | `timer-gw-01` |
| Lane | `lane-` | `lane-analista` |
| Sequence Flow | `sf-{origem}-{destino}` | `sf-ativ01-gw01` |
| Message Flow | `mf-{origem}-{destino}` | `mf-ativ02-part-fornecedor` |

---

## 7. Referências

- BPMN 2.0 Specification — OMG Document formal/2011-01-03
- GNOFI Curso Completo BPMN (`skills/bpm-modelagem/references/gnofi-curso-completo.md`)
- ABPMP BPM CBOK v4.0 — Capítulo 4: Modelação de Processos (`skills/bpm-auditoria/references/cbok-cap4.md`)
