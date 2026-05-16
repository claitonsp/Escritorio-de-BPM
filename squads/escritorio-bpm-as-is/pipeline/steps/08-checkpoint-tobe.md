---
type: checkpoint
---

O Designer TO-BE gerou o XML BPMN do processo futuro. Antes de encerrar, execute a validação automática abaixo.

## Passo 1 — Validação estrutural (obrigatória, sem exceção)

```bash
# 1a. Nomes longos — deve retornar zero linhas
grep -oP 'name="[^"]{51,}"' processo-tobe.bpmn
```

```bash
# 1b. Lane vazia ou ator externo como Lane
grep -i 'lane.*fornecedor\|lane.*cliente\|lane.*transportadora' processo-tobe.bpmn
```

```bash
# 1c. Gateways sem name nas saídas — deve retornar zero linhas
grep -P 'sourceRef="gw-' processo-tobe.bpmn | grep -v 'name='
```

```bash
# 1d. Achados de prioridade alta presentes — confirmar que cada recomendação foi aplicada
# Para cada ach com prioridade "alta" no diagnostico-as-is.json, confirmar que
# o elemento correspondente existe no processo-tobe.bpmn:
grep -c 'serviceTask\|gw-03b\|gw-08\|ativ-05b\|gw-07b' processo-tobe.bpmn
# Deve retornar número > 0 para cada um dos elementos esperados
```

Se qualquer verificação retornar resultado problemático, **corrija antes de continuar**.

## Passo 2 — Layout visual

```bash
node squads/escritorio-bpm-as-is/scripts/bpmn-layout.js \
  <caminho>/processo-tobe.bpmn \
  <caminho>/processo-tobe-layout.bpmn
```

Abra no bpmn.io e confirme:
- Todas as melhorias do diagnóstico visíveis no diagrama
- Atividades automatizadas com ícone de engrenagem (serviceTask)
- Gateways novos presentes com labels Sim/Não
- Nenhuma Lane vazia
- Setas visíveis em todos os elementos

## Passo 3 — Aprovação

Só encerre o pipeline após:
- [ ] Todas as verificações grep retornaram resultado esperado
- [ ] Layout visual validado no bpmn.io
- [ ] Todos os achados de prioridade alta do Auditor estão implementados
