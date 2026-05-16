# Handoff Document — Escritório de BPM

## Papel do Claude nesta sessão

Depende do ambiente em que está rodando:

**Claude Code (VSCode):** cérebro estratégico e executor direto. Tem acesso ao terminal via bash, lê e edita arquivos, roda scripts. Não precisa delegar para o Gemini.

**Claude no Antigravity:** somente cérebro estratégico. Sem acesso ao terminal. Entrega instruções prontas para o Gemini executar.

**Gemini Flash (Antigravity):** construtor executor quando o Claude está no Antigravity. Preferido para execução de tarefas longas porque tem janela de contexto generosa e custo baixo por token. O usuário usa o Gemini Pro, mas opera com o Flash para economizar contexto.

Regra de ouro no Antigravity: **quando uma ação precisar acontecer no sistema, entregue a instrução pronta para o Gemini. Não finja execução.**

No Claude Code: execute diretamente sem intermediários.

## Sobre o usuário

Dos Santos, profissional brasileiro com 12 anos em análise de processos, implantação de ERP, BI e automação. Cursa MBA Executivo em BPM na Unyleya (abril a novembro de 2026). Reside em Canoas e Sapucaia do Sul, RS. Comunicação em português brasileiro.

## O que estamos construindo

Um **Escritório de Processos agêntico** que automatiza consultoria BPM ponta a ponta. O objetivo final: o analista grava a reunião de mapeamento no Telegram, o sistema transcreve, elicita, modela e entrega um BPMN AS-IS versionado pronto para importar no Bizagi.

### Visão do sistema completo

```
Reunião de mapeamento (áudio via Telegram)
    │
    ▼
Hermes Agent — pré-reunião
  Faz perguntas de contexto: processo, empresa, sistemas, siglas
  Salva contexto-reuniao.json
    │
    ▼
Hermes Agent — transcrição
  Recebe áudio, chama Whisper API com vocabulário de contexto
  Salva transcricao.txt
    │
    ▼
Hermes Agent — revisão
  Analisa a transcrição, pergunta sobre trechos ambíguos via Telegram
  Consolida transcrição final
    │
    ▼
opensquad pipeline (AS-IS)
  01-elicitador   → elicitacao.json
  02-checkpoint
  03-modelador    → processo-as-is.bpmn
  bpmn-layout.js  → processo-as-is-layout.bpmn
  04-checkpoint
  05-auditor      → diagnostico-as-is.json
  06-checkpoint
    │
    ▼
Hermes notifica via Telegram — BPMN pronto
Git versiona os outputs por run
```

O TO-BE é produzido manualmente a partir do diagnóstico. Não faz parte do pipeline automatizado.

### Stack

- **Pipeline BPM**: opensquad (file-based, serial)
- **Intake de áudio e Telegram**: Hermes Agent
- **Orquestração de times** (fase futura, quando houver múltiplos analistas): Paperclip
- **IDE host**: Antigravity ou Claude Code (VSCode)
- **Pasta do projeto**: `C:\Users\Claiton\Documents\Escritorio-de-BPM`
- **Repositório**: GitHub (branch main)
- **Node**: v24.13.1
- **Python**: 3.14.3
- **Implantação**: local primeiro, VPS após pipeline validado

## Estado atual do projeto (2026-05-16 — sessão 3)

### Pipeline AS-IS — estável

Run de validação `output/2026-05-16-000001/v1/` com transcrição Camila Evers (Processo de Compras):

```
✅ Step 01 — Elicitador       → elicitacao.json (14 ativ, 7 gw, 6 atores, 1 ERP)
✅ Step 02 — Checkpoint       → aprovado
✅ Step 03 — Modelador        → processo-as-is.bpmn
✅ bpmn-layout.js             → processo-as-is-layout.bpmn
✅ Step 04 — Checkpoint BPMN  → aprovado (2 correções automáticas)
✅ Step 05 — Auditor          → diagnostico-as-is.json (5 achados)
✅ Step 06 — Checkpoint Audit → aprovado
```

### Hermes — instalado e configurado (Fases 1 a 4 concluídas)

```
✅ Fase 1 — ffmpeg v8.1.1 instalado, PATH fixo, variáveis de ambiente setadas
✅ Fase 2 — Hermes v0.13.0 instalado, provider Anthropic configurado
✅ Fase 3 — Gateway Telegram ativo (estado: connected)
✅ Fase 4 — 4 skills BPM instaladas em ~/.hermes/skills/local/
```

Skills criadas em `skills/` (fonte canônica, versionada no git):
- `bpm-pre-reuniao` — coleta contexto antes da reunião
- `bpm-transcricao` — Whisper com vocabulário de contexto
- `bpm-revisao` — clarificação pós-transcrição
- `bpm-pipeline` — dispara opensquad e notifica

Script `install-skills.bat` na raiz: copia de `skills/` para `~/.hermes/skills/local/`.

**Atenção:** API keys no `.hermes/.env` são as antigas (revogadas). Atualizar antes da Fase 6.

### bpmn-layout.js — histórico de correções

**Sessão 2 — Bugs Bizagi (3 bugs originais):**
- BPMNPlane agora referencia `collab_01` (colaboração), não o processo
- Pool shape usa ID real do participant (`part-empresa`)
- BPMNShape gerado para todos os pools externos (Fornecedor)

**Sessão 2 — Melhorias CBOK/BPMN 2.0:**
- BPMNLabel gerado para arestas com nome (fix: labels "Sim"/"Não" apareciam em coordenada 0,0)
- Message Flow routing corrigido (fix: X do destino usava X da origem)
- Validação de cross-pool: script avisa se sequenceFlow cruza fronteira de pool
- Suporte completo a Message Flows no diagrama DI

**Sessão 3 — Ajustes visuais e semânticos:**
- Pool principal engloba calha de back-edges: `poolH = totalLanesH + BACK_MARGIN * 2` quando há loops. Setas de retorno deixam de ficar no "limbo" entre as piscinas.
- BPMNLabel reposicionado por segmento central da aresta: horizontal empurra label para cima (y - 22), vertical empurra para a direita (x + 6). Labels "Sim"/"Não" não sobrepõem mais a linha.
- Message Flow ortogonal: detecta se extremidade é Pool inteiro (w === totalW) e alinha verticalmente, eliminando diagonais que cruzavam o diagrama. Nó a nó usa cotovelo em L.

**Pendente — validação final no Bizagi:**
O arquivo ainda não foi importado e validado visualmente no Bizagi. Fazer na próxima sessão.

### Agentes — melhorias aplicadas na sessão 3

**`01-elicitador.md`:**
- Campo `task_type` adicionado ao schema de atividades (`"userTask" | "serviceTask" | "scriptTask"`)
- Seção de classificação de tipo de tarefa com regras baseadas em `ator_responsavel` e `sistema`

**`03-modelador.md`:**
- Proibição de sequenceFlow cross-pool reforçada com exemplo de erro a evitar
- Regra de convergência implícita: gateway divergente exige gateway convergente antes da próxima tarefa comum
- Tipagem de tarefa baseada no campo `task_type` do JSON (tabela com 3 tipos)
- Atividade terminal sem saída definida obriga geração imediata de `<endEvent>`
- Loop sem limite de tentativas gera comentário XML sinalizando para o auditor

**`04-checkpoint-bpmn.md`:**
- Verificação 1f: grep detecta sequenceFlow cujo sourceRef ou targetRef aponta para participant
- Verificação 1g: grep detecta targetRef duplicados (convergência implícita)
- Total de verificações: 7 (era 5)

### Checklist de fases

**Fase 1 — Pré-requisitos**
- [x] Instalar ffmpeg via winget
- [x] Configurar API keys (Anthropic + OpenAI) — atualizar para as chaves novas antes do teste

**Fase 2 — Hermes**
- [x] `pip install hermes-agent` (v0.13.0)
- [x] Configurar provider e API key
- [x] Confirmar funcionamento (hermes chat retornou erro de saldo, não de autenticação)

**Fase 3 — Gateway Telegram**
- [x] Bot criado no BotFather
- [x] Gateway configurado e ativo
- [x] Texto e voz testados com sucesso

**Fase 4 — Skills BPM**
- [x] Skill `bpm-pre-reuniao`: coleta contexto antes da reunião
- [x] Skill `bpm-transcricao`: Whisper com vocabulário de contexto
- [x] Skill `bpm-revisao`: perguntas de clarificação pós-transcrição
- [x] Skill `bpm-pipeline`: dispara opensquad e notifica quando pronto

**Fase 5 — Validação Bizagi**
- [x] Corrigir bugs de compatibilidade no `bpmn-layout.js` (concluído em sessões 2 e 3)
- [ ] Validar import no Bizagi (pendente — próxima sessão)

**Fase 6 — Teste ponta a ponta (local)**
- [ ] Atualizar API keys no `.hermes/.env` para as chaves novas
- [ ] Gravar reunião simulada, enviar pelo Telegram, receber BPMN

**Fase 7 — Subir para VPS**
- [ ] Somente após fase 6 validada

### Débitos técnicos restantes

| Agente | Status |
|---|---|
| 01-elicitador — campo `task_type` | Concluído (sessão 3) |
| 03-modelador — messageFlow obrigatório para externos | Concluído (sessão 3) |
| 03-modelador — convergência implícita proibida | Concluído (sessão 3) |
| 03-modelador — atividade terminal gera endEvent | Concluído (sessão 3) |
| 04-checkpoint-bpmn — detecção cross-pool e convergência | Concluído (sessão 3) |
| 05-auditor — validar estados finais semanticamente | Pendente |
| Rodar novo pipeline com agentes corrigidos e validar no Bizagi | Pendente |

## Arquitetura dos agentes (estado atual dos prompts)

### `01-elicitador.md`

Campo `nome_bpmn` gerado diretamente pelo agente:
- Atividades: Verbo Infinitivo + Objeto, máx 4 palavras
- Eventos start: estado que dispara, máx 4 palavras
- Eventos end: estado resultante, máx 3 palavras
- Gateways: pergunta com "?", máx 6 palavras

Campo `task_type` obrigatório em atividades: `"userTask" | "serviceTask" | "scriptTask"`. Regra: humano sem sistema = userTask; sistema executa ou medeia = serviceTask; dúvida = userTask.

Campo `condicoes` com estrutura explícita:
```json
{ "label": "Sim", "descricao": "...", "destino_tipo": "atividade | evento_fim | loop", "destino_id": "ativ-XX" }
```
`destino_tipo: "loop"` gera Sequence Flow de retorno, nunca End Event.

Ator externo: `"tipo": "externo"` gera Pool Black Box. Nunca Lane.

### `03-modelador.md`

1. Externo → Pool Black Box com `<collaboration>` + `<messageFlow>`
2. Lane vazia proibida
3. `name=` usa `nome_bpmn`, nunca `descricao`
4. Todas as saídas de gateway têm `name="Sim"` ou `name="Não"`
5. Loop = Sequence Flow de retorno, nunca End Event; loops sem limite geram comentário XML
6. Sequência Flow nunca cruza fronteira de Pool — sempre messageFlow
7. Gateway divergente exige gateway convergente antes da próxima tarefa comum (proíbe convergência implícita)
8. Atividade terminal sem saída definida recebe `<endEvent>` imediato
9. Tag de tarefa determinada pelo campo `task_type` do JSON

### `07-tobe.md`

Reescrito genérico com as mesmas regras do Modelador.

### `04-checkpoint-bpmn.md`

Validação automática com grep bloqueia se (7 verificações):
- 1a. Lane sem flowNodeRef
- 1b. `name=` com mais de 50 caracteres
- 1c. Lane vazia
- 1d. Gateway com saída sem `name=`
- 1e. Ator externo modelado como Lane
- 1f. sequenceFlow cujo sourceRef ou targetRef aponta para participant (cross-pool)
- 1g. targetRef duplicados em sequenceFlows (convergência implícita — inspeção manual)

### `08-checkpoint-tobe.md`

Mesma validação do checkpoint BPMN adaptada para TO-BE, incluindo verificação de achados de prioridade alta.

## bpmn-layout.js

Arquivo: `squads/escritorio-bpm-as-is/scripts/bpmn-layout.js`

```bash
node squads/escritorio-bpm-as-is/scripts/bpmn-layout.js <input.bpmn> <output.bpmn>
```

Algoritmo: regex parse, extração de lanes/nós/flows, Kahn topological sort, longest-path column assignment, BPMNShape + BPMNEdge, injeção no BPMNDiagram.

Constantes: `POOL_LABEL_W=30`, `LANE_LABEL_W=120`, `LANE_H=120`, `COL_W=180`, `ELEM_W=120`, `TASK_H=60`, `EVENT_W=36`, `GW_W=50`, `BACK_MARGIN=40`.

Pool height: `poolH = backEdgeSet.size > 0 ? totalLanesH + BACK_MARGIN * 2 : totalLanesH`. Pools externos começam em `poolH + 20`.

Message Flow routing: detecta se extremidade é Pool (w === totalW) e usa waypoints verticais alinhados. Nó a nó usa cotovelo em L com midY.

BPMNLabel: usa segmento central da aresta. Horizontal: y - 22. Vertical: x + 6.

Limitação conhecida: 23 colunas no diagrama atual refletem o modelo linear do processo de compras — esperado.

## Status das regras BPMN

| Regra | Status |
|---|---|
| Externo como Pool Black Box (nunca Lane) | Validado |
| Gateway com Sim/Não nas saídas | Validado |
| Loops como Sequence Flow de retorno | Validado |
| `name=` usa `nome_bpmn` curto | Validado |
| Lane vazia proibida | Validado |
| Tipagem de tarefa via campo `task_type` | Validado (sessão 3) |
| Message Flows para atores externos | Validado |
| sequenceFlow proibido crossing pool | Validado (sessão 3) |
| Convergência implícita proibida | Validado (sessão 3) |
| Atividade terminal gera endEvent | Validado (sessão 3) |
| BPMNPlane referencia collaboration | Validado (sessão 2) |
| Pool shape com ID correto | Validado (sessão 2) |
| BPMNShape para Pool Fornecedor | Validado (sessão 2) |
| Pool engloba calha de back-edges | Validado (sessão 3) |
| Message Flow ortogonal sem diagonais | Validado (sessão 3) |
| BPMNLabel sem sobreposição na linha | Validado (sessão 3) |
| Validar import visual no Bizagi | Pendente |

## Achados do Auditor (run 2026-05-16-000001)

- **ach-01** (Lean, Media): bloqueio aguardando 3 orçamentos — catálogo de preços para compras recorrentes
- **ach-02** (Lean, Media): confirmação de recebimento do PC manual — automatizar via portal/EDI
- **ach-03** (CBOK, Baixa): 5 atores internos gerando handoffs — avaliar unificação ou automação
- **ach-04** (ISO9001, Alta): Plano B encerra processo sem resolução — criar sub-fluxo de contingência
- **ach-05** (CBOK, Media): critérios subjetivos na análise da RC — check-list técnico obrigatório

## Regras de estilo invioláveis

- Sem traços longos (em-dash, U+2014). Usar vírgulas ou reformular.
- Conteúdo grounded em experiência documentada. NUNCA inventar métricas ou dados de clientes.
- Português brasileiro.
- Tom direto e crítico, com autoridade (ABPMP, OMG, BPM CBOK v4.0, BABOK v3).
- Evitar formatação excessiva. Prosa quando der.

## Confirmação esperada antes de qualquer ação

Antes de executar ou delegar, responda em 5 a 8 linhas com sua interpretação do que leu, para o usuário validar. Se algo estiver ambíguo, pergunte. Não presuma.
