---
agent: elicitador
outputFile: elicitacao.json
execution: inline
---

Você receberá a transcrição de uma entrevista sobre um processo de negócio. Extraia as entidades abaixo e retorne um JSON estruturado.

## Input

{{input}}

## Schema de saída obrigatório

```json
{
  "processo": "nome do processo",
  "atores": [
    { "id": "ator-01", "nome": "...", "tipo": "interno | externo | sistema" }
  ],
  "atividades": [
    { "id": "ativ-01", "descricao": "...", "ator_responsavel": "ator-XX ou sis-XX", "sistema": "sis-XX ou null" }
  ],
  "eventos": [
    { "id": "ev-01", "tipo": "start | end", "descricao": "..." }
  ],
  "gateways": [
    { "id": "gw-01", "tipo": "exclusive", "descricao": "...", "condicoes": ["..."] }
  ],
  "sistemas": [
    { "id": "sis-01", "nome": "...", "tipo": "ERP | CRM | outro" }
  ],
  "regras_de_negocio": [
    { "id": "rn-01", "descricao": "...", "atividade_relacionada": "ativ-XX" }
  ],
  "observacoes": ["..."]
}
```
Retorne APENAS o JSON, sem explicação, sem markdown, sem bloco de código. Comece com { e termine com }.
