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

### Run concluída: `output/2026-05-15-000002/v1/`

Pipeline completo executado com transcrição real (Camila Evers, YouTube — Processo de Compras):

```
✅ Step 01 — Elicitador       → elicitacao.json (14 ativ, 7 gw, 6 atores, 1 ERP)
✅ Step 02 — Checkpoint       → aprovado
✅ Step 03 — Modelador        → processo-as-is.bpmn
✅ bpmn-layout.js             → processo-as-is-layout.bpmn
✅ Step 04 — Checkpoint BPMN  → aprovado (com correções manuais de nomenclatura)
✅ Step 05 — Auditor          → diagnostico-as-is.json (9 achados: 4 alta, 3 média, 2 baixa)
✅ Step 06 — Checkpoint Audit → aprovado
✅ Step 07 — TO-BE Designer   → processo-tobe.bpmn
✅ bpmn-layout.js             → processo-tobe-layout.bpmn
✅ Step 08 — Checkpoint TO-BE → aprovado (com correções manuais de nomenclatura)
```

### Principais achados do Auditor (run 2026-05-15-000002)

- **ach-01** (Lean, Alta): confirmação do PC passiva — risco de pedido nunca chegar ao fornecedor
- **ach-02** (CBOK, Alta): loop gw-03 sem limite de iterações — risco de ciclo infinito
- **ach-03** (ISO9001, Alta): ativ-12 sem gateway de conformidade — NF pode ser lançada com mercadoria errada
- **ach-05** (CBOK, Alta): rn-02 sem controle sistêmico — prazo de pagamento pode violar regra de fluxo de caixa
- Demais: follow-up manual, rastreabilidade de cotações, SLA handoff Almoxarifado→Financeiro

### Melhorias implementadas no TO-BE

- gw-03b: limite de 2 ciclos de cotação antes de escalar
- ativ-05b: mapa comparativo de cotações obrigatório
- gw-07b: validação sistêmica da regra de condição de pagamento (rn-02)
- gw-08 + ativ-12b: gateway de conformidade no recebimento + devolução formal
- ativ-11: follow-up convertido para serviceTask (monitoramento automático via ERP)
- ativ-13: lançamento de NF com SLA D+1

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

## Problema em aberto: Fornecedor como Pool Black Box

As regras foram escritas nos prompts (01-elicitador, 03-modelador, 07-tobe) mas **ainda não foram testadas em uma run completa**. A run 2026-05-15-000002 foi gerada com as regras antigas — o Fornecedor ainda apareceu como Lane vazia.

A próxima run irá validar se os agentes seguem as regras automaticamente. Se não seguirem, a estratégia é reforçar os greps do checkpoint para bloquear e forçar correção antes de avançar.

## Problema em aberto: erros BPMN 2.0 estruturais (identificados por análise comparativa)

Análise comparando o diagrama gerado com referência de mercado identificou:
1. Externo como Lane (resolvido nos prompts, não testado ainda)
2. Gateway sem rótulos Sim/Não nas saídas (resolvido nos prompts)
3. Loops terminando em End Event ao invés de retornar (resolvido nos prompts)
4. Message Flows ausentes para interações com externos (regra adicionada ao Modelador)
5. Checkpoints agora têm greps automáticos para detectar esses problemas antes de avançar

## Próxima ação recomendada

**Testar o pipeline completo com uma nova transcrição** para validar todas as mudanças desta sessão:
1. Elicitador gera `nome_bpmn` e `condicoes` estruturadas
2. Modelador produz Fornecedor como Pool Black Box (não Lane)
3. Gateways têm Sim/Não nos fluxos de saída
4. Checkpoints detectam e bloqueiam erros automaticamente sem intervenção manual

Input sugerido: qualquer transcrição nova em `squads/escritorio-bpm-as-is/input/`.

## Regras de estilo invioláveis

- **Sem traços longos (em-dash, U+2014)**. Usar vírgulas ou reformular a frase.
- **Conteúdo grounded em experiência documentada**. NUNCA inventar métricas, projetos fictícios ou dados de clientes.
- **Português brasileiro** como padrão.
- **Tom direto e crítico**, com autoridade quando apropriado (ABPMP, OMG, BPM CBOK v4.0, BABOK v3).
- Evitar formatação excessiva. Prosa quando der.

## Confirmação esperada antes de qualquer ação

Antes de executar qualquer coisa ou delegar para o Gemini, responda em 5 a 8 linhas com sua interpretação do que leu, para o usuário validar que você entendeu sem alucinar. Se algo estiver ambíguo ou faltar contexto, pergunte. Não presuma.
