---
name: "BPM Pipeline"
description: >
  Triggers the opensquad AS-IS pipeline, monitors execution, and notifies the user via Telegram
  when the BPMN is ready.
description_pt-BR: >
  Dispara o pipeline opensquad AS-IS, monitora a execução e notifica o usuário via Telegram
  quando o BPMN estiver pronto.
type: prompt
version: "1.0.0"
---

# BPM Pipeline — Workflow

Use esta skill para disparar o pipeline de modelagem AS-IS após a transcrição revisada estar pronta.

## Pré-condição

O arquivo `squads/escritorio-bpm-as-is/input/transcricao-final.txt` deve existir. Se não existir, peça ao usuário para rodar a skill **BPM Revisão** primeiro.

## Passos

1. Confirme com o usuário antes de iniciar: "Vou rodar o pipeline AS-IS agora. Confirma?"

2. Execute o pipeline a partir da raiz do projeto:
```
npx opensquad run escritorio-bpm-as-is
```

3. Monitore a execução. Informe o usuário via Telegram o progresso a cada step concluído:
   - "Step 01 — Elicitador: concluído"
   - "Step 02 — Checkpoint elicitação: aprovado"
   - "Step 03 — Modelador: concluído"
   - "Step 04 — Checkpoint BPMN: aprovado"
   - "Step 05 — Auditor: concluído"
   - "Step 06 — Checkpoint auditoria: aprovado"

4. Quando o pipeline finalizar, identifique a pasta de output gerada (formato `output/YYYY-MM-DD-HHMMSS/v1/`) e notifique via Telegram:
   - "Pipeline concluído. BPMN gerado em: `output/<run>/v1/processo-as-is-layout.bpmn`"
   - Liste os achados do auditor (campo `achados` do `diagnostico-as-is.json`) em formato resumido.

5. Informe se algum checkpoint reprovou e qual foi o motivo.

## Regras

- Nunca rodar sem confirmação explícita do usuário.
- Se o pipeline falhar em algum step, reportar o erro completo via Telegram.
- Português brasileiro em todas as interações.
