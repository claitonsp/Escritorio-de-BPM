---
agent: elicitador
outputFile: elicitacao.json
execution: inline
---

Extraia as entidades abaixo da transcrição e retorne JSON estruturado. Retorne APENAS o JSON, sem explicação. Comece com { e termine com }.

## Transcrição

{{input}}

## Schema

```json
{
  "processo": "nome do processo",
  "atores": [{ "id": "ator-01", "nome": "...", "tipo": "interno | externo | sistema" }],
  "atividades": [{ "id": "ativ-01", "nome_bpmn": "...", "descricao": "...", "ator_responsavel": "ator-XX ou sis-XX", "sistema": "sis-XX ou null", "task_type": "userTask | serviceTask | scriptTask" }],
  "eventos": [{ "id": "ev-01", "tipo": "start | end", "nome_bpmn": "...", "descricao": "..." }],
  "gateways": [{
    "id": "gw-01", "tipo": "exclusive", "nome_bpmn": "...", "descricao": "...",
    "condicoes": [{ "label": "Sim", "descricao": "...", "destino_tipo": "atividade | evento_fim | loop", "destino_id": "ativ-XX | ev-XX" }]
  }],
  "sistemas": [{ "id": "sis-01", "nome": "...", "tipo": "ERP | CRM | outro" }],
  "regras_de_negocio": [{ "id": "rn-01", "descricao": "...", "atividade_relacionada": "ativ-XX" }],
  "observacoes": ["..."]
}
```

## Regras de nomenclatura (`nome_bpmn`)

**Atividades:** Verbo Infinitivo + Objeto, máx 4 palavras, sem artigos, sem parênteses. Ex: `"Emitir Requisição de Compra"`.
- Se o mesmo conceito aparece com atores ou naturezas distintas, crie atividades separadas com nomes distintos (ex: `"Baixar Título via Sistema"` vs `"Baixar Título Manual"`). Nunca repita `nome_bpmn` com `ator_responsavel` ou `task_type` diferentes.

**Eventos start:** estado que dispara o processo, máx 4 palavras, sem verbo conjugado. Ex: `"Necessidade de aquisição identificada"`.
**Eventos end:** estado resultante, máx 3 palavras. Ex: `"Pagamento efetuado"`.
**Gateways:** pergunta fechada terminando com "?", máx 6 palavras. Ex: `"RC está clara e correta?"`.

**Condições de gateway:**
- `label`: `"Sim"` ou `"Não"`
- `destino_tipo`: `"atividade"` (fluxo normal), `"evento_fim"` (encerramento definitivo), `"loop"` (retorno para reprocessamento)
- Use `"loop"` quando houver "devolver", "corrigir", "tentar novamente". Use `"evento_fim"` só quando o processo termina sem retorno.

## Classificação `task_type`

- `"userTask"` — humano executa manualmente (análise, aprovação, contato)
- `"serviceTask"` — sistema executa automaticamente (integração ERP, geração NF, e-mail automático); também quando humano apenas inicia e o sistema executa
- `"scriptTask"` — regra automática do motor de processo (raro no AS-IS)
- Se `ator_responsavel` é `sis-XX` → sempre `"serviceTask"`

## Tipos de ator

- `"interno"` → Lane no Pool principal
- `"externo"` → Pool Black Box separado (fornecedor, cliente, banco, transportadora, órgão regulador são SEMPRE externos)
- `"sistema"` → serviceTask na lane do responsável, sem Lane/Pool próprio
