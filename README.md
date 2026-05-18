# Escritório de BPM Agêntico

Pipeline de agentes que automatiza consultoria BPM ponta a ponta: a partir de uma descrição ou transcrição de reunião de mapeamento, gera um BPMN AS-IS validado e um diagnóstico baseado no ABPMP BPM CBOK v4.0, pronto para importar no Bizagi.

## Como executar

```bash
bash rodar.sh
```

Cole a descrição do processo quando solicitado. O pipeline roda automaticamente e entrega os artefatos em `squads/escritorio-bpm-as-is/output/<run-id>/v1/`.

## Visão do pipeline

```
Descrição ou transcrição do processo (texto)
    │
    ▼
01 — Elicitador       → elicitacao.json
02 — Checkpoint       → valida JSON
03 — Modelador        → processo-as-is.bpmn  (BPMN 2.0)
     bpmn-layout.js  → processo-as-is-layout.bpmn  (com DI)
04 — Checkpoint       → 10 verificações automáticas
05 — Auditor          → diagnostico-as-is.json  (CBOK v4.0)
06 — Checkpoint       → valida JSON de auditoria
```

## Agentes

| Agente | Base de conhecimento | Output |
|---|---|---|
| Elicitador | BABOK v3 | `elicitacao.json` |
| Modelador | BPMN 2.0 / OMG + `bpmn-rules.md` | `processo-as-is.bpmn` |
| Auditor | ABPMP BPM CBOK v4.0 cap. 4 + `cbok-audit-rules.md` | `diagnostico-as-is.json` |

## Stack

| Camada | Tecnologia |
|---|---|
| Pipeline BPM | Bash + Node.js (file-based, serial) |
| LLM | Qwen (qwen-plus via Alibaba DashScope) |
| Layout visual | `bpmn-layout.js` (Node.js puro, sem dependências) |
| Visualização | bpmn.io |
| Target de importação | Bizagi Modeler |
| Versionamento | Git (outputs por run-id) |

## Estrutura de pastas

```
squads/escritorio-bpm-as-is/
├── input/              # Transcrições de entrada
├── output/             # Saídas por run (YYYY-MM-DD-HHMMSS/v1/)
│   └── <run-id>/v1/
│       ├── elicitacao.json
│       ├── processo-as-is.bpmn
│       ├── processo-as-is-layout.bpmn
│       └── diagnostico-as-is.json
├── pipeline/steps/     # Prompts de cada step
│   ├── 01-elicitador.md
│   ├── 02-checkpoint-elicitacao.md
│   ├── 03-modelador.md
│   ├── 05-auditor.md
│   └── 06-checkpoint-auditoria.md
├── references/         # Regras e conhecimento dos agentes
│   ├── bpmn-rules.md         # Regras BPMN 2.0 (OMG + GNOFI)
│   └── cbok-audit-rules.md   # Regras de auditoria (CBOK v4.0 cap. 4)
└── scripts/
    ├── run-pipeline.sh       # Orquestrador principal
    ├── bpmn-layout.js        # Gerador de layout visual (DI)
    └── anthropic-call.js     # Cliente Qwen API
skills/
├── bpm-auditoria/references/cbok-cap4.md   # Fonte CBOK cap. 4 (base das regras)
└── bpm-modelagem/references/gnofi-curso-completo.md
```

## Convenções BPMN

**Atividades**
- `userTask` — humano executa (análise, aprovação, contato)
- `serviceTask` — sistema executa automaticamente
- Rótulo: Verbo Infinitivo + Objeto, máx 4 palavras, sem artigos

**Gateways**
- Todos `exclusiveGateway`. Pergunta fechada com "?", máx 6 palavras.
- Saídas sempre com `name="Sim"` / `name="Não"` e `<conditionExpression>`
- Caminhos convergentes exigem gateway convergente (proibida convergência implícita)

**Atores externos** (fornecedor, cliente, banco, transportadora)
- Pool Black Box com `<collaboration>` e `<messageFlow>`
- Ator externo que apenas dispara o processo → sem pool, apenas `<startEvent>`
- `<startEvent>` não pode ser `sourceRef` de messageFlow

**Loops**
- `<intermediateCatchEvent>` com timer PT24H obrigatório antes do gateway de decisão
- Nunca `<endEvent>` em loop

**Lanes**
- Todo elemento de fluxo DEVE estar em `<flowNodeRef>` de uma lane (incluindo `serviceTask`)
- `endEvent` na mesma lane da última atividade que o antecede

## Checkpoint BPMN (10 verificações automáticas)

| # | Verificação | Ação |
|---|---|---|
| 1b | Nome com mais de 60 chars | FAIL |
| 1d | Gateway divergente com saída sem `name=` | FAIL |
| 1e | Ator externo modelado como Lane | FAIL |
| 1f | `sequenceFlow` cruzando fronteira de Pool | FAIL |
| 1g | `targetRef` duplicados (convergência implícita) | AVISO |
| 1h | Loop sem timer intermediário | FAIL |
| 1i | Task zumbi (sem `sequenceFlow` de saída) | FAIL |
| 1j | Elemento de fluxo sem `flowNodeRef` em nenhuma lane | FAIL |

## Categorias de achados do auditor (CBOK v4.0)

| Categoria | Seção CBOK |
|---|---|
| `Notacao_Ambigua` | 4.1.3 |
| `Incompletude_ARIS` | 4.2.5 |
| `Conflito_Ontologico` | 4.6.1 |
| `Desalinhamento_Hierarquico` | 4.6.4 / 4.7 |
| `Falha_Executabilidade` | 4.11 |
| `Desvio_Governanca` | 4.2.8 |

## Runs validadas

| Run | Data | Processo | Status |
|---|---|---|---|
| 2026-05-14-000001 | 2026-05-14 | Compras — Camila Evers | Parcial |
| 2026-05-15-000002 | 2026-05-15 | Compras — Camila Evers | Completo |
| 2026-05-16-000001 | 2026-05-16 | Compras — Camila Evers | ✅ Pipeline validado (todas as regras) |
| 2026-05-16-000003 | 2026-05-16 | Conciliação e Baixa de Títulos | ✅ Validado bpmn.io (collaboration, timer, loop) |
| 2026-05-16-000004 | 2026-05-16 | Conciliação e Baixa de Títulos | ✅ Pipeline completo (steps 01–06) |
| 2026-05-18-022944 | 2026-05-18 | Cancelamento de Serviço | ✅ Validado Bizagi (CBOK v4.0, 10/10 checks) |

## Roadmap

- [x] Pipeline AS-IS estável (6 steps, bash + node)
- [x] Regras BPMN centralizadas em `bpmn-rules.md`
- [x] Regras de auditoria CBOK v4.0 em `cbok-audit-rules.md`
- [x] Checkpoint com 10 verificações automáticas
- [x] Layout visual com DI completo (BPMNShape + BPMNEdge)
- [x] Compatibilidade Bizagi validada (3 processos distintos)
- [x] Migração para Qwen API (custo zero)
- [ ] Teste ponta a ponta com processo de cliente real
- [ ] Deploy em VPS
