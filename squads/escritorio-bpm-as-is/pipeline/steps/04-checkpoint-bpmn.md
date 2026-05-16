---
type: checkpoint
---

O Modelador gerou o XML BPMN. Antes de avançar, execute a validação automática abaixo.

## Passo 1 — Validação estrutural (obrigatória, sem exceção)

Execute os comandos a seguir e reporte o resultado de CADA UM:

```bash
# 1a. Lanes vazias — resultado deve ser zero linhas
grep -n '<lane ' processo-as-is.bpmn | while read lane; do
  id=$(echo "$lane" | grep -o 'id="[^"]*"' | head -1)
  echo "$id"
done
# (alternativa simples)
grep -c 'flowNodeRef' processo-as-is.bpmn
```

```bash
# 1b. Nomes longos — deve retornar zero linhas (nenhum name= com mais de 50 chars)
grep -oP 'name="[^"]{51,}"' processo-as-is.bpmn
```

```bash
# 1c. Lanes sem flowNodeRef — deve retornar zero blocos
grep -A1 '<lane ' processo-as-is.bpmn | grep -B1 '</lane>'
```

```bash
# 1d. Gateways sem name nas saídas — deve retornar zero linhas
grep -P 'sourceRef="gw-' processo-as-is.bpmn | grep -v 'name='
```

```bash
# 1e. Ator externo modelado como Lane — deve retornar zero (Fornecedor, cliente, etc. não devem estar em <lane>)
grep -i 'lane.*fornecedor\|lane.*cliente\|lane.*transportadora' processo-as-is.bpmn
```

```bash
# 1f. SequenceFlow cruzando fronteira de Pool — deve retornar zero linhas
# Um sequenceFlow cujo sourceRef ou targetRef aponta para um <participant> é violação BPMN 2.0
grep -oP 'sequenceFlow[^>]*sourceRef="part-[^"]*"' processo-as-is.bpmn
grep -oP 'sequenceFlow[^>]*targetRef="part-[^"]*"' processo-as-is.bpmn
```

```bash
# 1g. Convergência implícita — tarefas com mais de uma seta de entrada sem gateway convergente
# Conta sourceRefs duplicados: se um mesmo targetRef aparece mais de uma vez em sequenceFlows,
# pode ser convergência implícita. Resultado deve ser inspecionado manualmente.
grep -oP 'targetRef="\K[^"]+' processo-as-is.bpmn | sort | uniq -d
```

```bash
# 1h. Loop sem controle — sequenceFlow de retorno sem intermediateCatchEvent (timer) antes da atividade
# Detecta back-edges diretos de gateway para atividade sem timer intermediário.
# Se houver conditionExpression "Não" apontando para uma userTask ou serviceTask (não para um evento),
# é provável que o loop esteja sem controle de tempo.
grep -oP 'sequenceFlow[^>]*targetRef="ativ-[^"]*"[^>]*>' processo-as-is.bpmn \
  | grep -v 'intermediateCatchEvent' \
  | grep 'conditionExpression' || echo "OK - loops com controle ou sem loop"
# Alternativa: verificar se existe pelo menos um intermediateCatchEvent no arquivo quando há back-edge
grep -c 'intermediateCatchEvent' processo-as-is.bpmn
```

Se qualquer verificação retornar resultado, **corrija o BPMN antes de continuar**. Não avance para o Auditor com erros.

**Nota sobre 1g × 1h:** `targetRef` duplicado em 1g é loop intencional quando o segundo `sourceRef` é um `intermediateCatchEvent` (timer). Verifique 1h antes de concluir que 1g é violação.

## Passo 2 — Layout visual

```bash
node squads/escritorio-bpm-as-is/scripts/bpmn-layout.js \
  <caminho>/processo-as-is.bpmn \
  <caminho>/processo-as-is-layout.bpmn
```

Abra no bpmn.io e confirme visualmente:
- Lanes horizontais, sem Lane vazia
- Setas visíveis em todos os elementos
- Gateways com label terminando em "?"
- Nenhum elemento sobreposto

## Passo 3 — Aprovação

Só passe para o Auditor após:
- [ ] Todas as 7 verificações grep retornaram zero resultados (1g requer inspeção manual)
- [ ] Layout visual validado no bpmn.io

Cole o conteúdo do `elicitacao.json` para o Auditor processar.
