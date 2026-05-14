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

1. **Elicitação (BABOK)**: extrai entidades de uma transcrição de entrevista, atores, eventos, atividades, regras de negócio e sistemas, em JSON estruturado.
2. **Modelador AS-IS (BPMN 2.0)**: traduz o JSON em lógica BPMN. O layout visual NÃO é responsabilidade do agente, é delegado a um script Python (bpmn-auto-layout do bpmn.io ou elk.js) para evitar alucinação de coordenadas.
3. **Auditor (CBOK + Lean Six Sigma + ISO 9001)**: confronta o AS-IS com frameworks de mercado, gera backlog priorizado de melhorias com flag de confiabilidade (já que dados quantitativos de uma entrevista são limitados).
4. **TO-BE (Desenho de Solução)**: reestrutura o fluxo com automação e integração, gera BPMN final mais documento de justificativa técnica.

## Stack escolhida

- **Framework**: opensquad, file-based, repositório github.com/renatoasse/opensquad
- **IDE host**: Antigravity
- **Cérebro**: Claude (essa sessão)
- **Construtor**: Gemini (sessão separada no Antigravity)
- **Pasta do projeto**: `C:\Users\Claiton\Documents\Escritorio-de-BPM`
- **Node**: v24.13.1 (confirmado, acima do mínimo v20)
- **Git**: instalado, branch main, commit inicial feito

## Decisão metodológica vigente

Recusamos montar WBS detalhado agora. Motivo: três incertezas simultâneas (produto, técnica, plataforma) tornam qualquer plano detalhado prematuro.

Adotamos abordagem híbrida: **Spike-Driven Discovery (XP)** seguida de **Walking Skeleton (Cockburn)**, e só depois consolidação em WBS. Três spikes em timebox de um dia útil cada, na ordem: plataforma, geração BPMN, ingestão de entrevista.

## Estado atual do projeto (2026-05-14)

**Spike 2 concluído.** Arquivos em `squads/spike-bpmn/`. Output em `squads/spike-bpmn/output/2026-05-14-173000/v1/`.

### O que aprendemos no Spike 2: Geração BPMN

**Pergunta 1: LLM gera XML BPMN 2.0 válido em uma única chamada?**
Sim. O XML gerado foi importado no Bizagi Modeler 4.3 e renderizado no bpmn.io sem erros de parsing na primeira tentativa. Nenhuma correção manual foi necessária na estrutura do XML.

**Pergunta 2: Qual o limite de complexidade?**
Não atingido neste spike. O processo era simples (1 startEvent, 2 endEvents, 4 tasks, 1 exclusiveGateway, 2 lanes, 7 sequenceFlows). O limite será investigado em spike posterior, quando os agentes reais processarem transcrições de entrevistas.

**Pergunta 3: O bpmn-auto-layout renderiza sem coordenadas manuais?**
Parcialmente. A biblioteca `bpmn-auto-layout` (npm) gera `BPMNShape` com `dc:Bounds` para nós, mas tem duas limitações confirmadas: não gera `BPMNEdge` para sequenceFlows e não respeita `laneSet` ao calcular posições, colocando elementos de raias distintas na mesma coluna x. O resultado é renderizável mas sem setas e com raias desrespeitadas.

**Decisão metodológica:** aceitar layout parcial para o walking skeleton. Layout de qualidade é refinamento posterior. A Alternativa B (bpmn-js via Node.js) resolve o problema de forma completa mas será endereçada após os quatro agentes estarem funcionando.

**Descoberta adicional sobre o opensquad:**
O comando `npx opensquad run` não existe na v0.1.15. A CLI do opensquad é exclusivamente para setup (init, update, install, uninstall, skills, agents, runs). Squads rodam através do pipeline runner interno do Claude Code, via slash commands, não via terminal autônomo. O Gemini atuou diretamente como agente executor escrevendo o arquivo em disco.

**Bizagi Modeler 4.3:** importa arquivos `.bpmn` normalmente via botão BPMN na aba Exportar/importar. A limitação reportada anteriormente (só .bpm e .bpmc) não se confirmou na prática.

**Spike 1 concluído.** Commit: "Initial spike: opensquad platform validation".

### O que aprendemos sobre o opensquad

**Estrutura de arquivos de um squad:**

```
squads/{name}/
  squad.yaml                        — definição (code, name, icon, agents, pipeline.steps)
  agents/{id}.agent.md              — frontmatter: name, role, icon + persona em markdown
  pipeline/steps/{id}.md            — frontmatter: agent, outputFile, execution + prompt com {{input}}
  pipeline/steps/{id}.md            — checkpoint: frontmatter type: checkpoint, message + instruções
  state.json                        — estado da run ativa (removido ao concluir)
  output/{YYYY-MM-DD-HHMMSS}/v1/    — output versionado por timestamp
  output/{timestamp}/state.json     — cópia permanente do state ao concluir
```

**Ciclo de vida do status no state.json:**
- Execução normal e pausa no checkpoint: `running` (não muda para "paused")
- Após aprovação: `completed` + campo `completedAt` adicionado

**Estrutura do state.json:**
```json
{
  "squad": "nome-do-squad",
  "status": "running | completed",
  "step": { "current": N, "total": N, "label": "id-do-step" },
  "agents": [{ "id": "", "name": "", "icon": "", "status": "done", "desk": { "col": 1, "row": 1 } }],
  "handoff": { "from": "agente", "to": "user", "message": "...", "completedAt": "ISO8601" },
  "startedAt": "ISO8601",
  "updatedAt": "ISO8601",
  "completedAt": "ISO8601"
}
```

**Checkpoint:** exibe delimitador `✋ CHECKPOINT` no terminal, pausa aguardando resposta. Resposta `1` aprova, texto descritivo solicita ajuste.

**Dashboard:** roda em `localhost:5174` via `npx opensquad dashboard`. Detecta squads automaticamente via squad-watcher. Interface Phaser com pixel art.

**Restrição crítica:** o Antigravity não suporta subagentes paralelos. Todo o pipeline BPM deve ser serial e inline.

**Consumo de tokens:** não mensurável diretamente no Antigravity. Pendência para observação empírica nos agentes BPM reais.

## Próxima ação concreta: Spike 3, Ingestão de Entrevista

Objetivo: validar que o agente de Elicitação (BABOK) consegue extrair entidades estruturadas de uma transcrição de entrevista real ou simulada e produzir o JSON que alimenta o agente Modelador.

O que precisamos responder ao final do Spike 3:
- O agente consegue identificar atores, eventos, atividades, regras de negócio e sistemas a partir de uma transcrição não estruturada?
- O JSON de saída é compatível com o schema que o agente Modelador espera como input?
- Qual é o nível de ruído tolerável na transcrição antes de o agente falhar ou alucinar entidades?

Sequência sugerida para delegar ao Gemini:

1. Criar uma transcrição de entrevista fictícia simples (10 a 15 turnos de fala, processo de aprovação de compra ou similar)
2. Criar um squad `spike-elicitacao` com um único agente Elicitador, cujo step recebe a transcrição e retorna JSON estruturado
3. Rodar o squad com a transcrição como input
4. Validar manualmente se o JSON de saída é compatível com o schema do fixture do Spike 2
5. Registrar: quantas entidades foram identificadas corretamente? Houve alucinações?

**Critério de sucesso:** JSON de saída compatível com o schema do agente Modelador, sem entidades inventadas não presentes na transcrição.

## Regras de estilo invioláveis

- **Sem traços longos (em-dash, U+2014)**. Usar vírgulas ou reformular a frase.
- **Conteúdo grounded em experiência documentada**. NUNCA inventar métricas, projetos fictícios ou dados de clientes. Quando incerto, perguntar.
- **Português brasileiro** como padrão.
- **Tom direto e crítico**, com autoridade quando apropriado (ABPMP, OMG, BPM CBOK v4.0, BABOK v3).
- **Estrutura discursiva preferida**: nomeação técnica, ancoragem em autoridade, descida ao concreto, construção em camadas, posição autoral.
- Evitar formatação excessiva (bullets, headers, negritos em cascata). Prosa quando der.

## Conselho consultor externo

Se uma decisão metodológica complexa surgir e você precisar de segunda opinião, o usuário pode retornar à conversa original no Claude.ai (web). Toda a história do projeto está preservada lá via sistema de memória. Funciona como conselho consultor externo a este projeto.

## Confirmação esperada antes de qualquer ação

Antes de executar qualquer coisa ou delegar para o Gemini, responda em 5 a 8 linhas com sua interpretação do que leu, para o usuário validar que você entendeu sem alucinar. Se algo estiver ambíguo ou faltar contexto, pergunte. Não presuma.
