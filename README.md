# Escritório de BPM Agêntico

Sistema de agentes especializados que automatiza consultoria BPM ponta a ponta: desde a gravação da reunião de mapeamento no Telegram até a entrega de um BPMN AS-IS versionado pronto para importar no Bizagi.

## Visão do sistema

```
Reunião de mapeamento (áudio via Telegram)
    │
    ▼
Hermes Agent
  ├── pré-reunião: coleta contexto (processo, empresa, sistemas, siglas)
  ├── transcrição: Whisper API com vocabulário de contexto
  └── revisão: perguntas de clarificação sobre trechos ambíguos
    │
    ▼
opensquad pipeline
  01-elicitador   → elicitacao.json
  02-checkpoint
  03-modelador    → processo-as-is.bpmn
  bpmn-layout.js  → processo-as-is-layout.bpmn
  04-checkpoint
  05-auditor      → diagnostico-as-is.json
  06-checkpoint
    │
    ▼
Notificação via Telegram + BPMN versionado no Git
```

O TO-BE é produzido manualmente a partir do diagnóstico.

## Agentes do pipeline

| Agente | Framework | Output |
|---|---|---|
| Elicitador | BABOK v3 | `elicitacao.json` |
| Modelador | BPMN 2.0 / OMG | `processo-as-is.bpmn` |
| Auditor | CBOK v4.0 + Lean TIMWOOD + ISO 9001 | `diagnostico-as-is.json` |

## Stack

| Camada | Tecnologia |
|---|---|
| Pipeline BPM | opensquad (file-based, serial) |
| Intake de áudio e Telegram | Hermes Agent |
| Transcrição | Whisper API (OpenAI) |
| Layout visual | `bpmn-layout.js` (Node.js, sem dependências) |
| Visualização | bpmn.io |
| Target de importação | Bizagi Modeler |
| Versionamento | Git (outputs por run) |
| Implantação | Local (em validação) → VPS |

## Como executar o pipeline atual

O intake via Telegram está em construção. Por enquanto, a entrada é manual.

**Preparar o input:**
Colocar a transcrição em `squads/escritorio-bpm-as-is/input/transcricao.txt`.

**Step 01 — Elicitador:**
Abrir `pipeline/steps/01-elicitador.md`, substituir `{{input}}` pelo conteúdo da transcrição e executar com o agente elicitador. Salvar output como `elicitacao.json` na pasta da run.

**Step 03 — Modelador:**
Abrir `pipeline/steps/03-modelador.md`, substituir `{{input}}` pelo `elicitacao.json` e executar. Salvar como `processo-as-is.bpmn`.

**Layout visual:**
```bash
node squads/escritorio-bpm-as-is/scripts/bpmn-layout.js \
  <caminho>/processo-as-is.bpmn \
  <caminho>/processo-as-is-layout.bpmn
```

**Step 05 — Auditor:**
Abrir `pipeline/steps/05-auditor.md`, substituir `{{input}}` pelo `elicitacao.json` e executar. Salvar como `diagnostico-as-is.json`.

**Checkpoints** (steps 02, 04, 06) são validações manuais. O checkpoint do BPMN inclui greps automáticos que bloqueiam avanço se houver nomes longos, gateways sem rótulo ou atores externos modelados como Lane.

## Estrutura de pastas

```
squads/escritorio-bpm-as-is/
├── agents/           # Definições dos agentes (.agent.md)
├── input/            # Transcrições de entrada
├── output/           # Saídas por run (YYYY-MM-DD-NNNNNN/v1/)
├── pipeline/steps/   # Prompts de cada step
└── scripts/
    └── bpmn-layout.js  # Gerador de layout visual
```

## Convenções BPMN geradas

- **Atividades**: `userTask` para humanos, `serviceTask` para sistemas. Rótulo: Verbo Infinitivo + Objeto, máx 4 palavras.
- **Gateways**: todos `exclusiveGateway`. Pergunta fechada com "?", máx 6 palavras. Saídas sempre com `name="Sim"` ou `name="Não"`.
- **Atores externos** (fornecedor, cliente, banco): Pool Black Box com `<collaboration>` e `<messageFlow>`. Nunca Lane.
- **Loops**: `<sequenceFlow>` de retorno para atividade anterior. Nunca `<endEvent>`.

## Runs executadas

| Run | Data | Input | Status |
|---|---|---|---|
| 2026-05-14-000001 | 2026-05-14 | Camila Evers — Processo de Compras | Parcial (sem regras de nomenclatura) |
| 2026-05-15-000002 | 2026-05-15 | Camila Evers — Processo de Compras | Completo (AS-IS + Auditoria + TO-BE manual) |
| 2026-05-16-000001 | 2026-05-16 | Camila Evers — Processo de Compras | Completo AS-IS — pipeline validado com todas as regras |

## Roadmap

- [x] Pipeline AS-IS estável e validado
- [x] Regras BPMN consolidadas (Black Box, Sim/Não, loops, nomenclatura curta)
- [x] Checkpoint com grep automático
- [ ] Corrigir bugs de compatibilidade com Bizagi no `bpmn-layout.js`
- [ ] Instalar Hermes Agent local com gateway Telegram
- [ ] Skills de pré-reunião, transcrição e revisão
- [ ] Teste ponta a ponta: áudio → BPMN → Bizagi
- [ ] Deploy em VPS
