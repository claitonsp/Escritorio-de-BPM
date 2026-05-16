# Escritorio de BPM Agêntico

Sistema de agentes especializados que automatiza consultoria BPM ponta a ponta, desde a transcrição de entrevista com cliente até a entrega de fluxos BPMN AS-IS validados e diagnóstico de processo estruturado.

## O que este projeto faz

Dado o áudio ou a transcrição de uma entrevista sobre um processo de negócio, o pipeline executa quatro agentes em sequência e entrega:

1. **JSON de elicitação** — entidades extraídas da transcrição (atividades, atores, gateways, regras de negócio) com rótulos curtos prontos para o diagrama
2. **BPMN AS-IS** — diagrama XML estruturado com lanes, gateways, sequenceFlows e Pool Black Box para atores externos
3. **Diagnóstico** — backlog priorizado de melhorias fundamentado em CBOK, Lean e ISO 9001
4. **Layout visual** — arquivo BPMN renderizável no bpmn.io gerado automaticamente por script Node.js

## Pipeline

```
transcrição
    │
    ▼
01-elicitador       → elicitacao.json
02-checkpoint
    │
    ▼
03-modelador        → processo-as-is.bpmn
bpmn-layout.js      → processo-as-is-layout.bpmn
04-checkpoint
    │
    ▼
05-auditor          → diagnostico-as-is.json
06-checkpoint
```

O TO-BE é produzido manualmente a partir do diagnóstico.

## Agentes

| Agente | Framework | Output |
|---|---|---|
| Elicitador | BABOK v3 | `elicitacao.json` |
| Modelador | BPMN 2.0 / OMG | `processo-as-is.bpmn` |
| Auditor | CBOK v4.0 + Lean TIMWOOD + ISO 9001 | `diagnostico-as-is.json` |

## Como executar

Cada step é um arquivo de prompt em `squads/escritorio-bpm-as-is/pipeline/steps/`. O input da transcrição fica em `squads/escritorio-bpm-as-is/input/`.

**Step 01 — Elicitador:**
Abra `01-elicitador.md`, substitua `{{input}}` pelo conteúdo da transcrição e execute com o agente `elicitador`. Salve o output como `elicitacao.json` na pasta de output da run.

**Step 03 — Modelador:**
Abra `03-modelador.md`, substitua `{{input}}` pelo `elicitacao.json` e execute com o agente `modelador`. Salve como `processo-as-is.bpmn`.

**Layout visual:**
```bash
node squads/escritorio-bpm-as-is/scripts/bpmn-layout.js \
  <caminho>/processo-as-is.bpmn \
  <caminho>/processo-as-is-layout.bpmn
```

**Step 05 — Auditor:**
Abra `05-auditor.md`, substitua `{{input}}` pelo `elicitacao.json` e execute com o agente `auditor`. Salve como `diagnostico-as-is.json`.

**Checkpoints** (steps 02, 04, 06) são validações manuais descritas em seus respectivos arquivos `.md`. O checkpoint do BPMN inclui greps automáticos que bloqueiam avanço se houver nomes longos, gateways sem rótulo ou atores externos modelados como Lane.

## Estrutura de pastas

```
squads/escritorio-bpm-as-is/
├── agents/           # Definições dos agentes (.agent.md)
├── input/            # Transcrições de entrada (.txt, .mp3)
├── output/           # Saídas organizadas por run (YYYY-MM-DD-NNNNNN/v1/)
├── pipeline/steps/   # Prompts de cada step do pipeline
└── scripts/
    └── bpmn-layout.js  # Gerador de layout visual (Node.js, sem dependências)
```

## Convenções BPMN geradas

- **Atividades**: `userTask` para humanos, `serviceTask` para sistemas. Rótulo: Verbo Infinitivo + Objeto, máx 4 palavras.
- **Gateways**: todos `exclusiveGateway`. Rótulo: pergunta fechada com "?", máx 6 palavras. Saídas sempre com `name="Sim"` ou `name="Não"`.
- **Atores externos** (fornecedor, cliente, banco): Pool Black Box com `<collaboration>` e `<messageFlow>`. Nunca Lane.
- **Loops**: `<sequenceFlow>` de retorno para atividade anterior. Nunca `<endEvent>`.

## Runs executadas

| Run | Data | Input | Status |
|---|---|---|---|
| 2026-05-14-000001 | 2026-05-14 | Camila Evers - Processo de Compras | Parcial (sem regras de nomenclatura) |
| 2026-05-15-000002 | 2026-05-15 | Camila Evers - Processo de Compras | Completo (AS-IS + Auditoria + TO-BE manual) |
| 2026-05-16-000001 | 2026-05-16 | Camila Evers - Processo de Compras | Completo AS-IS — pipeline validado com novas regras |

## Stack

- **Framework**: opensquad (file-based, pipeline serial)
- **Node**: v24.13.1
- **Visualização**: bpmn.io
- **Layout**: `bpmn-layout.js` (script local, sem dependências externas)
