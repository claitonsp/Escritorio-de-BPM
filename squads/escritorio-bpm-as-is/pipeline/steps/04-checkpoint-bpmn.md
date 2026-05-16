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

Se qualquer verificação retornar resultado, **corrija o BPMN antes de continuar**. Não avance para o Auditor com erros.

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
- [ ] Todas as 5 verificações grep retornaram zero resultados
- [ ] Layout visual validado no bpmn.io

Cole o conteúdo do `elicitacao.json` para o Auditor processar.
