---
name: "BPM Pipeline"
description: >
  Runs the AS-IS BPM pipeline end-to-end (elicitation → modeling → layout → audit)
  and notifies the user via Telegram when the BPMN is ready.
description_pt-BR: >
  Executa o pipeline BPM AS-IS ponta a ponta (elicitação → modelagem → layout → auditoria)
  e notifica o usuário via Telegram quando o BPMN estiver pronto.
type: prompt
version: "2.2.0"
---

# BPM Pipeline — Workflow

Use esta skill para disparar o pipeline de modelagem AS-IS após a transcrição revisada estar pronta.

## Pré-condição

O arquivo `squads/escritorio-bpm-as-is/input/transcricao-final.txt` deve existir.
Se não existir, peça ao usuário para rodar a skill **BPM Revisão** primeiro.

## Passos

1. Confirme com o usuário antes de iniciar: "Vou rodar o pipeline AS-IS agora. Confirma?"

2. Use a ferramenta bash para executar o script a partir da raiz do projeto:

```bash
cd C:/Users/Claiton/Documents/Escritorio-de-BPM && bash squads/escritorio-bpm-as-is/scripts/run-pipeline.sh
```

3. Monitore a saída. A cada linha `[XX] Concluído` ou `[XX] Aprovado`, notifique o usuário via Telegram:
   - "[01] Elicitador: concluído"
   - "[02] Checkpoint elicitação: aprovado"
   - "[03] Modelador: concluído"
   - "[03b] Layout: concluído"
   - "[04] Checkpoint BPMN: aprovado"
   - "[05] Auditor: concluído"
   - "[06] Checkpoint auditoria: aprovado"

4. Ao final (linha `=== PIPELINE CONCLUÍDO ===`), notifique via Telegram:
   - "Pipeline concluído. BPMN em: `output/<RUN_ID>/v1/processo-as-is-layout.bpmn`"
   - Liste os achados exibidos na saída (linhas que começam com `•`).

5. Se o script terminar com exit code diferente de 0, reporte o erro completo via Telegram.

## Códigos de saída

| Código | Significado |
|--------|-------------|
| 11 | elicitacao.json inválido |
| 12 | Checkpoint elicitação reprovado |
| 13 | BPMN gerado inválido |
| 14 | Checkpoint BPMN reprovado |
| 15 | diagnostico-as-is.json inválido |
| 16 | Checkpoint auditoria reprovado |

## Regras

- Nunca rodar sem confirmação explícita do usuário.
- Se qualquer step reprovar, reportar o erro completo via Telegram antes de encerrar.
- Português brasileiro em todas as interações.

## ⛔ PROIBIÇÕES ABSOLUTAS

Estas regras têm prioridade máxima e NUNCA devem ser violadas:

1. **NUNCA gere BPMN diretamente.** Não use ferramentas de escrita/edição (Write, Edit, etc.) para criar ou modificar arquivos `.bpmn`. O BPMN é gerado exclusivamente pelo `run-pipeline.sh`.

2. **NUNCA sobrescreva arquivos do pipeline.** Os arquivos `processo-as-is.bpmn`, `processo-as-is-layout.bpmn`, `elicitacao.json` e `diagnostico-as-is.json` são gerados pelo script. Não os toque.

3. **NUNCA tente corrigir um pipeline com falha.** Se o script sair com código de erro, reporte o erro exato ao usuário e encerre. Não tente re-executar, ajustar ou contornar a falha.

4. **NUNCA execute outras ferramentas além do bash com o comando acima.** Não leia arquivos BPMN, não analise o conteúdo gerado, não valide o XML manualmente.
