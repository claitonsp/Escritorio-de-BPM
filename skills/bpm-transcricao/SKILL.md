---
name: "BPM Transcrição"
description: >
  Receives an audio file via Telegram, calls the Whisper API using the meeting context vocabulary,
  and saves the transcription to transcricao.txt.
description_pt-BR: >
  Recebe um arquivo de áudio via Telegram, chama a API do Whisper com o vocabulário do contexto
  da reunião e salva a transcrição em transcricao.txt.
type: prompt
version: "1.0.0"
---

# BPM Transcrição — Workflow

Use esta skill quando o usuário enviar o áudio da reunião de mapeamento via Telegram.

## Pré-condição

O arquivo `squads/escritorio-bpm-as-is/input/contexto-reuniao.json` deve existir. Se não existir, peça ao usuário para rodar a skill **BPM Pré-Reunião** primeiro.

## Passos

1. Leia `squads/escritorio-bpm-as-is/input/contexto-reuniao.json` e extraia:
   - `sistemas`, `siglas` e `atores` para usar como vocabulário de contexto no Whisper.

2. Salve o áudio recebido em `squads/escritorio-bpm-as-is/input/reuniao.ogg` (ou extensão original).

3. Chame a API Whisper (`openai.audio.transcriptions.create`) com:
   - `model`: `whisper-1`
   - `language`: `pt`
   - `prompt`: string com os termos de `sistemas`, `siglas` e `atores` separados por vírgula (ajuda o Whisper a reconhecer vocabulário técnico)

4. Salve o texto retornado em `squads/escritorio-bpm-as-is/input/transcricao.txt`.

5. Confirme via Telegram: "Transcrição concluída. Iniciando revisão."

## Regras

- Use a variável de ambiente `OPENAI_API_KEY` para autenticar no Whisper.
- Se o áudio for maior que 25MB, avise o usuário e peça um arquivo menor ou comprimido.
- Português brasileiro em todas as interações.
