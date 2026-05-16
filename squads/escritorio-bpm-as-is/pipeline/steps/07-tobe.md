---
agent: tobe
outputFile: processo-tobe.bpmn
execution: inline
---

Você receberá dois JSONs: o `elicitacao.json` (estrutura AS-IS) e o `diagnostico-as-is.json` (achados e recomendações). Gere o XML BPMN 2.0 do processo TO-BE incorporando todas as melhorias com `prioridade: "alta"` e as demais quando viáveis sem alterar a lógica essencial do processo.

## Input

{{input}}

## Lógica de transformação AS-IS → TO-BE

### 1. Preserve a estrutura base
- Mantenha todos os IDs do AS-IS (ativ-XX, gw-XX, ev-XX, lane-XX)
- Mantenha a sequência lógica e os gateways existentes
- Apenas adicione, substitua ou remova elementos quando um achado indicar explicitamente

### 2. Aplique cada recomendação do diagnóstico
Para cada achado no `diagnostico-as-is.json`:
- Leia o campo `recomendacao` e aplique a transformação no BPMN
- IDs novos: use o ID base + sufixo (`ativ-05b`, `gw-03b`, `ev-05`, etc.)
- Prioridade alta → obrigatório. Média/baixa → aplicar se não criar complexidade desnecessária.

### 3. Tipos de transformação possíveis

| Transformação | Como modelar |
|---|---|
| Automatizar atividade | Muda `<userTask>` para `<serviceTask>` |
| Adicionar controle | Inserir `<exclusiveGateway>` com saídas Sim/Não |
| Adicionar atividade | Nova `<userTask>` ou `<serviceTask>` no fluxo |
| Adicionar evento final | Novo `<endEvent>` para caminho de exceção |
| Limitar loop | Adicionar gateway contador antes do loop back |
| Adicionar SLA | Registrar no `name=` da atividade (ex: "SLA: D+1") |

## Convenções obrigatórias (idênticas ao Modelador)

### Atores internos vs externos
- `tipo: "interno"` → Lane dentro do Pool principal
- `tipo: "externo"` → Pool separado Black Box + `<collaboration>` + `<messageFlow>`
- `tipo: "sistema"` → Sem lane, representado como `<serviceTask>`
- **Nunca crie Lane vazia** (sem `<flowNodeRef>`)

### Nomenclatura BPMN — campo `name=`
Use nomes curtos e padronizados:
- **Atividades**: Verbo Infinitivo + Objeto, máx 4 palavras (ex: `"Registrar mapa comparativo"`)
- **Eventos start**: estado que dispara, máx 4 palavras (ex: `"Necessidade de aquisição identificada"`)
- **Eventos end**: estado resultante, máx 3 palavras (ex: `"Pagamento efetuado"`, `"Plano B acionado"`)
- **Gateways**: pergunta com `?`, máx 6 palavras (ex: `"Mercadoria conforme o PC?"`)
- Nunca use parênteses, dois-pontos ou descrições longas no `name=`

### Gateways — rótulos obrigatórios nas saídas
Cada `<sequenceFlow>` saindo de gateway DEVE ter `name="Sim"` ou `name="Não"`:
```xml
<sequenceFlow id="sf-gw01-ativ02" name="Sim" sourceRef="gw-01" targetRef="ativ-02">
  <conditionExpression>Sim</conditionExpression>
</sequenceFlow>
```

### Loops
- Condição de retorno → `<sequenceFlow>` de volta para atividade anterior
- Nunca use `<endEvent>` quando a semântica é "tentar novamente"
- End Event de exceção → somente quando o caminho encerra definitivamente

### IDs
- Elementos mantidos: mesmo ID do AS-IS
- Elementos novos: `ativ-XXb`, `gw-XXb`, `ev-XX` (sequência continuada)
- SequenceFlows: `sf-{origem}-{destino}`

## Estrutura raiz — sem atores externos

```xml
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
             xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
             xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
             targetNamespace="http://escritorio-bpm/tobe"
             id="definitions_tobe">
  <process id="proc_tobe" name="[nome do processo] — TO-BE" isExecutable="false">
    <laneSet id="ls_01">
      <!-- apenas lanes de atores internos com atividades -->
    </laneSet>
    <!-- elementos de fluxo -->
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="proc_tobe">
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
             targetNamespace="http://escritorio-bpm/tobe"
             id="definitions_tobe">
  <collaboration id="collab_01">
    <participant id="part-empresa" name="[Nome da Empresa]" processRef="proc_tobe"/>
    <participant id="part-[ator-externo]" name="[Nome Ator Externo]" isExecutable="false"/>
    <messageFlow id="mf-[ativ]-[part]" sourceRef="[id-atividade]" targetRef="part-[ator-externo]"/>
  </collaboration>
  <process id="proc_tobe" name="[nome do processo] — TO-BE" isExecutable="false">
    <laneSet id="ls_01">
      <!-- apenas atores internos -->
    </laneSet>
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="collab_01">
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>
```

Retorne APENAS o XML. Comece com `<?xml` e termine com `</definitions>`.
