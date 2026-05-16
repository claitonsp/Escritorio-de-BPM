# Handoff Document — Escritório de BPM

## Seu papel nesta sessão

Você é o Claude rodando no Antigravity, atuando como **cérebro estratégico** do projeto. Suas atribuições: tomar decisões metodológicas, validar outputs, escrever conteúdo de skills (markdown com frontmatter YAML), explicar trade-offs técnicos, e desafiar premissas quando algo não fechar.

O **Gemini**, em sessão separada do Antigravity, atua como **construtor executor**. Suas atribuições: rodar comandos no terminal, criar arquivos com o conteúdo que você definir, executar scripts Python, navegar pelo filesystem.

Regra de ouro: **quando uma ação precisar acontecer no sistema, você não finge que executou. Você entrega ao usuário a instrução pronta para ele colar na aba do Gemini.**

## Sobre o usuário

Dos Santos, profissional brasileiro com 12 anos em análise de processos, implantação de ERP, BI e automação. Cursa MBA Executivo em BPM na Unyleya (abril a novembro de 2026). Reside em Canoas e Sapucaia do Sul, RS. Comunicação em português brasileiro.

## O que estamos construindo

Um **Escritório de Processos agêntico** que automatiza consultoria BPM ponta a ponta, desde a entrevista com cliente até a entrega de fluxos BPMN AS-IS, diagnóstico de processo e fluxo TO-BE com plano de implantação.

Pipeline de quatro agentes especializados:

1. **Elicitador (BABOK)**: extrai entidades de uma transcrição, gerando JSON com `nome_bpmn` (curto, para o diagrama) e `descricao` (completo, para contexto). Produz `elicitacao.json`.
2. **Modelador AS-IS (BPMN 2.0)**: traduz o JSON em XML BPMN estruturado com lanes, gateways e sequenceFlows. Produz `processo-as-is.bpmn`.
3. **Auditor (CBOK + Lean Six Sigma + ISO 9001)**: confronta o AS-IS com frameworks de mercado, gera backlog priorizado de melhorias. Produz `diagnostico-as-is.json`.
4. **TO-BE (Designer de Solução)**: aplica as recomendações do Auditor, gera BPMN futuro. Produz `processo-tobe.bpmn`.

Layout visual gerado por `bpmn-layout.js` (script Node.js local, sem dependências) após cada agente BPMN. Visualização validada no bpmn.io.

## Stack

- **Framework**: opensquad (file-based, pipeline serial inline)
- **IDE host**: Antigravity
- **Cérebro**: Claude (essa sessão)
- **Construtor**: Gemini (sessão separada no Antigravity)
- **Pasta do projeto**: `C:\Users\Claiton\Documents\Escritorio-de-BPM`
- **Repositório**: GitHub (branch main, push requer PAT do usuário)
- **Node**: v24.13.1

## Estado atual do projeto (2026-05-16)

### Run de validação: `output/2026-05-16-000001/v1/`

Pipeline AS-IS executado com a mesma transcrição (Camila Evers, YouTube — Processo de Compras) para validar todas as regras atualizadas nos prompts:

```
✅ Step 01 — Elicitador       → elicitacao.json (14 ativ, 7 gw, 6 atores, 1 ERP)
✅ Step 02 — Checkpoint       → aprovado
✅ Step 03 — Modelador        → processo-as-is.bpmn
✅ bpmn-layout.js             → processo-as-is-layout.bpmn
✅ Step 04 — Checkpoint BPMN  → aprovado (2 correções automáticas detectadas pelo grep)
✅ Step 05 — Auditor          → diagnostico-as-is.json (5 achados: 1 alta, 3 média, 1 baixa)
✅ Step 06 — Checkpoint Audit → aprovado
```

O TO-BE é produzido manualmente a partir do diagnóstico. Não faz parte do pipeline automatizado.

### O que foi validado nesta run

- `nome_bpmn` curto gerado corretamente pelo Elicitador (máx 4 palavras)
- `condicoes` estruturadas com `label`, `destino_tipo` e `destino_id`
- Fornecedor como Pool Black Box — zero Lane vazia
- Todos os gateways com `name="Sim"` / `name="Não"` nas saídas
- Loops modelados como Sequence Flow de retorno (sem End Event)
- Checkpoint detectou automaticamente `serviceTask` incorretos em ativ-01 e ativ-07
- `bpmn-layout.js` renderizou corretamente no bpmn.io

### Achados do Auditor (run 2026-05-16-000001)

- **ach-01** (Lean, Media): bloqueio aguardando 3 orçamentos — catálogo de preços para compras recorrentes
- **ach-02** (Lean, Media): confirmação de recebimento do PC manual — automatizar via portal/EDI
- **ach-03** (CBOK, Baixa): 5 atores internos gerando handoffs — avaliar unificação ou automação
- **ach-04** (ISO9001, Alta): Plano B encerra processo sem resolução — criar sub-fluxo de contingência
- **ach-05** (CBOK, Media): critérios subjetivos na análise da RC — check-list técnico obrigatório

### Run anterior: `output/2026-05-15-000002/v1/`

Run completa (AS-IS + Auditoria + TO-BE) executada antes das atualizações de prompt. Serviu como baseline. TO-BE desta run tem Fornecedor ainda como Lane vazia e nomes longos nos elementos.

## Arquitetura dos agentes (estado atual dos prompts)

### `01-elicitador.md` — ATUALIZADO nesta sessão

Campo `nome_bpmn` adicionado ao schema de saída para atividades, eventos e gateways. O agente gera o rótulo curto diretamente, seguindo:
- Atividades: Verbo Infinitivo + Objeto, máx 4 palavras
- Eventos start: estado que dispara, máx 4 palavras
- Eventos end: estado resultante, máx 3 palavras
- Gateways: pergunta com "?", máx 6 palavras

Campo `condicoes` dos gateways agora tem estrutura explícita:
```json
{ "label": "Sim", "descricao": "...", "destino_tipo": "atividade | evento_fim | loop", "destino_id": "ativ-XX" }
```
`destino_tipo: "loop"` → Modelador gera Sequence Flow de retorno, não End Event.

Regra de ator externo documentada: Fornecedor, cliente, banco = `"externo"` → Pool Black Box.

### `03-modelador.md` — ATUALIZADO nesta sessão

Regras adicionadas:
1. **Externo → Pool Black Box**: `tipo: "externo"` gera `<collaboration>` + `<participant isExecutable="false">` + `<messageFlow>`. Nunca Lane.
2. **Lane vazia proibida**: só cria lane se tiver `<flowNodeRef>`.
3. **`name=` usa `nome_bpmn`**: nunca o campo `descricao`.
4. **Gateway com Sim/Não obrigatório**: todos os `<sequenceFlow>` saindo de gateway têm `name="Sim"` ou `name="Não"`.
5. **Loop = Sequence Flow de retorno**: `destino_tipo: "loop"` → nunca End Event.

### `07-tobe.md` — REESCRITO nesta sessão

Era hardcoded para um processo específico antigo. Agora é genérico com as mesmas regras do Modelador (nomenclatura, Black Box, lanes vazias, Sim/Não nos gateways, loops).

### `04-checkpoint-bpmn.md` — ATUALIZADO nesta sessão

Agora tem validação automática obrigatória com 5 `grep` que bloqueiam avanço se:
- Qualquer `name=` tiver mais de 50 caracteres
- Qualquer gateway tiver saída sem `name=`
- Lane contiver "Fornecedor", "cliente" ou "transportadora"

### `08-checkpoint-tobe.md` — ATUALIZADO nesta sessão

Mesma validação automática adaptada para o TO-BE, incluindo verificação se achados de prioridade alta foram implementados.

## bpmn-layout.js — estado atual

Arquivo em `squads/escritorio-bpm-as-is/scripts/bpmn-layout.js`. Script Node.js sem dependências.

Uso:
```bash
node squads/escritorio-bpm-as-is/scripts/bpmn-layout.js <input.bpmn> <output.bpmn>
```

Algoritmo: regex parse → extração de lanes/nós/flows → Kahn topological sort → longest-path column assignment → BPMNShape + BPMNEdge → injeção no BPMNDiagram.

Constantes principais: `POOL_LABEL_W=30`, `LANE_LABEL_W=120`, `LANE_H=120`, `COL_W=180`, `ELEM_W=120`, `TASK_H=60`, `EVENT_W=36`, `GW_W=50`.

Limitação conhecida: back-edges (loops) são roteados abaixo das lanes (y=960), criando linhas longas. Não bloqueante para uso atual.

## Status das regras BPMN

Todas as regras abaixo foram validadas na run 2026-05-16-000001:

| Regra | Status |
|---|---|
| Externo como Pool Black Box (nunca Lane) | Validado |
| Gateway com Sim/Não nas saídas | Validado |
| Loops como Sequence Flow de retorno | Validado |
| `name=` usa `nome_bpmn` curto | Validado |
| Lane vazia proibida | Validado |
| Checkpoint detecta serviceTask incorreto | Validado |
| Message Flows para atores externos | Validado |

## Próxima ação recomendada

O pipeline AS-IS está estável. Para uma nova run, basta colocar a transcrição em `squads/escritorio-bpm-as-is/input/` e seguir os steps do pipeline.

O TO-BE é produzido manualmente pelo analista a partir do `diagnostico-as-is.json`.

## Regras de estilo invioláveis

- **Sem traços longos (em-dash, U+2014)**. Usar vírgulas ou reformular a frase.
- **Conteúdo grounded em experiência documentada**. NUNCA inventar métricas, projetos fictícios ou dados de clientes.
- **Português brasileiro** como padrão.
- **Tom direto e crítico**, com autoridade quando apropriado (ABPMP, OMG, BPM CBOK v4.0, BABOK v3).
- Evitar formatação excessiva. Prosa quando der.

## Confirmação esperada antes de qualquer ação

Antes de executar qualquer coisa ou delegar para o Gemini, responda em 5 a 8 linhas com sua interpretação do que leu, para o usuário validar que você entendeu sem alucinar. Se algo estiver ambíguo ou faltar contexto, pergunte. Não presuma.
