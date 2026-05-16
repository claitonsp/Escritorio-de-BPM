---
agent: modelador
outputFile: aprovacao-compra-as-is.bpmn
execution: inline
---

Você receberá um JSON de elicitação de processo e deverá gerar um XML BPMN 2.0 completo e válido.

## Input

{{input}}

## Convenções obrigatórias

### Lanes
Crie uma lane para cada ator com tipo "interno" ou "externo" no array `atores`.
Atores com tipo "sistema" NÃO recebem lane própria.
As lanes devem aparecer na seguinte ordem: Solicitante, Supervisor, Gerente de Compras, Setor de Cadastro, Fornecedor, Almoxarifado, Financeiro.

### Tipos de tarefa
- Atividades com `ator_responsavel` apontando para um ator humano ou externo: gerar `<userTask>`.
- Atividades com `ator_responsavel` apontando para um ator do tipo "sistema": gerar `<serviceTask>` dentro da lane do ator humano que executou a atividade imediatamente anterior no fluxo.

Aplicação concreta:
- `ativ-09` (ator_responsavel: sis-01) é serviceTask na lane do Gerente de Compras (após ativ-08).
- `ativ-14` (ator_responsavel: sis-01) é serviceTask na lane do Almoxarifado (após ativ-12).

### Gateways
Todos os gateways são do tipo exclusivo. Use `<exclusiveGateway>`.
As condições de saída devem ser expressas como `<conditionExpression>` em cada `<sequenceFlow>` de saída do gateway.

### Eventos
- `ev-01` (start): `<startEvent>` na lane do Solicitante.
- `ev-02` (end, "Pagamento efetuado"): `<endEvent>` na lane do Financeiro.
- `ev-03` (end, "Requisição devolvida (sem orçamento)"): `<endEvent>` na lane do Gerente de Compras.
- Adicione um quarto endEvent com id `ev-04`, name="Divergência resolvida (fluxo indefinido)", na lane do Gerente de Compras. Este elemento não está no JSON de elicitação mas é necessário para fechar o sequenceFlow após ativ-13.

### Sequência de fluxo completa
Implemente exatamente estes 24 sequenceFlows, sem omissões:

1. ev-01 → ativ-01
2. ativ-01 → ativ-02
3. ativ-02 → gw-01
4. gw-01 [condição: "Até R$ 5.000"] → ativ-03
5. gw-01 [condição: "Acima de R$ 5.000"] → ativ-03
6. ativ-03 → gw-02
7. gw-02 [condição: "Não"] → ativ-04
8. ativ-04 → ev-03
9. gw-02 [condição: "Sim"] → ativ-05
10. ativ-05 → ativ-06
11. ativ-06 → gw-03
12. gw-03 [condição: "Não"] → ativ-07
13. ativ-07 → ativ-08
14. gw-03 [condição: "Sim"] → ativ-08
15. ativ-08 → ativ-09
16. ativ-09 → ativ-10
17. ativ-10 → ativ-11
18. ativ-11 → gw-04
19. gw-04 [condição: "Tudo certo"] → ativ-12
20. gw-04 [condição: "Divergência"] → ativ-13
21. ativ-12 → ativ-14
22. ativ-14 → ativ-15
23. ativ-15 → ev-02
24. ativ-13 → ev-04

### Namespaces e estrutura raiz obrigatórios

O XML deve iniciar exatamente assim:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
             xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
             xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
             targetNamespace="http://escritorio-bpm/spike-modelador"
             id="definitions_aprovacao_compra">
  <process id="proc_aprovacao_compra" name="Processo de Aprovação de Compra" isExecutable="false">
    <laneSet id="ls_01">
      <!-- lanes aqui -->
    </laneSet>
    <!-- elementos de fluxo aqui -->
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="proc_aprovacao_compra">
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>
```
IDs a usar
Use os IDs do JSON diretamente (ativ-01, gw-01, ev-01, etc.).
Para sequenceFlows, use o padrão sf-{origem}-{destino} (ex: sf-ev01-ativ01).
Para lanes, use lane-{id-do-ator} (ex: lane-ator01).

Output esperado
Retorne APENAS o XML BPMN 2.0 completo, sem explicação, sem markdown, sem bloco de código. O XML deve começar com <?xml e terminar com </definitions>.
