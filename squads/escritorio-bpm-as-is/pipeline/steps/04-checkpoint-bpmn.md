---
type: checkpoint
---

O Modelador gerou o XML BPMN. Antes de avançar, execute a validação automática estrutural e de conformidade oficial.

## Passo 1 — Validação Estrutural e Semântica OMG

Execute o script de validação de BPMN XML no terminal:

```bash
node squads/escritorio-bpm-as-is/scripts/validate-bpmn-xml.js processo-as-is.bpmn
```

Este script automático verifica com precisão matemática:
* **Conformidade de Raias (Lanes):** Lanes vazias, elementos sem lane associada, lanes representando atores externos.
* **Matriz de Conectividade da OMG:** sequenceFlows cruzando pools ou messageFlows internos.
* **Gateways Divergentes/Convergentes:** Pergunta no rótulo, Sim/Não e expressões lógicas de condições em saídas, ausência de rótulos poluentes em junções convergentes.
* **Convergência Implícita (OMG 7.3.2):** Múltiplos fluxos de controle chegando na mesma atividade sem gateway convergente (Merge).
* **Atividades Zumbi:** Tarefas ou eventos sem fluxos de saída (deadlocks).
* **Lógica de Loops:** Loops sem controle de tempo por timer intermediário catch event.
* **Nomenclatura BPMN:** Verbos no infinitivo, nomes com mais de 50 caracteres.

> [!IMPORTANT]
> Se o script reportar qualquer **ERRO CRÍTICO (Exit Code 1)**, você **NÃO PODE APROVAR** o checkpoint. O Modelador deve refazer o XML ajustando as tags.

---

## Passo 2 — Geração de Layout e Inspeção Visual

Gere o posicionamento geométrico oficial do Diagram Interchange (DI):

```bash
node squads/escritorio-bpm-as-is/scripts/bpmn-layout.js \
  processo-as-is.bpmn \
  processo-as-is-layout.bpmn
```

Abra o arquivo gerado `processo-as-is-layout.bpmn` no modelador visual (Bizagi ou bpmn.io) e confirme visualmente:
* As raias horizontais estão bem espaçadas.
* Todas as setas estão conectadas perfeitamente e visíveis.
* Não há caixas sobrepostas.
* O fluxo flui logicamente da esquerda para a direita.

---

## Passo 3 — Critérios de Aprovação

Aprovação condicionada a:
- [ ] O validador automático (`validate-bpmn-xml.js`) rodou com sucesso sem **NENHUM ERRO** (avisos de melhorias são aceitos se justificados).
- [ ] Layout visual validado no Bizagi/bpmn.io sem cruzamentos ou sobreposições confusas.

Se aprovado, avance o pipeline enviando o JSON de elicitação e o BPMN XML validado para o **Auditor** processar.
