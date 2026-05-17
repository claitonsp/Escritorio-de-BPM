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

## Estado atual do projeto (2026-05-16 — sessão 6)

### Pipeline AS-IS — estável e validado com segundo processo

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

Run de validação `output/2026-05-16-000003/v1/` com processo de texto (Conciliação e Baixa de Títulos):

```
✅ Step 01 — Elicitador       → elicitacao.json (5 ativ, 2 gw, 3 eventos, 1 ator externo)
✅ Step 03 — Modelador        → processo-as-is.bpmn (collaboration + messageFlow + timer)
✅ bpmn-layout.js             → processo-as-is-layout.bpmn
✅ Step 04 — Checkpoint BPMN  → 8/8 aprovadas
✅ Validado no bpmn.io        → Message Start Event, lanes, timer, loop intra-lane confirmados
```

Run de validação `output/2026-05-16-000004/v1/` — sessão 6 (Conciliação e Baixa de Títulos, refatorado):

```
✅ Step 01 — Elicitador       → elicitacao.json (5 ativ, 2 gw, 3 eventos, 1 ator externo)
✅ Step 03 — Modelador        → processo-as-is.bpmn (estrutura corrigida: timer antes do gw-02)
✅ bpmn-layout.js             → processo-as-is-layout.bpmn (port-aware routing, 9 colunas)
✅ Step 04 — Checkpoint BPMN  → 9/9 aprovadas
✅ Step 05 — Auditor          → diagnostico-as-is.json (14 achados: CBOK, Lean, ISO 9001)
⏳ Step 06 — Checkpoint Audit → pendente
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

**Problema identificado na sessão 6:** A skill `bpm-pipeline` chama `npx opensquad run escritorio-bpm-as-is`, mas esse comando não existe (registrado no spike 2). O pipeline hoje é executado pelo Claude Code via bash e scripts individuais. A skill precisa ser reescrita para refletir o fluxo real antes do teste ponta a ponta.

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

**Sessão 4 — Correções estruturais no layout engine:**
- `nodeTagRe` atualizado para aceitar namespace prefix opcional `(?:[\w-]+:)?` — suporte a BPMNs de Camunda e outras ferramentas.
- Loop intra-lane roteado pelo teto da própria raia (`localLoopY = laneY[srcLane] + 15`) em vez de descer até `backEdgeY`. Loop cross-lane continua usando calha inferior.
- `elemSize` corrigido para case-insensitive com `type.toLowerCase()` — `intermediateCatchEvent` agora retorna 36×36 corretamente (bug: comparação `'IntermediateCatch'` falhava contra string lowercase).

**Sessão 5 — Melhorias no layout engine e no checkpoint:**

*bpmn-layout.js — 3 correções de roteamento:*

1. **Back-edge cross-lane subindo**: 3º caso adicionado — loop que retorna a lane superior passa pelo teto da lane de destino (`laneY[tgtLane] + 15`) em vez de descer até a calha inferior. Antes: todos os loops cross-lane iam para o fundo independente da direção.

2. **Back-edge intra-lane com elemento próximo ao teto da lane** (fix): Quando `laneY + 15` é maior que `min(src.y, tgt.y)`, o segmento horizontal do loop passava dentro da caixa do elemento destino. Correção: `localLoopY` agora é calculado dinamicamente — se o padrão (15px) estiver abaixo do topo dos elementos, sobe para `max(laneY + 3, minTopY - 5)`. Exemplo: timer em col 6 devolvendo para Acionar Cliente em col 4 (ambos row 0, tgt.y=10) → localLoopY era 15 (dentro da caixa), agora é 5 (acima da caixa).

3. **MessageFlow nó → Pool com obstáculo abaixo** (fix): Quando dois nós estão na mesma coluna (rows 0 e 1) e o nó do row 0 tem um MessageFlow descendo para um pool externo, a linha vertical passava literalmente por cima do nó do row 1. Correção: detecta colisão verificando se algum elemento em `bounds` sobrepõe o trecho vertical em `srcMidX`. Se sim, desvia pela esquerda: `(srcMidX, startY) → (src.x - 5, startY) → (src.x - 5, endY)`. Exemplo: Acionar Cliente (col 4, row 0) tem MessageFlow que passava sobre Baixar Título via Sistema (col 4, row 1) — agora desvia pela esquerda da coluna.

*04-checkpoint-bpmn.md:*
- Verificação 1i adicionada: detecta task zumbi (userTask/serviceTask/scriptTask sem `sourceRef` em nenhum `sequenceFlow`). Token preso = processo que nunca sai da tarefa. Usa node em vez de grep por ser mais robusto no Windows.
- Total de verificações: 9 (era 8).
- Nota sobre 1i adicionada: atividade terminal em particípio passado deve ser `<endEvent>`, não task.

*Substituição do algoritmo de ordenação (Kahn → DFS iterativo):*
- **Bug raiz:** O algoritmo de Kahn não consegue ordenar nós em ciclos. Quando existe um loop de negócio (ex: Acionar Cliente → Gateway → Acionar Cliente), os nós do ciclo nunca chegam a inDeg=0 e são despejados no `topoOrder` em ordem arbitrária (inserção no XML). Isso fazia o longest-path colocar nós como "Baixar Título" na coluna 0 em vez do final, gerando setas que rasgavam o diagrama da direita para a esquerda.
- **Correção:** Bloco 4 substituído por DFS iterativo com pilha explícita. Estado por nó: 0=não visitado, 1=na pilha atual, 2=concluído. Quando `state[v] === 1`, a aresta é marcada como back-edge (ciclo confirmado). Pós-ordem invertida = ordem topológica válida para o longest-path.
- **Melhoria adicional:** `adj` agora armazena `{target, flowId}` em vez de apenas `target`, permitindo o longest-path iterar sobre `adj` em O(V+E) em vez de O(V×E).
- **Sem risco de stack overflow:** DFS iterativo com pilha explícita — sem limite de recursão do Node.js.

**Sessão 6 — Refatoração de roteamento (port-aware routing):**

1. **COL_PAD aumentado de 20 para 40**: dá mais fôlego lateral às setas, reduz auto-rerouting dos renderizadores.

2. **Loop intra-lane com detecção de row**: se o nó origem está em Row 1 (metade inferior da lane), o back-edge usa o PISO (`laneY + laneH - 15`), não o teto. Se está em Row 0, usa o TETO (`laneY + 15`). Antes: todos os loops sempre iam pelo teto, causando cruzamentos em lanes com 2 rows.

3. **SequenceFlow port-aware**: elimina S-Shape via COL_PAD/2. Novo critério por porta natural:
   - Mesmo Y (< 10px) → saída direita, entrada esquerda (horizontal direto)
   - Origem acima do destino → saída pelo fundo, L descendo via srcMidX, entrada esquerda
   - Origem abaixo do destino → saída pelo topo, L subindo via srcMidX, entrada esquerda

4. **Correção estrutural no BPMN (03-modelador.md regra 5)**: o timer de controle de loop deve ser um passo sequencial ANTES do gateway de decisão, não uma branch do "Não". Padrão correto: `[atividade] → [timer] → [gateway] → Sim: avança / Não: back-edge para [atividade]`. O prompt foi reescrito com template XML completo e seção de erro crítico a evitar.

5. **Constantes atuais**: `TOP_GUTTER=30`, `BOTTOM_GUTTER=30`, `ROW_PAD=20`, `COL_PAD=40`, `COL_W=180`, `LANE_H=120`, `ELEM_W=120`, `TASK_H=60`, `EVENT_W=36`, `GW_W=50`, `BACK_MARGIN=40`.

**Pendente — validação final no Bizagi:**
Validado no bpmn.io (sessão 4). Import no Bizagi ainda pendente.

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

### Agentes — melhorias aplicadas na sessão 4

**`01-elicitador.md`:**
- Regra de unicidade de nomes: atividades com mesmo conceito mas `ator_responsavel` ou `task_type` distintos obrigam nomes diferentes. Exemplo: `"Baixar Título via Sistema"` vs `"Baixar Título Manual"`.

**`03-modelador.md`:**
- Regra 5 reescrita: loop sem controle não gera mais comentário XML — gera `<intermediateCatchEvent>` com `<timerEventDefinition>PT24H</timerEventDefinition>` obrigatório entre o gateway e a atividade de retorno. Template XML completo incluído no prompt.

**`04-checkpoint-bpmn.md`:**
- Verificação 1h adicionada: detecta back-edge direto de gateway para atividade sem timer intermediário.
- Nota cruzada 1g × 1h: `targetRef` duplicado em 1g é loop intencional quando o segundo sourceRef é `intermediateCatchEvent`.
- Total de verificações: 8 (era 7)

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
- [x] Corrigir bugs de compatibilidade no `bpmn-layout.js` (concluído em sessões 2, 3, 4 e 6)
- [x] Validar no bpmn.io (sessão 4 — Message Start Event, lanes, timer, loop confirmados)
- [ ] Validar import no Bizagi (pendente)

**Fase 6 — Teste ponta a ponta (local)**
- [ ] Atualizar API keys no `.hermes/.env` (Anthropic + OpenAI — as atuais estão revogadas)
- [ ] Reescrever skill `bpm-pipeline`: substituir `npx opensquad run` pelo fluxo real via Claude Code
- [ ] Gravar reunião simulada, enviar pelo Telegram, receber BPMN

**Fase 7 — Subir para VPS**
- [ ] Somente após fase 6 validada

### Débitos técnicos restantes

| Agente | Status |
|---|---|
| 01-elicitador — campo `task_type` | Concluído (sessão 3) |
| 01-elicitador — unicidade de nomes por ator/task_type | Concluído (sessão 4) |
| 03-modelador — messageFlow obrigatório para externos | Concluído (sessão 3) |
| 03-modelador — convergência implícita proibida | Concluído (sessão 3) |
| 03-modelador — atividade terminal gera endEvent | Concluído (sessão 3) |
| 03-modelador — loop gera timer (PT24H) em vez de comentário | Concluído (sessão 4) |
| 04-checkpoint-bpmn — detecção cross-pool e convergência | Concluído (sessão 3) |
| 04-checkpoint-bpmn — detecção loop sem controle (1h) | Concluído (sessão 4) |
| 04-checkpoint-bpmn — detecção task zumbi sem saída (1i) | Concluído (sessão 5) |
| bpmn-layout.js — namespace prefix, loop intra-lane, elemSize | Concluído (sessão 4) |
| bpmn-layout.js — Kahn substituído por DFS iterativo (ciclos em loops de negócio) | Concluído (sessão 5) |
| bpmn-layout.js — back-edge subindo roteia pelo teto da lane destino | Concluído (sessão 5) |
| bpmn-layout.js — localLoopY dinâmico: evita atravessar caixa quando row=0 próximo ao teto | Concluído (sessão 5) |
| bpmn-layout.js — MessageFlow nó→Pool detecta obstáculo abaixo e desvia pela esquerda | Concluído (sessão 5) |
| 04-checkpoint-bpmn — verificação 1i: task zumbi sem sequenceFlow de saída | Concluído (sessão 5) |
| 05-auditor — validar estados finais semanticamente | Pendente |
| Validar import no Bizagi | Pendente |
| bpmn-layout.js — port-aware routing (fundo/topo por posição do nó) | Concluído (sessão 6) |
| bpmn-layout.js — COL_PAD aumentado para 40 (fôlego para renderizadores) | Concluído (sessão 6) |
| 03-modelador.md — regra 5 corrigida: timer antes do gateway, não na branch "Não" | Concluído (sessão 6) |
| run 2026-05-16-000004 — steps 01-05 concluídos, step 06 pendente | Pendente |
| skill bpm-pipeline — reescrever para o fluxo real (sem npx opensquad run) | Pendente |
| Hermes — atualizar API keys no .hermes/.env (Anthropic + OpenAI) | Pendente |
| Fase 6 — teste ponta a ponta (Telegram → transcrição → BPMN) | Pendente |

## Arquitetura dos agentes (estado atual dos prompts)

### `01-elicitador.md`

Campo `nome_bpmn` gerado diretamente pelo agente:
- Atividades: Verbo Infinitivo + Objeto, máx 4 palavras
- Eventos start: estado que dispara, máx 4 palavras
- Eventos end: estado resultante, máx 3 palavras
- Gateways: pergunta com "?", máx 6 palavras

Campo `task_type` obrigatório em atividades: `"userTask" | "serviceTask" | "scriptTask"`. Regra: humano sem sistema = userTask; sistema executa ou medeia = serviceTask; dúvida = userTask.

Unicidade de nomes: duas atividades com mesmo conceito mas `ator_responsavel` ou `task_type` distintos obrigam nomes diferentes. Exemplo: `"Baixar Título via Sistema"` (serviceTask) vs `"Baixar Título Manual"` (userTask).

Campo `condicoes` com estrutura explícita:
```json
{ "label": "Sim", "descricao": "...", "destino_tipo": "atividade | evento_fim | loop", "destino_id": "ativ-XX" }
```
`destino_tipo: "loop"` gera Sequence Flow de retorno + timer intermediário, nunca End Event.

Ator externo: `"tipo": "externo"` gera Pool Black Box. Nunca Lane.

### `03-modelador.md`

1. Externo → Pool Black Box com `<collaboration>` + `<messageFlow>`
2. Lane vazia proibida
3. `name=` usa `nome_bpmn`, nunca `descricao`
4. Todas as saídas de gateway têm `name="Sim"` ou `name="Não"`
5. Loop = Sequence Flow de retorno com `<intermediateCatchEvent timerEventDefinition PT24H>` obrigatório antes da atividade de destino. Nunca End Event, nunca apenas comentário XML.
6. Sequência Flow nunca cruza fronteira de Pool — sempre messageFlow
7. Gateway divergente exige gateway convergente antes da próxima tarefa comum (proíbe convergência implícita)
8. Atividade terminal sem saída definida recebe `<endEvent>` imediato
9. Tag de tarefa determinada pelo campo `task_type` do JSON

### `07-tobe.md`

Reescrito genérico com as mesmas regras do Modelador.

### `04-checkpoint-bpmn.md`

Validação automática com grep bloqueia se (9 verificações):
- 1a. Lane sem flowNodeRef
- 1b. `name=` com mais de 50 caracteres
- 1c. Lane vazia
- 1d. Gateway com saída sem `name=`
- 1e. Ator externo modelado como Lane
- 1f. sequenceFlow cujo sourceRef ou targetRef aponta para participant (cross-pool)
- 1g. targetRef duplicados em sequenceFlows (convergência implícita — inspeção manual; cruzar com 1h)
- 1h. Loop sem controle — back-edge direto de gateway para atividade sem timer intermediário
- 1i. Task zumbi — userTask/serviceTask/scriptTask sem sourceRef em nenhum sequenceFlow (token preso; usa node)

### `08-checkpoint-tobe.md`

Mesma validação do checkpoint BPMN adaptada para TO-BE, incluindo verificação de achados de prioridade alta.

## bpmn-layout.js

Arquivo: `squads/escritorio-bpm-as-is/scripts/bpmn-layout.js`

```bash
node squads/escritorio-bpm-as-is/scripts/bpmn-layout.js <input.bpmn> <output.bpmn>
```

Algoritmo: regex parse, extração de lanes/nós/flows, DFS iterativo com pilha explícita (substituiu Kahn's na sessão 5), longest-path column assignment em O(V+E), BPMNShape + BPMNEdge, injeção no BPMNDiagram.

**Por que DFS e não Kahn:** loops de negócio criam ciclos no grafo. Kahn não resolve ciclos — nós do ciclo nunca chegam a inDeg=0 e são despejados no fim da ordem topológica em sequência arbitrária, corrompendo o longest-path. DFS detecta back-edges com precisão (estado=1 significa "nó na pilha atual") e produz ordem topológica válida para os nós fora do ciclo, empurrando todos os nós subsequentes ao ciclo para colunas corretas.

Constantes: `POOL_LABEL_W=30`, `LANE_LABEL_W=120`, `LANE_H=120`, `COL_W=180`, `ELEM_W=120`, `TASK_H=60`, `EVENT_W=36`, `GW_W=50`, `BACK_MARGIN=40`.

Pool height: `poolH = backEdgeSet.size > 0 ? totalLanesH + BACK_MARGIN * 2 : totalLanesH`. Pools externos começam em `poolH + 20`.

Message Flow routing: detecta se extremidade é Pool (w === totalW) e usa waypoints verticais alinhados. Nó a nó usa cotovelo em L com midY.

BPMNLabel: usa segmento central da aresta. Horizontal: y - 22. Vertical: x + 6.

Back-edge routing (sessão 5): 3 casos — (1) intra-lane: teto da própria raia com `localLoopY` dinâmico (`max(laneY+3, minTopY-5)` quando o padrão laneY+15 atravessaria o elemento); (2) cross-lane subindo: teto da lane destino (`laneY[tgtLane]+15`); (3) cross-lane descendo: calha inferior (`backEdgeY`).

MessageFlow nó→Pool (sessão 5): detecta colisão de obstáculos na linha vertical (`bounds` de outros elementos sobrepostos em `srcMidX`). Se houver obstáculo, desvia pela esquerda: `(srcMidX, startY) → (src.x-5, startY) → (src.x-5, endY)`. Resolve caso frequente: dois nós na mesma coluna onde o de cima tem MessageFlow que atravessa o de baixo.

`elemSize` (sessão 4): usa `type.toLowerCase()` — corrige falha de `'intermediateCatchEvent'.includes('IntermediateCatch')` que retornava false e renderizava eventos como caixas 120×60.

`nodeTagRe` (sessão 4): aceita namespace prefix `(?:[\w-]+:)?` — compatível com exportações de Camunda e outras ferramentas.

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
| Unicidade de nomes por ator/task_type | Validado (sessão 4) |
| Loop gera timer intermediário (PT24H) | Validado (sessão 4) |
| Loop intra-lane roteado pelo teto da raia | Validado (sessão 4) |
| intermediateCatchEvent com tamanho 36x36 | Validado (sessão 4) |
| Validado no bpmn.io | Validado (sessão 4) |
| DFS iterativo: loop de negócio não corrompe coluna dos nós subsequentes | Validado (sessão 5) |
| Back-edge subindo: roteado pelo teto da lane destino (não calha inferior) | Implementado (sessão 5) |
| Back-edge intra-lane: localLoopY dinâmico garante linha acima dos elementos | Implementado (sessão 5) |
| MessageFlow nó→Pool: detecta e desvia de elementos na mesma coluna abaixo | Implementado (sessão 5) |
| Verificação 1i: task zumbi (sem sourceRef em sequenceFlow) bloqueia pipeline | Implementado (sessão 5) |
| bpmn-layout.js — port-aware routing: saída pelo fundo/topo conforme posição relativa | Implementado (sessão 6) |
| bpmn-layout.js — back-edge row 1 usa piso, back-edge row 0 usa teto | Implementado (sessão 6) |
| bpmn-layout.js — COL_PAD=40 reduz auto-rerouting em renderizadores | Implementado (sessão 6) |
| 03-modelador.md — timer antes do gateway (não na branch Não) | Corrigido (sessão 6) |
| skill bpm-pipeline — reescrever sem npx opensquad run | Pendente |
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
