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

## Estado atual do projeto (2026-05-16 — sessão 2)

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

### bpmn-layout.js — correções aplicadas nesta sessão

**Bugs Bizagi corrigidos (3 bugs originais):**
- BPMNPlane agora referencia `collab_01` (colaboração), não o processo
- Pool shape usa ID real do participant (`part-empresa`)
- BPMNShape gerado para todos os pools externos (Fornecedor)

**Melhorias adicionais (análise CBOK/BPMN 2.0):**
- BPMNLabel gerado para arestas com nome (fix: labels "Sim"/"Não" apareciam em coordenada 0,0)
- Message Flow routing corrigido (fix: X do destino usava X da origem, setas iam para lugar errado)
- Validação de cross-pool: script avisa se sequenceFlow cruza fronteira de pool (violação BPMN 2.0)
- Suporte completo a Message Flows no diagrama DI

**Pendente — validação final no Bizagi:**
O arquivo atualizado ainda não foi importado e validado visualmente no Bizagi. Fazer na próxima sessão.

### Próxima ação: instalar Hermes localmente

Antes de subir para VPS, o fluxo completo será validado local.

Checklist de instalação (status):

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

**Fase 5 — Correção Bizagi**
- [x] Corrigir os 3 bugs no `bpmn-layout.js`
- [ ] Validar import no Bizagi (pendente — fazer na próxima sessão)

**Fase 6 — Teste ponta a ponta (local)**
- [ ] Atualizar API keys no `.hermes/.env` para as chaves novas
- [ ] Gravar reunião simulada, enviar pelo Telegram, receber BPMN

**Fase 7 — Subir para VPS**
- [ ] Somente após fase 6 validada

### Débitos técnicos identificados (análise CBOK 4.0)

Pontos levantados pela análise do diagrama — corrigir nos agentes na próxima sessão:

| Agente | Melhoria pendente |
|---|---|
| 01-elicitador | Classificar tipo de tarefa: userTask, serviceTask, scriptTask |
| 03-modelador | Regra explícita: ator externo = messageFlow obrigatório, nunca sequenceFlow |
| 04-checkpoint-bpmn | Validação topológica: cross-pool, dead ends, labels ausentes em todas saídas de gateway |
| 05-auditor | Validar estados finais semanticamente (ex: "Plano B acionado" não é end state válido) |

## Arquitetura dos agentes (estado atual dos prompts)

### `01-elicitador.md`

Campo `nome_bpmn` gerado diretamente pelo agente:
- Atividades: Verbo Infinitivo + Objeto, máx 4 palavras
- Eventos start: estado que dispara, máx 4 palavras
- Eventos end: estado resultante, máx 3 palavras
- Gateways: pergunta com "?", máx 6 palavras

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
5. Loop = Sequence Flow de retorno, nunca End Event

### `07-tobe.md`

Reescrito genérico com as mesmas regras do Modelador.

### `04-checkpoint-bpmn.md`

Validação automática com grep bloqueia se:
- `name=` com mais de 50 caracteres
- Gateway com saída sem `name=`
- Lane com nome de ator externo (Fornecedor, cliente, transportadora)

### `08-checkpoint-tobe.md`

Mesma validação do checkpoint BPMN adaptada para TO-BE, incluindo verificação de achados de prioridade alta.

## bpmn-layout.js

Arquivo: `squads/escritorio-bpm-as-is/scripts/bpmn-layout.js`

```bash
node squads/escritorio-bpm-as-is/scripts/bpmn-layout.js <input.bpmn> <output.bpmn>
```

Algoritmo: regex parse, extração de lanes/nós/flows, Kahn topological sort, longest-path column assignment, BPMNShape + BPMNEdge, injeção no BPMNDiagram.

Constantes: `POOL_LABEL_W=30`, `LANE_LABEL_W=120`, `LANE_H=120`, `COL_W=180`, `ELEM_W=120`, `TASK_H=60`, `EVENT_W=36`, `GW_W=50`.

Limitação conhecida: back-edges (loops) roteados abaixo das lanes (y=960). Não bloqueante.

Pendência: corrigir os 3 bugs de compatibilidade com Bizagi descritos acima.

## Status das regras BPMN

| Regra | Status |
|---|---|
| Externo como Pool Black Box (nunca Lane) | Validado |
| Gateway com Sim/Não nas saídas | Validado |
| Loops como Sequence Flow de retorno | Validado |
| `name=` usa `nome_bpmn` curto | Validado |
| Lane vazia proibida | Validado |
| Checkpoint detecta serviceTask incorreto | Validado |
| Message Flows para atores externos | Validado |
| BPMNPlane referencia collaboration | Pendente (bug Bizagi) |
| Pool shape com ID correto | Pendente (bug Bizagi) |
| BPMNShape para Pool Fornecedor | Pendente (bug Bizagi) |

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
