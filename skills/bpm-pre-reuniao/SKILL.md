---
name: "BPM Pré-Reunião"
description: >
  Collects context before a BPM mapping meeting: process name, company, systems, and acronyms.
  Saves the result to contexto-reuniao.json for use in transcription and elicitation.
description_pt-BR: >
  Coleta contexto antes de uma reunião de mapeamento BPM: nome do processo, empresa, sistemas e siglas.
  Salva o resultado em contexto-reuniao.json para uso na transcrição e elicitação.
type: prompt
version: "1.0.0"
---

# BPM Pré-Reunião — Workflow

Use esta skill antes de uma reunião de mapeamento de processos. Ela coleta o contexto necessário para que a transcrição e a elicitação sejam precisas.

## Passos

1. Pergunte ao usuário, uma pergunta por vez via Telegram:
   - Qual é o nome do processo que será mapeado?
   - Qual é o nome da empresa ou área responsável?
   - Quais sistemas ou ferramentas são usados nesse processo? (ERP, CRM, planilhas, etc.)
   - Há siglas ou termos técnicos que o Whisper pode transcrever errado? Liste-os.
   - Quem são os principais atores/participantes do processo?

2. Após receber todas as respostas, monte o arquivo `contexto-reuniao.json` com a estrutura abaixo e salve em `squads/escritorio-bpm-as-is/input/contexto-reuniao.json`:

```json
{
  "processo": "<nome do processo>",
  "empresa": "<nome da empresa ou área>",
  "sistemas": ["<sistema 1>", "<sistema 2>"],
  "siglas": ["<sigla 1>", "<sigla 2>"],
  "atores": ["<ator 1>", "<ator 2>"]
}
```

3. Confirme via Telegram: "Contexto salvo. Pode iniciar a gravação da reunião."

## Regras

- Uma pergunta por vez. Não faça todas de uma vez.
- Se o usuário não souber algum campo, aceite vazio e continue.
- Português brasileiro em todas as interações.
