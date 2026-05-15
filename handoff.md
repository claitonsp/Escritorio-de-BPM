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

**Spike 3 concluído.** Arquivos em `squads/spike-elicitacao/`. Output em `squads/spike-elicitacao/output/2026-05-14-151200/v1/`.

### O que aprendemos no Spike 3: Ingestão de Entrevista

**Pergunta 1: O agente consegue identificar atores, eventos, atividades, regras de negócio e sistemas a partir de uma transcrição não estruturada?**
Sim. O agente Elicitador identificou corretamente 7 atores humanos/organizacionais, 15 atividades, 3 eventos (1 start, 2 end), 4 gateways exclusivos, 2 sistemas e 4 regras de negócio. Nenhuma entidade inventada. Todas rastreáveis à transcrição.

**Pergunta 2: O JSON de saída é compatível com o schema que o agente Modelador espera?**
Sim. O schema definido no step (`atores`, `atividades`, `eventos`, `gateways`, `sistemas`, `regras_de_negocio`, `observacoes`) é o suficiente para o Modelador gerar sequenceFlows e lanes. O agente necessitou de uma rodada de ajuste (v2) para corrigir: duplicidade estrutural do SAP, end event faltante no caminho de orçamento indisponível, e regra de negócio sobre três cotações.

**Pergunta 3: Qual o nível de ruído tolerável?**
Não testado neste spike. A transcrição era limpa e estruturada. Ruído real (interrupções, contradições, vocabulário coloquial) será testado em sprint posterior quando houver transcrição de entrevista real.

**Decisão metodológica pendente para o Spike 4:**
O SAP aparece em dois arrays (`atores` com tipo "sistema" e `sistemas`). O agente Modelador vai precisar de uma convenção explícita: SAP terá lane própria no BPMN ou será apenas atributo de atividade? A recomendação é tratar sistemas automatizados (ativ-09, ativ-14) como service tasks dentro da lane do ator humano que os dispara, sem lane SAP separada. Isso simplifica o layout e é compatível com o padrão BPMN 2.0 para automação.

**Caminho aberto após ativ-13 (resolver divergência):** lacuna da transcrição original, não erro do agente. O entrevistado não especificou o que acontece após resolução de divergência na entrega. Precisa ser levantado em entrevista real.

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

## Spike 4 concluído. Arquivos em `squads/spike-modelador/`. Output em `squads/spike-modelador/output/`.

### O que aprendemos no Spike 4: Modelador AS-IS

**Pergunta 1: O agente gera XML BPMN 2.0 válido sem alucinar elementos?**
Sim. 23 nós (1 startEvent, 4 endEvents, 15 tarefas, 4 gateways) e 24 sequenceFlows gerados sem invenção. Todos rastreáveis ao elicitacao.json.

**Pergunta 2: As lanes correspondem corretamente aos atores?**
Sim. 7 lanes geradas na ordem correta. SAP modelado como serviceTask dentro da lane do ator humano que o dispara (ativ-09 no Gerente, ativ-14 no Almoxarifado), sem lane própria, conforme decisão do Spike 3.

**Pergunta 3: Os gateways e condicionais estão corretos?**
Sim. 4 exclusiveGateway com conditionExpression em todas as saídas. ev-04 "Divergência resolvida (fluxo indefinido)" gerado conforme instrução.

**Pergunta 4: O XML passa no bpmn.io e no Bizagi?**
Parcialmente. bpmn.io renderizou corretamente após adição manual de BPMNShape para as 7 lanes. Bizagi não renderizou em nenhuma tentativa (causa não identificada, não bloqueante para o walking skeleton).

**Descoberta técnica crítica sobre DI:**
O agente Modelador não gera DI (BPMNShape/BPMNEdge). O bpmn-auto-layout 1.3.0 gera BPMNShape para nós mas não para lanes. Sem shapes de lane no BPMNPlane, ferramentas não renderizam. A solução atual é adicionar BPMNShape de lanes via script ou manualmente. A solução definitiva (bpmn-js via Node.js gerando DI completo) continua como refinamento posterior.

**Descoberta técnica sobre bpmn-auto-layout 1.3.0:**
API mudou: `layoutProcess` é função direta exportada, não método de classe. Usar `const { layoutProcess } = require('bpmn-auto-layout')` em vez de `new BpmnAutoLayout()`.

**Observação sobre encoding:**
Labels com caracteres UTF-8 (ã, ç, é) aparecem corrompidos no SVG exportado pelo bpmn.io. O XML BPMN original está correto. É artefato do export SVG do bpmn.io, não do agente.

## Walking Skeleton AS-IS concluído (2026-05-14)

Squad `escritorio-bpm-as-is` rodou de ponta a ponta. Pipeline: Elicitador → elicitacao.json → Modelador → processo-as-is.bpmn → bpmn-auto-layout → DI Injector → processo-as-is-final.bpmn. Diagrama renderizou no bpmn.io com 7 lanes, 4 gateways, 15 atividades, serviceTasks e ev-04.

**Correção incorporada vs. Spike 4:** gw-01 (Valor da compra) movido para lane do Supervisor, onde a decisão ocorre.

**Limitação identificada: sobreposição de lanes no DI Injector.** O bpmn-auto-layout coloca todos os elementos em coluna única ignorando lanes. Elementos de atores diferentes ficam intercalados no eixo Y. O DI Injector calcula bounds por lane a partir das posições reais, causando sobreposição (lane do Gerente engolindo as demais). Diagrama renderizável mas não entregável a cliente.

**Resolução definitiva:** substituir bpmn-auto-layout + DI Injector por bpmn-js via Node.js, que gera DI completo com lanes sem sobreposição e BPMNEdge (setas). Esta é a Alternativa B definida desde o Spike 2.

**Bizagi:** ainda não renderiza. Aceito como não bloqueante. bpmn.io é a ferramenta de validação padrão.

## Pipeline completo (2026-05-15)

Todos os quatro agentes implementados e validados. Squad `escritorio-bpm-as-is` com 8 steps, pipeline serial.

### Agente 3: Auditor (CBOK + Lean Six Sigma + ISO 9001)

Arquivos: `agents/auditor.agent.md`, `pipeline/steps/05-auditor.md`, `pipeline/steps/06-checkpoint-auditoria.md`.

Output: `output/2026-05-14-000001/v1/diagnostico-as-is.json` com 10 achados estruturados (4 alta prioridade, 4 média, 2 baixa).

**Decisão incorporada durante a auditoria:** gw-01 corrigido no AS-IS. Caminho "Até R$ 5.000" vai direto para ativ-05 sem passar pelo Gerente. Confirmado pelo usuário. elicitacao.json, processo-as-is.bpmn e diagnostico-as-is.json atualizados.

### Agente 4: TO-BE (Designer de Solução)

Arquivos: `agents/tobe.agent.md`, `pipeline/steps/07-tobe.md`, `pipeline/steps/08-checkpoint-tobe.md`.

Output: `output/2026-05-14-000001/v1/processo-tobe.bpmn`, validado no bpmn.io.

**Mudanças do AS-IS para o TO-BE:**
- ativ-06: userTask convertida para serviceTask (automação SAP, ach-06)
- ativ-16 (nova): "Registrar comparativo de cotações e selecionar fornecedor" (ISO 9001 cl. 8.4.1, ach-07)
- gw-05 (novo): "Resolução da divergência" com 3 saídas após ativ-13 (ach-02)
- ativ-17 (nova): "Devolver mercadoria ao fornecedor" (Almoxarifado)
- ativ-18 (nova): "Escalar divergência para Diretoria" (Gerente de Compras)
- ev-05, ev-06 (novos), ev-04 removido
- Supervisor mantido: segregação de deveres

## Próxima ação: bpmn-js (Alternativa B)

Layout entregável a cliente requer substituição do par bpmn-auto-layout + di-injector por bpmn-js via Node.js (gera DI completo com lanes sem sobreposição e BPMNEdge com setas). Sequência:
1. Investigar bpmn-js em Node.js sem browser (jsdom ou puppeteer)
2. Escrever `bpmn-layout.js` substituindo o par atual
3. Validar com processo-as-is.bpmn e processo-tobe.bpmn

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
