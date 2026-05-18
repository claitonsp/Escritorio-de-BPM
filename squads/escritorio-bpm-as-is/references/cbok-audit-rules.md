# Regras de Auditoria CBOK v4.0 — Escritório de BPM

> Fonte primária: ABPMP BPM CBOK v4.0 (Capítulo 4 — Modelação de Processos de Negócio)
> Estas regras se aplicam à auditoria, diagnóstico e elicitação de processos AS-IS pelo agente auditor.

---

## 1. Identificação de um Modelo de Processos (Seção 4.1.3)

O auditor deve validar se a representação capturada do processo AS-IS se qualifica como um Modelo de Processos formal e não apenas como um diagrama ou mapa simples de baixa precisão.

### 1.1 Tabela de Validação de Modelo de Processos

A decisão de conformidade do modelo capturado deve seguir estritamente as características extraídas do CBOK v4.0:

| Critério | Modelo de Processos (Conforme) | Diagrama ou Mapa (Não Conforme) |
|---|---|---|
| 1. Notação | Convenção padronizada de uma notação (Ex: BPMN 2.0) | Notação ambígua, ad-hoc ou livre |
| 2. Precisão | Tão preciso quanto necessário | Baixa precisão |
| 3. Detalhe | Mais detalhado, apto para análise profunda | Menos detalhado, visão superficial |
| 4. Ícones | Ícones objetivamente definidos e padronizados | Ícones formulados ou vagamente definidos |
| 5. Relações | Relacionamento de ícones definidos em anotações e glossário | Relacionamentos retratados apenas visualmente |
| 6. Complexidade | Representa complexidade apropriada do negócio | Limitado a representar ideias simples |
| 7. Evolução | Pode crescer, evoluir e amadurecer no repositório | Fotografia única e estática |
| 8. Ferramental | Criado com uma ferramenta adequada ao projeto | Criado com ferramentas de desenho simples |
| 9. Simulação | Fornece simulação manual ou automatizada | Difícil de usar para simulação simples |
| 10. Conexão | Ligação vertical e horizontal entre diferentes níveis | Dificuldade de se conectar com outros diagramas |
| 11. Repositório | Utiliza repositório integrado de um sistema BPM | Armazenamento de ficheiros sem relacionamentos |
| 12. Análise | Apropriado para captura, análise e desenho | Apropriado apenas para ideias rápidas |
| 13. BPMS | Adequado para importação em sistemas BPMS | Não é adequado para importação de BPMS |

**Regra de Auditoria:** Qualquer representação do AS-IS que apresente notações ambíguas, baixa precisão ou ausência de uma convenção padronizada deve ser sinalizada como um achado na categoria `Notacao_Ambigua`.

---

## 2. Âmbito do Conteúdo — As 5 Dimensões ARIS (Seção 4.2.5)

Para garantir a completude do processo AS-IS elicitado, o auditor deve verificar sistematicamente se o repositório de dados capturou as 5 dimensões fundamentais da arquitetura ARIS (Scheer).

### 2.1 As 5 Dimensões ARIS de Conteúdo

| Dimensão ARIS | Pergunta de Validação no AS-IS | Requisito de Completude no Modelo |
|---|---|---|
| 1. Organização | Quem está envolvido nos processos? | Identificação explícita de atores, papéis, áreas e raias (lanes). |
| 2. Funções | Quais são as atividades realizadas? | Lista estruturada de atividades e tarefas operacionais sequenciadas. |
| 3. Dados | Que informação é necessária ou produzida? | Documentos, dados de entrada (inputs) e saídas (outputs) de cada tarefa. |
| 4. Entregáveis | Por que precisamos desses processos? | Produtos, serviços, relatórios ou valor concreto gerado para o cliente. |
| 5. Controlo | Em que sequência lógica o processo ocorre? | Gateways, regras de decisão, eventos de início/fim e sequência do fluxo. |

**Regra de Auditoria:** A ausência de qualquer uma das dimensões acima (como atividades sem atores identificados, caminhos sem dados de entrada/saída ou fluxos sem entregáveis de valor explícitos) deve gerar um achado de conformidade na categoria `Incompletude_ARIS`.

---

## 3. Níveis do Modelo de Processos e Ontologia (Seção 4.6)

A consistência hierárquica e semântica é essencial para a manutenção e legibilidade do repositório de processos.

### 3.1 Ontologia e Nomenclatura (Seção 4.6.1)

O auditor deve validar se há uma ontologia acordada e consistente no modelo, evitando conflitos de nomenclatura.

- **Regra 3.1.1 (Silos e Sinônimos):** É proibido o uso de dois nomes diferentes para se referir ao mesmo item físico, lógico ou papel (ex: tratar "ERP", "Sistema Corporativo" e "SAP" como itens separados se forem o mesmo sistema).
- **Regra 3.1.2 (Homônimos):** É proibido o uso do mesmo nome para representar itens, papéis ou sistemas diferentes no processo.

### 3.2 Alinhamento Hierárquico dos Processos (Seção 4.6.4)

Os processos de negócio devem ser classificados e alinhados de acordo com os 4 níveis de abstração padrão:

```
Nível 1: Corporativo (Perspectiva Executiva — Cadeia de Valor)
  └── Nível 2: Negócio (Perspectiva de Processo — Ponta a Ponta)
        └── Nível 3: Fluxos de Trabalho (Perspectiva de Operações — Workflows)
              └── Nível 4: Passos das Tarefas (Perspectiva de Colaborador/Sistema — Instruções de Trabalho)
```

- **Regra 3.2.1 (Não Mistura de Níveis):** É expressamente proibido misturar atividades de níveis diferentes em um mesmo modelo. Tarefas de nível microscópico de sistema (ex: "Clicar no botão salvar", "Digitar usuário e senha") não devem figurar em modelos de processos de Negócio (Nível 2) ou Operações (Nível 3).

**Regra de Auditoria:** Qualquer violação destas regras de consistência hierárquica ou semântica deve ser sinalizada como `Conflito_Ontologico` ou `Desalinhamento_Hierarquico`.

---

## 4. Alinhamento com a Arquitetura de Negócio (Seção 4.7)

O modelo AS-IS deve garantir a rastreabilidade entre a estratégia corporativa, os fluxos de trabalho e as tarefas, definindo claramente a responsabilidade por cada nível de processo.

### 4.1 Rastreabilidade e Responsabilidade por Nível

| Nível de Modelo | Perspectiva CBOK | Posição Responsável | Foco da Auditoria no AS-IS |
|---|---|---|---|
| Modelo Corporativo | Corporativa | Gestão Executiva | Alinhamento da estratégia com o desempenho agregado. |
| Modelo de Processo | Negócio | Dono do Processo (Process Owner) | Fluxo primário ponta a ponta e interfaces de subprocessos. |
| Modelo de Workflow | Operações | Gestor de Operações | Sequenciamento operacional das tarefas entre posições e lanes. |
| Passos das Tarefas | Colaborador / Sistema | Colaborador / Executor | Instruções de trabalho operacionais, inputs e outputs transacionais. |

**Regra de Auditoria:** Se o processo AS-IS apresentar atividades órfãs de responsabilidade ou se o nível do modelo de workflow (Nível 3) não possuir correspondência direta com o papel do executor (lane correspondente), o auditor deve emitir um achado de `Desalinhamento_Hierarquico`.

---

## 5. Validação e Executabilidade (Seção 4.11)

A validação lógica garante que o processo elicitado seja consistente e represente um comportamento executável (sem travamentos ou ambiguidades).

### 5.1 Regras de Fluxo de Tokens e Consistência Lógica

- **Regra 5.1.1 (Ausência de Deadlocks):** O fluxo não pode possuir caminhos sem saída ou impasses lógicos onde um token de processo fique preso indefinidamente sem a capacidade de atingir um estado terminal (Seção 4.11.1).
- **Regra 5.1.2 (Loops Controlados):** Todos os caminhos de retorno (back-edges) devem passar por um gateway de decisão explícito contendo condições mutuamente exclusivas e claras de saída. Loops infinitos desprovidos de controle de saída lógica são terminantemente proibidos.
- **Regra 5.1.3 (Garantia de Término):** Todo caminho lógico iniciado em um `<startEvent>` deve, obrigatoriamente, ser capaz de alcançar pelo menos um `<endEvent>`.

**Regra de Auditoria:** Falhas lógicas de fluxo, travamentos ou caminhos desconectados devem ser sinalizados na categoria `Falha_Executabilidade`.

---

## 6. Governação do Repositório (Seção 4.2.8)

A governança do repositório garante que o ciclo de vida dos modelos seja gerido sob padrões estruturados e controlados de nomenclatura, versionamento e manutenção.

### 6.1 Métodos e Convenções do Repositório (Seção 4.2.8.2)

- **Regra 6.1.1 (Estrutura de Pastas):** Os modelos e artefatos de auditoria devem seguir a estrutura hierárquica e nomenclatura padrão de pastas estabelecida para o repositório.
- **Regra 6.1.2 (Ciclo de Vida do Modelo):** O modelo deve ter seu estado claramente definido nas seguintes fases: estratégia, desenho, construção, manutenção e operação. Modelos AS-IS editados devem ser salvos em estado "Rascunho" (draft) e transitar para "Aprovado" ou "Publicado" apenas após validação formal do Arquiteto de Processos e Dono do Processo (Seção 4.2.8.1).
- **Regra 6.1.3 (Garantia de Qualidade Regular):** O repositório deve passar por auditoria de garantia de qualidade de modelagem pelo menos quatro vezes por ano (Seção 4.2.10).

**Regra de Auditoria:** A ausência de versionamento estruturado, nomenclatura de arquivo fora do padrão de métodos e convenções, ou falta de identificação de estado do modelo deve ser apontada como `Desvio_Governanca`.

---

## 7. Categorias de Achados

Para preenchimento do campo `categoria` no JSON de diagnóstico gerado pelo agente de auditoria, devem ser utilizados exclusivamente os tipos válidos abaixo, todos baseados nas definições doutrinárias do CBOK v4.0 Capítulo 4:

| Categoria do Achado (JSON) | Descrição do Achado | Seção Base do CBOK |
|---|---|---|
| `Notacao_Ambigua` | Uso de notações não padronizadas, ícones vagos ou diagramação informal fora do padrão de modelagem formal. | Seção 4.1.3 |
| `Incompletude_ARIS` | Falha em capturar qualquer uma das 5 dimensões ARIS (Organização, Funções, Dados, Entregáveis ou Controle). | Seção 4.2.5 |
| `Conflito_Ontologico` | Inconsistências de nomenclatura de objetos, sinônimos não tratados ou duplicidades semânticas que prejudicam a clareza do repositório. | Seção 4.6.1 |
| `Desalinhamento_Hierarquico` | Mistura de níveis de processos, falta de rastreabilidade entre estratégia e tarefas ou atribuição errada de responsabilidades. | Seções 4.6.4 / 4.7 |
| `Falha_Executabilidade` | Erros de lógica de fluxo, deadlocks, caminhos órfãos, tokens presos ou loops infinitos sem controle de saída. | Seção 4.11 |
| `Desvio_Governanca` | Desrespeito às regras de ciclo de vida do modelo, falha em versionamento, desvios da estrutura de pastas ou omissão de métodos e convenções do repositório. | Seção 4.2.8 |

---

## 8. Proibições Absolutas do Auditor

1. **PROIBIDO Inventar Dados:** O auditor jamais deve inventar ou assumir a existência de atividades, atores, sistemas ou regras de negócio que não foram explicitamente documentados na elicitação do processo AS-IS.
2. **PROIBIDO Inferir Métricas Ausentes:** É terminantemente proibido inventar ou estimar de forma intuitiva tempos de ciclo, custos, frequências de transação ou taxas de erro. Se tais dados não forem capturados formalmente na modelagem, o auditor deve reportar sua ausência como um achado de `Incompletude_ARIS` (Seção 4.11.1).
3. **PROIBIDO Misturar AS-IS com TO-BE:** O diagnóstico do AS-IS deve se ater rigorosamente à identificação de gargalos, falhas e desconformidades da situação atual. Nenhuma proposta de redesenho, automatização ou mudança futura (TO-BE) deve ser misturada no relatório de achados da auditoria do AS-IS.
4. **PROIBIDO Diagramas Informais como Modelos:** O auditor não deve aprovar representações planas, ad-hoc ou sem relacionamentos lógicos consistentes como modelos válidos, sob o risco de inviabilizar a integridade do repositório (Seção 4.1.3).
5. **PROIBIDO Ignorar Relações do Entorno:** É vedado ao auditor analisar atividades isoladas sem verificar suas conexões horizontais com subprocessos paralelos e verticais com a cadeia de valor geral da organização (Seção 4.6.2).

---

## 9. Referências

- ABPMP BPM CBOK v4.0 — Capítulo 4: Modelação de Processos de Negócio
- Seção 4.1.3 — Identificação de um Modelo de Processos (Critérios formais de conformidade de modelos)
- Seção 4.2.5 — Âmbito do Conteúdo de Conhecimento de Processos Corretos (5 dimensões ARIS)
- Seção 4.2.8 — Governação de Repositórios (Métodos e convenções, ciclo de vida e qualidade)
- Seção 4.6 — Níveis do Modelo de Processos (Ontologia, nomenclatura e atribuição de informações)
- Seção 4.7 — Alinhamento Arquitetura Negócio (Rastreabilidade das perspectivas de negócio ao colaborador)
- Seção 4.11 — Validação e Simulação de Processos (Executabilidade, tokens e análise de lógica operacional)
