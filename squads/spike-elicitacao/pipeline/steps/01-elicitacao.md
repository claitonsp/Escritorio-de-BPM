---
agent: elicitador
outputFile: elicitacao.json
execution: inline
---

Leia a transcrição de entrevista abaixo e extraia todas as entidades do processo de negócio descrito.

Retorne SOMENTE um objeto JSON válido, sem texto antes ou depois, seguindo exatamente este schema:

```json
{
  "processo": "nome do processo identificado",
  "atores": [
    { "id": "ator-01", "nome": "nome do ator", "tipo": "interno | externo | sistema" }
  ],
  "atividades": [
    { "id": "ativ-01", "descricao": "descrição da atividade", "ator_responsavel": "id do ator", "sistema": "id do sistema ou null" }
  ],
  "eventos": [
    { "id": "ev-01", "tipo": "start | end | intermediate", "descricao": "descrição do evento" }
  ],
  "gateways": [
    { "id": "gw-01", "tipo": "exclusive | parallel | inclusive", "descricao": "condição ou decisão", "condicoes": ["caminho 1", "caminho 2"] }
  ],
  "sistemas": [
    { "id": "sis-01", "nome": "nome do sistema", "tipo": "ERP | email | outro" }
  ],
  "regras_de_negocio": [
    { "id": "rn-01", "descricao": "descrição da regra", "atividade_relacionada": "id da atividade ou null" }
  ],
  "observacoes": []
}
```

TRANSCRIÇÃO:

{{input}}
