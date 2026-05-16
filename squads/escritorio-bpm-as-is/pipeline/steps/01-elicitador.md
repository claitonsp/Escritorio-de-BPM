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
    { "id": "ativ-01", "nome_bpmn": "...", "descricao": "...", "ator_responsavel": "ator-XX ou sis-XX", "sistema": "sis-XX ou null" }
  ],
  "eventos": [
    { "id": "ev-01", "tipo": "start | end", "nome_bpmn": "...", "descricao": "..." }
  ],
  "gateways": [
    {
      "id": "gw-01",
      "tipo": "exclusive",
      "nome_bpmn": "...",
      "descricao": "...",
      "condicoes": [
        { "label": "Sim", "descricao": "...", "destino_tipo": "atividade | evento_fim | loop", "destino_id": "ativ-XX | ev-XX" },
        { "label": "Não", "descricao": "...", "destino_tipo": "atividade | evento_fim | loop", "destino_id": "ativ-XX | ev-XX" }
      ]
    }
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

## Convenção de nomenclatura BPMN (campo `nome_bpmn`)

O campo `nome_bpmn` é obrigatório em atividades, eventos e gateways. Ele é o rótulo exato que aparecerá no diagrama. Regras:

### Atividades (`atividades[].nome_bpmn`)
- Formato: **Verbo Infinitivo + Objeto**
- Máximo 4 palavras
- Sem artigos ("o", "a", "os", "as"), sem parênteses, sem dois-pontos
- Exemplos corretos: `"Emitir Requisição de Compra"`, `"Analisar orçamentos recebidos"`, `"Aprovar Pedido de Compra"`
- Exemplos errados: `"Emitir Requisição de Compra (RC) com descrição do material..."` ❌

### Eventos (`eventos[].nome_bpmn`)
- Evento start: **estado ou contexto que dispara o processo** — máx 4 palavras, sem verbo conjugado
  - Exemplo: `"Necessidade de aquisição identificada"`
- Evento end: **estado resultante conciso** — máx 3 palavras
  - Exemplos: `"Pagamento efetuado"`, `"Pedido cancelado"`, `"Plano B acionado"`

### Gateways (`gateways[].nome_bpmn`)
- Formato: **pergunta fechada (sim/não) terminando com "?"**
- Máximo 6 palavras
- Sem parênteses, sem explicações adicionais
- Exemplos corretos: `"RC está clara e correta?"`, `"Fornecedor ativo na carteira?"`, `"Mínimo de 3 orçamentos recebidos?"`
- Exemplos errados: `"Fornecedor já está ativo na carteira de fornecedores?"` ❌ (muitas palavras)

### Condições de gateway (`gateways[].condicoes`)

Cada condição deve ter:
- `label`: `"Sim"` ou `"Não"` (rótulo que aparecerá na seta do diagrama)
- `descricao`: descrição completa do que ocorre neste caminho
- `destino_tipo`: um dos três valores abaixo:
  - `"atividade"` — o fluxo vai para uma próxima atividade (caminho normal)
  - `"evento_fim"` — o fluxo termina o processo definitivamente neste ponto (abandono, encerramento permanente)
  - `"loop"` — o fluxo retorna a uma atividade anterior para reprocessamento (devolução para correção, nova tentativa)
- `destino_id`: o ID da atividade ou evento de destino (`ativ-XX` ou `ev-XX`)

**Regra crítica**: use `"evento_fim"` apenas quando o processo realmente termina sem retorno possível. Se houver menção a "devolver", "corrigir", "tentar novamente" ou "buscar alternativa", use `"loop"` com `destino_id` apontando para a atividade de origem.

## Ator externo

O campo `tipo` do ator é crítico para a modelagem BPMN:
- `"interno"`: pertence à organização → representado como Lane no Pool principal
- `"externo"`: fora da organização (fornecedor, cliente, banco) → representado como Pool Black Box separado
- `"sistema"`: software/plataforma → representado como serviceTask, sem lane própria

Identifique corretamente: **Fornecedor, cliente, banco, transportadora, órgão regulador** são sempre `"externo"`.

Retorne APENAS o JSON, sem explicação, sem markdown, sem bloco de código. Comece com { e termine com }.
