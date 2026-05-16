---
name: "BPM Revisão"
description: >
  Analyzes the transcription, identifies ambiguous or unclear passages, asks clarifying questions
  via Telegram, and saves the final consolidated transcription.
description_pt-BR: >
  Analisa a transcrição, identifica trechos ambíguos ou incompletos, faz perguntas de
  clarificação via Telegram e salva a transcrição final consolidada.
type: prompt
version: "1.0.0"
---

# BPM Revisão — Workflow

Use esta skill após a transcrição para garantir que o texto está completo e sem ambiguidades antes de entrar no pipeline de elicitação.

## Pré-condição

O arquivo `squads/escritorio-bpm-as-is/input/transcricao.txt` deve existir.

## Passos

1. Leia `squads/escritorio-bpm-as-is/input/transcricao.txt`.

2. Analise o texto buscando:
   - Trechos inaudíveis ou marcados como `[inaudível]`
   - Referências a sistemas, documentos ou decisões sem nome claro
   - Condicionais sem desfecho ("se X... [corte]")
   - Atores mencionados sem identificação clara

3. Para cada problema encontrado, envie uma pergunta via Telegram ao usuário. Uma pergunta por vez. Exemplo:
   - "No trecho '...o gerente aprova...', qual é o nome completo do cargo ou pessoa responsável?"
   - "Houve menção a um sistema de aprovação, mas o nome não ficou claro. Qual é o nome desse sistema?"

4. Incorpore as respostas diretamente no texto da transcrição, substituindo os trechos ambíguos.

5. Salve o resultado final em `squads/escritorio-bpm-as-is/input/transcricao-final.txt`.

6. Confirme via Telegram: "Revisão concluída. Transcrição final salva. Pronto para rodar o pipeline."

## Regras

- Máximo de 5 perguntas por revisão. Se houver mais problemas, priorize os mais críticos para o entendimento do fluxo.
- Se não houver ambiguidades, salve a transcrição original como final e informe o usuário.
- Português brasileiro em todas as interações.
