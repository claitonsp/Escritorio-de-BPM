4 Modelação de Processos de Negócio
A modelação em processos de negócio é o conjunto de atividades envolvidas na criação de
representações de um processo de negócio existente ou proposto. A modelação pode fornecer
uma perspetiva ponta a ponta ou uma visão de uma parte dos processos primários, de apoio
ou de gestão de uma Organização.
A modelação em processos de negócio requer um conjunto crítico de capacidades e técnicas
que permitam às pessoas compreender, comunicar, medir e gerir os componentes primários
dos processos de negócio. Para as empresas conscientes do elevado valor dos seus processos
de negócio, a modelação de processos é a atividade fundamental para a gestão da empresa.
Figura 4.1 Fase 2 do Ciclo de Vida do BPM
4.1.1 Utilização de Modelos de Processos
Um modelo é uma representação simplificada de uma coisa, conceito ou atividade. Os modelos
podem ser matemáticos, gráficos, físicos, narrativos, ou uma combinação destes. Os modelos
têm uma vasta gama de aplicações em ambientes corporativos, incluindo:
```
• Organização (estruturação)
```
```
• Descoberta (aprendizagem)
```
```
• Previsão (prognóstico)
```
```
• Medir (quantificar)
```
```
• Explicação (formação, demonstração)
```
```
• Verificação (validação)
```
```
• Controlo (restrições, objetivos)
```
Os processos de negócio podem ser expressos através da modelação em diversos níveis de
detalhe, que vão do elevadamente abstrato ao extremamente detalhado. Um modelo de
processos de negócio totalmente desenvolvido normalmente representará as várias
perspetivas que servem diferentes propósitos.
76
Os modelos geralmente mostram fluxos de trabalho, dependências e sequenciamento de
atividades. Fornecem um nível de visualização para facilitar uma revisão detalhada e uma
avaliação das oportunidades na melhoria dos processos de uma Organização, juntamente com
o apoio à missão da Organização.
4.1.2 Conteúdo dos Modelos de Processos
Um modelo de processos inclui ícones que representam fluxos de trabalho, fluxos de dados,
```
eventos, decisões, portas (gateways) e outros elementos dos próprios processos. Um modelo
```
de processos pode conter ilustrações e informações sobre:
```
• Os ícones (que representam os elementos dos processos) utilizados nas ilustrações
```
• As relações entre os ícones
• As relações dos ícones com o seu ambiente
• Como os ícones representados se comportam ou atuam
4.1.3 Identificação de um Modelo de Processos
Um modelo de processos é uma representação formal dos processos corporativos, não deve
ser confundido com formas mais habituais de representar processos. Ao olhar para uma
ilustração de negócio, por norma utilizamos a seguinte tabela para decidir se ela representa um
modelo de processos ou um diagrama/mapa de processos.
É um Modelo?
Modelo de Processos Diagrama ou Mapa de Processos
1 Convenção padronizada de uma notação Notação ambígua
2 Tão preciso quanto necessário Baixa precisão
3 Mais detalhado Menos detalhado
```
4 Ícones objetivamente definidos e padronizados Ícones (representam componentes dosprocessos) formulados ou vagamente definidos
```
5
Relacionamento de ícones definidos e
explicados em anotações, glossário do modelo
de processos e narrativas de processos
Relacionamentos dos ícones retratados
visualmente
6 Pode representar complexidade apropriada Limitado a representar ideias simples ou umcontexto de alto nível
7 Pode crescer, evoluir, amadurecer Fotografia única
8 Criado com uma ferramenta adequada aoprojeto Criado com ferramentas de desenho simples
9 Pode fornecer uma simulação manual ouautomatizada dos processosDifícil de utilizar até mesmo para a maissimples simulação manual
10
Ligação vertical e horizontal, mostra
relacionamentos entre os processos e
diferentes níveis de processos
Dificuldade de se conectar com diagramas ou
mapas relacionados
11 Utiliza um repositório de modelos relacionadosdentro de um sistema BPMUtiliza um armazenamento simples deficheiros sem relacionamentos próprios
12 Apropriado para qualquer nível de captura deinformação, análise e desenho de processosApropriado para ideias rápidas, certascapturas de informação
```
13 Pode ser importado para um sistema de gestãode processos de negócio (BPMS) Não é adequado para importação de BPMS
```
77
4.1.3.1 Modelos estáticos versus modelos dinâmicos
Os modelos estáticos representam um único estado ou certos elementos de um processo de
negócio. Representações estáticas:
• Estabelecer linhas de base
• Configurar etapas no documento
• Descrever certos estados futuros com base em suposições de metas ou riscos do
processo
• Gerir a mudança
• Conduzir o processo para um nível de maturidade mais avançado
4.1.3.2 Modelos Dinâmicos
Os modelos ou alguns elementos de um modelo, podem ser construídos com características
dinâmicas. Exemplos de modelos dinâmicos incluem aqueles que são projetados para permitir
a interação com um utilizador ou aqueles que mostram o desenvolvimento de uma tendência
ao longo do tempo.
4.1.3.3 Ferramentas de Modelação Dinâmica
A maioria das ferramentas de modelação de alto nível oferecem capacidades de interação
dinâmica. Em alguns casos, a versão mais básica de uma ferramenta de modelação terá
capacidades de simulação apropriadas para a maioria dos projetos de modelação. À medida
que um projeto de modelação progride e requer uma análise mais detalhada, podemos precisar
de capacidades de simulação mais avançadas e até mesmo automatizadas. Se assim for,
devemos considerar e obter as capacidades necessárias do fornecedor da ferramenta que
```
estamos a usar ou garantir um suplemento (add-on) de um parceiro do fornecedor original.
```
4.1.3.4 Combinando Modelos Estáticos e Dinâmicos
Muitas vezes um esforço de modelação beneficia de uma mistura de modelos estáticos e
```
dinâmicos. Por exemplo, ao considerarmos uma futura configuração de processos (processos
```
```
na fase "To-Be"), ao alimentar os dados da amostra através de um modelo de processos
```
dinâmico, podemos ver como o processo real se irá comportar. Por outro lado, o ciclo de um
```
modelo dinâmico pode produzir um conjunto desejável de instantâneos (snapshots) estáticos
```
para ajudar na análise posterior.
4.2 Componentes e Ferramentas do Repositório de Processos
Os profissionais BPM precisam de um local para armazenar e gerir os elementos que lhes
permitam modelar os processos de negócio. Nesta seção, introduzimos o conceito de um
repositório de processos.
4.2.1 Capturar Componentes dos Processos
Os componentes dos processos especificam as propriedades, comportamento, finalidade e outros
elementos dos processos corporativos. Podemos usar ferramentas de modelação para capturar e
catalogar componentes dos processos e as informações associadas a cada componente para
```
organizar, analisar e gerir o portfólio (coleção) de processos de uma Organização.
```
4.2.2 O que é um Repositório?
Em geral, um repositório é um lugar onde as coisas são armazenadas.
78
No nosso contexto, uma ferramenta de modelação de processos de negócio como uma base
```
de dados ou uma Business Process Management Suite (BPMS) é conhecida por repositório de
```
processos de negócio. É o lugar onde os modelos de processos de negócio são armazenados
```
e geridos. Por outras palavras, é um repositório (warehouse) de processos de negócio de uma
```
Organização e mantém um inventário de informações sobre como uma empresa opera.
Além de criar representações gráficas dos processos de negócio, um repositório serve para:
• Armazenar modelos de processos de negócio e artefatos de processos para reutilização
• Criar um local centralizado para acesso às informações dos processos
• Permitir o acesso e a colaboração de múltiplos utilizadores
• Aceder a consultas e a relatórios sobre os conteúdos armazenados
• Verificar a consistência para assegurar que os padrões de modelação são seguidos
• Permitir flexibilidade para mostrar diferentes aspetos dos processos de negócio com base
num público-alvo
Figura 4.2 Repositório de Processos de Negócio
4.2.2.1 Porque é que as Organizações precisam de um Repositório de Processos?
Um repositório de processos cria transparência para uma Organização, o valor chave da Gestão
por Processos de Negócio. Esta transparência ajuda a identificar os processos de negócio da
Organização, coloca limites à sua volta e apoia a gestão de um grande número de processos
de negócio.
A Gestão por Processos de Negócio considera os processos de negócio como ativos. Para os
tratar como ativos, os processos de negócio precisam de ser tornados tangíveis e geríveis.
Capturar processos de negócio na forma de modelos de processos e armazená-los num
repositório de processos torna-os tangíveis e geríveis.
79
Um repositório de processos armazena informações sobre como uma Organização opera.
Quando uma Organização precisa mudar um processo, os profissionais BPM podem aceder
aos modelos de processos de negócio existentes para fazer mudanças. Os repositórios de
processos permitem que executemos casos existentes orientados pelo negócio de forma eficaz
e eficiente. Assim, para grandes mudanças, como fusões e aquisições, podemos modelar os
efeitos na Organização. Os casos para utilização são abordados com detalhe mais tarde.
4.2.2.2 Elementos Chave de um Bom Repositório:
Um bom repositório de processos de negócio é:
• Centralizado. Utilizado como um local central para armazenar informação sobre como
uma Organização gere o seu negócio.
• Utilizado para armazenar artefatos. Armazena artefatos de processos como modelos
de processos, objetos, relacionamentos, atributos, regras de negócio, medidas de
desempenho, entre outros, que descrevem, em vários níveis de detalhe, como uma
Organização executa os seus processos de negócio.
• Software preparado. Implementado através de uma licença, registo de software, tais
como ferramentas de modelação de processos ou Sistemas de Gestão de Processos de
Negócio.
• Sistemático. Orientado a objetos para armazenar o conhecimento dos processos de
forma sistemática, o que permite que elementos individuais do processo sejam utilizados
em todo o repositório para evitar redundância e permitir a análise dos ativos dos
processos de negócio.
• Apta integração. Muitas vezes integra-se com sistemas de gestão documental, soluções
de formação ou portais de conhecimento.
• Governado. Deve ser suportado e gerido por uma estrutura de governação bem definida
com processos e procedimentos de suporte.
• Padrão do ciclo de vida. O ciclo de vida é definido pelas seguintes fases: estratégia,
desenho, construção, manutenção e operação.
• Ciclo de vida gerido. Deve ser gerido durante todo o seu ciclo de vida, o que inclui
```
atividades como a criação de ativos de processos; armazenamento e mudança de
```
```
informações de processos; e validação, divulgação e comunicação do conhecimento dos
```
processos.
• Apoio às iniciativas. Deve ser aproveitado para diferentes iniciativas corporativas, tais
como, a transformação de negócio, a melhoria de processos, implementações ERP,
desenvolvimento de software, gestão de risco e a gestão de portfólios TI.
As secções que se seguem fazem uma abordagem orientada a valor para o repositório de
processos, focando nos resultados desejados. Os cinco pilares chave para projetar um bom
repositório são visualizados na Figura 4.3.
80
Figura 4.3 Principais Pilares de um Bom Repositório de Processos
4.2.2.3 Identificar a Utilização
A métrica chave para um bom repositório é a sua utilização. Um bom repositório não deve ser
medido pelo número de modelos ou pela quantidade de informação armazenada. Um
repositório deve ser medido por:
• Percentagem de pessoas que o utilizam
• Tipos de iniciativas em curso
• Taxa de atualização da informação
Ao projetar um repositório, as principais perguntas a serem feitas são as seguintes:
• Como queremos obter valor do nosso repositório de processos?
• Para que vamos utilizar os modelos?
o Melhorias
o Formação
o Colaboração com parceiros
o Desenvolvimento de software
Estes elementos são descritos em detalhe na secção mais adiante “Identificação de Cenários
de Utilização com Base em Resultados”.
4.2.2.4 Âmbito do Conteúdo
O conteúdo armazenado num bom repositório é projetado em torno de um cenário de utilização
potencial. Um repositório deve armazenar artefatos de processos como modelos de processo,
objetos, relacionamentos, atributos, regras de negócio, medidas de desempenho, entre outros.
Sempre que necessário, um repositório deve ser integrado com outros sistemas de informação
como sistemas de gestão documental, sistemas de formação, portais de conhecimento, entre
outros.
81
Uma decisão chave na sua construção é o que os modelos devem armazenar no repositório.
Geralmente, algumas informações são armazenadas fora do repositório e simplesmente
referenciadas. Os repositórios típicos abrigam os seguintes modelos:
• Modelos de processos
• Modelos organizacionais
• Modelos tecnológicos
• Modelos de decisão
A chave para construir conteúdos num repositório é começar por adicionar conteúdos que
permitam um cenário de utilização. Esta etapa é descrita em detalhes mais adiante em “Âmbito
do Conteúdo de Conhecimento de Processos Corretos”.
4.2.3 Definição de um Formato Padrão
A utilização de um formato padrão fornece uma estrutura forte para um repositório. Muitos
```
grupos como o Object Management Group (OMG), Institute of Electrical and Electronics
```
```
Engineers Standards Association (IEEE-SA) e outros, fornecem padrões como Business
```
```
Process Modelling Notation (BPMN), ArchiMate, Value-Added Chain Diagram (VCD), Event-
```
```
driven Process Chain (EPC), Diagramas SIPOC (fornecedores, entradas, processos, saídas,
```
```
clientes), Decision Modeling Notation (DMN) e diagramas de relacionamento de entidades
```
```
(Entity Relationship Diagrams - ERD), citando apenas alguns.
```
Questões-chave ao definir um formato padrão:
```
(1) Que nível de detalhe é necessário?
```
```
(2) Qual é a arquitetura geral que utilizamos?
```
```
(3) Como manter formas simples para os utilizadores encontrarem e acederem os modelos?
```
Os elementos de arquitetura são descritos com maior detalhe em “Definição de uma Arquitetura
de Conhecimento de Processos”.
4.2.3.1 Selecione as Ferramentas de Gestão de um Repositório
```
Que ferramentas tecnológicas são necessárias para gerir o repositório (warehouse)? Esta
```
tecnologia apoia os processos de montagem e fabrico de forma adequada? É aberta e portanto,
facilmente integrada com ferramentas de implementação, execução e controlo?
4.2.3.2 Finalizar a Governação do Repositório de Processos
O armazenamento de processos requer uma estrutura de governação robusta em seu redor.
As atividades típicas de governação de um repositório incluem:
• Definir quem pode:
o Ver modelos
o Modificar modelos
o Criar novos modelos
o Aprovar modelos
• Criar um processo para criar novos modelos
• Definir processos de manutenção
• Definir um processo para reformar modelos
• Definir um processo com garantia de qualidade, incluindo a aplicação de normas e
```
diretrizes de modelação (parte da manutenção geral)
```
```
• Definir um processo para medir o valor criado através de modelos (com base em cenários
```
```
de utilização)
```
82
• Definir uma linha direta de suporte
• Definir controlos de versão
• Publicar diretrizes de governação
Os elementos de governação são descritos com maior detalhe na subseção “Definição da
Arquitetura do Conhecimento dos Processos”.
4.2.4 Identificação de Cenários de Utilização Baseados em Resultados
O BPM requer processos de captura e documentação no formato de modelos de processos
para criar a transparência necessária. Documentar e reutilizar a informação dos processos é
um conceito central para a implementação de uma “Disciplina BPM”. Um repositório de
processos de negócio é um veículo para armazenar informações de processos num formato
```
dinâmico, fácil de reutilizar e consistente (modelos de processos). O repositório deve ser
```
construído de forma incremental, com as áreas que irão fornecer em primeiro lugar, o maior
valor existente. O repositório pode fornecer valor de várias maneiras. Os cenários típicos de
utilização de um repositório incluem:
• Padronização de processos
• Transformação de processos
• Melhoria dos processos
• Inovação de processos
• Automatização robótica de processos
• Automatização dos fluxos de trabalho
• Implementação de um ERP
• Implementação das melhores práticas
• Gestão da mudança de processos, por exemplo, formação
• Gestão de risco e conformidade
• Colaboração de terceiras partes
• Desenvolvimento de software
```
• Simulação, por exemplo, para análise de gargalos (bottlenecks)
```
• Integração após Fusões e Aquisições
• Execução da estratégia de negócio
• Desenvolvimento do modelo operacional
• Estratégia BPM
A chave para alcançar a transparência é definir cenários de utilização bem descritos e
orientados para os resultados. Em primeiro lugar, identificar um cenário de utilização específico.
Por exemplo, capturar tipos de incidentes e resoluções apropriadas para Assistentes de um
Help Desk. Identificar informações a serem capturadas num cenário de utilização, tais como,
nome, função para a qual o cenário foi projetado, metas e resultados. Em seguida, mapear o
```
cenário de utilização num modelo específico (ver a Figura 4.4). Deve considerar-se como utilizar
```
o repositório num cenário específico e identificar o valor esperado. O objetivo é desenvolver e
manter um conjunto de cenários de utilização baseados em valores que devem:
• Incluir atualizações regulares dos cenários
• Definir como medir o valor entregue
• Estruturar a informação recolhida dos processos dentro de um repositório
83
Figura 4.4 Cenário de Utilização da Amostra
4.2.5 Âmbito do Conteúdo de Conhecimento de Processos Corretos
Um repositório corporativo fornece a estrutura para capturar todo o conhecimento relevante
sobre um processo de negócio a partir de diferentes visões - pessoas, processos e tecnologia.
Entretanto, um processo é mais do que apenas uma função numa Organização. Para entender
a verdadeira natureza de um processo, avaliemos cada processo a partir de cinco dimensões
```
(ver Figura 4.5). Respondamos às seguintes perguntas para capturar todas estas cinco
```
dimensões:
```
(1) Quem está envolvido nos processos (Organização)?
```
```
(2) Quais são as atividades realizadas (funções)?
```
```
(3) Que informação é necessária ou produzida nos processos (dados)?
```
```
(4) Por que precisamos desses processos (entregáveis)?
```
```
(5) Quem está a fazer o quê, através de que tipos de dados, para produzir que entregáveis
```
```
e em que sequência lógica (controlo)?
```
Figura 4.5 A Arquitetura ARIS definida por August-Willem Scheer
84
4.2.5.1 Como Estruturar o Conteúdo
Os processos envolvem informações sobre pessoas, tecnologia, informação e controlo. O
repositório deve capturar essas informações de forma estruturada para que as informações
possam ser arquivadas, referenciadas e reutilizadas em vários cenários de utilização.
Um cenário de utilização, se devidamente definido, fornece uma lista clara de informações
necessárias para a execução. Os arquitetos de processos devem ser cuidadosos com dois
```
fatores:
```
• Nível para ligar as informações
• Localização do armazenamento de informações
Nível
A que nível de decomposição dos processos a informação deve ser ligada? Um repositório de
```
processos típico é dividido (decomposto) em vários níveis para estruturar a informação.
```
```
• Nível 1. Nível mais elevado de processos na empresa (por exemplo, a gestão logística)
```
```
• Nível 2. Um grupo de processos (como a gestão de inventários)
```
```
• Nível 3. Um processo realizado (por exemplo, o recebimento de mercadorias)
```
```
• Nível 4. Principais eventos e tarefas realizadas no processo (por exemplo, impressão de
```
```
um recibo)
```
Tipicamente, cada nó é dividido entre cinco a oito níveis subsequentes. É importante assegurar que
todas as informações capturadas estejam ligadas num nível correto e na decomposição dos processos.
Figura 4.6 Decomposição dos processos
Localização
Outra decisão a tomar é se a informação deve ser armazenada dentro do repositório ou fora dele.
A arquitetura dos processos deve fazer referência ao sistema de gestão de documentos existente,
ao invés de replicar informação. A maioria das ferramentas de repositório podem referenciar fontes
de dados externas ou ligações Internet. Esta integração deve ser cuidadosamente considerada e
utilizada durante a captura dos conteúdos no repositório. Por exemplo, a política de documentos
```
que podem ser ligados à estrutura do repositório, mas armazenados em locais (websites Internet)
```
de equipas existentes e mantidos por equipas operacionais.
85
4.2.5.2 Utilizar Modelos de Referência
Os modelos de referência podem ser um poderoso capacitador para o desenvolvimento do
conteúdo dos repositórios. Os modelos de referência são conhecimentos generalizados,
estruturados e documentados de uma forma que permite a adaptabilidade a situações específicas.
Os modelos de referência amplamente conhecidos da indústria são o SCOR e o PCF.
SCOR. O modelo Supply Chain Operations Reference é uma estrutura mundial líder das
cadeias de fornecimento, que liga processos de negócio, a métricas de desempenho, a práticas
e a capacitação de pessoas numa estrutura unificada. Ver mais informação em www.ascm.org.
PCF. Process Classification Framework da APQC, cria uma linguagem comum para as
organizações comunicarem e definirem os seus processos de trabalho de forma abrangente e
sem redundâncias. As organizações estão a utilizar PCF para apoiar o benchmarking, gerir
conteúdos e realizar outras atividades importantes na gestão de desempenho. Ver mais
informação em www.apqc.org.
Além do SCOR e do PCF, muitos fornecedores de software disponibilizam os seus próprios
modelos de referência de software. Por exemplo, a SAP e as empresas de consultoria
desenvolveram modelos de referência do setor que podem ser alavancados para fornecer a
estrutura certa para o repositório de processos das diversas organizações.
4.2.6 Definir a Arquitetura de Conhecimento de Processos
Os repositórios de processos suportam uma Arquitetura Corporativa e permitem a utilização
fácil e dinâmica do conhecimento dos processos. Um repositório é estruturado para incluir os
seguintes tipos de conteúdo: pessoas, processos e tecnologia. A chave para criar um
```
repositório ideal é definir e concordar sobre a notação chave a ser usada (com base nos
```
```
cenários de utilização identificados) e garantir que ela seja seguida como um padrão em toda
```
a Organização.
A arquitetura do repositório deve fornecer uma ligação crítica entre o desenho e a execução
dos processos. A arquitetura deve atender a vários cenários de utilização. Precisa atingir o
equilíbrio certo entre arte e ciência para que os processos possam ser executados através de
pessoas, com os elementos de dados relevantes, enquanto alavanca a tecnologia para a
execução automatizada.
86
Figura 4.7 Arquitetura de Processos
4.2.6.1 Elementos de Arquitetura de Utilização Comum
As notações são métodos para descrever coisas que utilizam conjuntos específicos de símbolos
e regras. Há uma variedade de notações para processos, pessoas e tipos de conteúdo
tecnológico, cada uma suportada por várias ferramentas. A melhor maneira de usar essas
notações é definir claramente como usá-las para armazenar informações relevantes e
estabelecer verificações para garantir que essas normas sejam seguidas.
Processos
O tipo de conteúdos de processos é coberto por notações detalhadas na tabela seguinte.
Notação Descrição
Business Process
Modelling Notation
```
(BPMN)
```
Uma representação gráfica para especificar processos de negócio
num modelo de processos.
```
Business Process Management Initiative (BPMI) desenvolveu o
```
BPMN, que tem sido mantido pelo Object Management Group desde
a fusão das duas organizações em 2005. A versão 2.0 do BPMN foi
lançada em janeiro de 2011, quando o nome foi adaptado ao Modelo
de Processos de Negócio e a Notação como semântica de
execução, que também foi introduzida juntamente com os elementos
de notação e respetivos diagramas.
Event-driven Process
```
Chain (EPC)
```
A principal notação de modelação de processos dentro do conjunto
de ferramentas ARIS.
O EPC foi desenvolvido em 1992 na Universidade de Saarland com
colaboradores da SAP
Value-Added Chain
```
Diagram (VCD)
```
Um diagrama que mostra um conjunto de atividades numa empresa
que opera num setor específico e que as executa para fornecer um
produto ou serviço valioso para o mercado.
87
Notação Descrição
Diagrama SIPOC Uma ferramenta visual que resume as entradas e saídas de um ou
mais processos em forma de tabela. Utilizada para documentar um
processo de negócio do início ao fim. Os diagramas SIPOC
```
(pronunciados sigh-pock) também são referidos como mapas de
```
processos de alto nível porque não contêm muitos detalhes.
SIPOC significa fornecedores, entradas, processos, saídas, clientes.
Fluxogramas Um tipo de diagramas que representam um algoritmo, fluxos de
trabalho ou processos.
Um fluxograma mostra os passos como formas conectadas por setas
que retratam a ordem dos passos. Os fluxogramas podem ser
usados para ilustrar os caminhos disponíveis para a solução de um
problema. Os fluxogramas também podem ser usados para analisar,
```
desenhar, documentar ou gerir um processo. (Burlton 2013)
```
Pessoas
O tipo de conteúdos para pessoas é coberto por notações detalhadas na tabela seguinte.
Notação Descrição
Organigramas Um diagrama que mostra a estrutura de uma Organização, as suas
funções e hierarquias de relações.
O conceito de organigrama foi desenvolvido pelo engenheiro
escocês-americano Daniel McCallum. Existem outros nomes para
organigrama. Incluem-se os organigramas corporativos, mapas ou
```
gráficos orgânicos, organigram(me) e organograma.
```
Gráfico RACI Descreve as responsabilidades por função para completar as tarefas
ou os resultados de um projeto ou processo de negócio.
```
RACI significa Responsible (responsável), Accountable (contabilizável),
```
```
Consulted (consultado), Informed (informado). Os gráficos RACI são
```
especialmente úteis para esclarecer os papéis e as responsabilidades
em projetos e processos interfuncionais ou departamentais. Um gráfico
RACI também é conhecido por matriz de atribuição de responsabilidades
```
(RAM), matriz RACI, ou por gráfico de responsabilidade linear (LRC).
```
Balanced Scorecard Uma estrutura para medir o desempenho do negócio e um sistema
completo de planeamento estratégico e gestão que as organizações
podem utilizar para identificar a sua visão e a estratégia, definir
objetivos de negócio e alinhar as atividades de negócio acordadas.
```
Um Balanced Scorecard (BSC) permite aos executivos traduzir a estratégia
```
em ações e monitorizar o cumprimento dos objetivos estratégicos. A
metodologia BSC faz utilização de um gráfico simples conhecido por mapa
estratégico para mostrar uma conexão lógica, de causa-efeito, entre os
objetivos estratégicos. Desenvolvido por Kaplan e Norton.
88
Tecnologia
O tipo de conteúdos relativo a tecnologia é coberta por notações em seguida detalhadas.
Notação Descrição
Modelo de Decisão e
```
Notação (DMN)
```
DMN significa Decision Model and Notation. É uma abordagem padrão
para descrever e modelar decisões repetíveis para assegurar que os
modelos de decisão sejam interoperáveis entre as organizações.
Publicado pelo Object Management Group.
Diagrama de relações
```
entre entidades (ERD)
```
ERD significa Entity Relationship Diagram. Mostra as relações dos
objetos numa base de dados.
```
Um modelo de entidade-relacionamento (modelo ER) descreve
```
coisas interrelacionadas de interesse num domínio específico do
conhecimento. Um modelo ER é composto por tipos de entidades
```
(que classificam os objetos de interesse) e especifica as relações
```
que podem existir entre instâncias desses tipos de entidades.
Desenvolvido por Peter Chen.
ArchiMate Uma linguagem de modelação aberta e independente de Arquitetura
Corporativa que suporta a descrição, análise e visualização da
arquitetura, com e entre domínios de negócio de forma inequívoca.
Desenvolvido pelo Open Group. Pronuncia-se AR-ki-mayt.
UML UML significa Unified Modelling Language. É uma linguagem de
modelação de desenvolvimento de utilização geral no campo da
engenharia de software que fornece uma forma padrão para
visualizar o desenho de um sistema. Desenvolvida pela OMG.
Linguagem de
Modelação de
```
Sistemas (SysML)
```
SysML significa Systems Modelling Language. Uma linguagem de
modelação e de utilização geral para engenharia de sistemas.
SysML suporta a análise, projeto e verificação de sistemas complexos
incluindo hardware, software, informação, pessoal, procedimentos e
instalações numa notação gráfica. Desenvolvido pela OMG.
Diagrama de fluxo de
```
dados (DFD)
```
DFD significa Data Flow Diagram. É uma representação gráfica do
fluxo de dados através de um sistema de informação, modelando os
seus elementos de processos.
Um DFD é frequentemente utilizado como um passo preliminar para
criar uma visão geral do sistema, sem entrar em grandes detalhes,
que podem ser posteriormente elaborados. Os DFDs também
podem ser usados para a visualização do processamento de dados
```
(desenho estruturado).
```
Os profissionais BPM devem definir uma notação padrão em toda a Organização para os vários
tipos de informação capturada. Uma notação correta garante que toda a informação dos
processos possa ser alavancada para fornecer um resultado padrão. A utilização da tecnologia
em processos permite que a informação armazenada em várias partes da Organização pode
ser trabalhada num contexto ponta a ponta para realizar os objetivos e concretizar a estratégia.
89
4.2.7 Seleção do Repositório e da Ferramenta de Modelação Corretos
Selecionar uma ferramenta é normalmente o primeiro passo que uma Organização dá na sua
jornada BPM. Dada a panóplia de ferramentas disponíveis no mercado, precisamos de definir
uma estratégia para selecionar as ferramentas certas. A melhor prática é desenvolver cenários
de utilização e em seguida, selecionar as ferramentas com base nos recursos necessários para
implementar esses cenários de utilização.
4.2.7.1 Tipos de Ferramentas de Repositório
Existem três tipos de plataformas BPM:
• Plataformas básicas BPM
```
• Business Process Management Suite (BPMSs)
```
```
• Suítes Inteligentes de Gestão por Processos de Negócio (iBPMS)
```
Uma plataforma BPM inclui minimamente:
• Um processo de negócio, gráfico e/ou capacidade para modelação de regras
• Um registo/repositório de processos para tratar os metadados de modelação
• Um motor para execução de processos
```
• Um motor de gestão do sistema ou um motor de regras (ou ambos)
```
As plataformas BPM podem ajudar os arquitetos de soluções e os detentores de resultados de
negócio a acelerar o desenvolvimento de aplicações, transformar os processos de negócio e
digitalizar os processos para explorar momentos de negócio, fornecendo capacidades que
gerem diferentes aspetos do ciclo de vida dos processos de negócio. A tabela seguinte lista as
ferramentas que fornecem suporte, a repositórios BPM. A lista não é abrangente e cada
ferramenta fornece pontos fortes únicos como uma ferramenta de repositório de processos.
Nome Criador Ligação Internet
ActiveVOS Informatica http://www.activevos.com
Activiti Modeler Alfresco e a
comunidade
Activiti
```
https://www.activiti.org
```
```
ADONIS (software) BOC Info. Tech.
```
Consulting AG
```
https://uk.boc-group.com/adonis
```
Appian Appian https://www.appian.com/platform/bpm-suite
ARIS Express Software AG http://www.ariscommunity.com/aris-express
Aura Portal Aura https://www.auraportal.com
Bizagi Bizagi http://www.bizagi.com/en
BiZZdesign
Architect
BiZZdesign http://www.bizzdesign.com/enterprise-studio
Bonita BPM Bonitasoft http://www.bonitasoft.com
Enterprise
Architect
Sparx Systems http://www.sparxsystems.com
IBM BlueWorks Live IBM https://www.blueworkslive.com/home
IBM Rational
System Architect
IBM https://teamblue.unicomsi.com/products/system-architect
iGrafx Process iGrafX http://www.igrafx.com/products/process-modeling-
analysis/process
Imixs-BPMN Imixs http://www.imixs.org/www.imixs.org
90
Nome Criador Ligação Internet
K2
BLACKPEARL
K2 https://www.k2.com/products/k2-blackpearl
MagicDraw No Magic https://www.nomagic.com
Microsoft Visio Microsoft www.visio.microsoft.com
Modelio Modeliosoft https://www.modelio.org
Oracle Business
Process
Management
Oracle http://www.oracle.com/us/technologies/bpm/overview/index.html
Pegasystems Pega BPM https://www.pega.com
Signavio
Process
Manager
Signavio https://www.signavio.com
Software Ideas
Modeler
Dusan Rodina www.softwareideas.net
SYDLE SEED
Community
SYDLE
Systems
```
http://www.sydle.com/bpms
```
yEd yWorks http://www.yworks.com/products/yed
4.2.7.2 Como Selecionar a Ferramenta Certa para a Organização
Os fatores chave a considerar ao selecionar as ferramentas adequadas à Organização são:
```
(1) As capacidades da ferramenta para suportar os cenários de utilização atuais que a
```
Organização planeia implementar imediatamente
```
(2) A capacidade da ferramenta em se adaptar aos cenários de utilização planeados que se
```
gostaria de desenvolver no futuro
```
(3) A capacidade da ferramenta em suportar notações padrão para que, se e quando
```
necessário, possamos migrar o conteúdo existente para outra ferramenta
Uma visão clara de uma agenda de processos e cenários de utilização de processos ajuda a
garantir uma seleção de ferramentas bem-sucedida.
4.2.8 Governação de Repositórios
Nesta secção, cobrimos os tópicos relacionados com a governação de um repositório de
processos. Existem dois conceitos centrais relacionados com a governação de repositórios:
• Governação de processos e governação de repositórios são interdependentes
• A governação de um repositório depende de métodos e convenções que mapeiam a
arquitetura de uma Organização.
4.2.8.1 Governação de Processos
Os termos governação de processos, governação por processos de negócio e governação BPM
são usados de forma interoperável.
A governação de processos orienta a execução da Gestão por Processos de Negócio. A
governação de processos envolve todos os processos de uma Organização, determinando o
que deve ser feito, quem o faz e como deve ser feito para manter ou melhorar o desempenho.
91
De acordo com Rafael Paim e Raquel Flexa, a governação de processos pode incluir:
As atividades de formulação, introdução, controlo e revisão de políticas, diretrizes, regras,
procedimentos, instrumentos e tecnologias que orientam as práticas de gestão por processos
no interior da Organização. Também inclui as formas de Organização, integração, colaboração
e comunicação entre as diversas iniciativas de gestão por processos dentro da empresa. Os
objetivos da governação de processos são a cadeia de valor da Organização, a metodologia de
gestão por processos e as regras, papéis e responsabilidades que estruturam e organizam a
forma como a gestão de processos funciona.
Um repositório de processos permite uma governação de processos de diversas formas:
• Prioritização de processos. Fornece através de uma hierarquia de processos, um
elemento crucial para a prioritização de processos, é um bloco de construção do
desenvolvimento da estratégia de processos de uma Organização.
• Propriedade de processos a vários níveis. Fornece com a sua transparência sobre a
hierarquia de processos, a espinha dorsal para a estruturação da propriedade de processos
multinível.
• Indicadores de desempenho de processos multiníveis. Fornece com a sua transparência
sobre a hierarquia de processos, a espinha dorsal para a estruturação de indicadores de
desempenho de processos multiníveis.
```
• Gestão do ciclo de vida. Suporta a gestão (criação, atualização, divulgação) de ciclos de
```
vida para modelos de processos de negócio e modelos de informação relacionados.
As definições de conteúdo e formato acordadas, que estão basicamente a definir uma
Arquitetura de Negócio, precisam ser disponibilizadas no repositório e documentadas num
documento de métodos e convenções.
4.2.8.2 Métodos e Convenções Relacionadas com a Arquitetura de Negócio
Um documento de métodos e convenções contém diretrizes que incluem:
• Notações de modelação a serem aplicadas por nível de hierarquia de processos
• Tipos de objetos utilizados por notação de modelação
• Tipos de conectores utilizados por notação de modelação
• Símbolos utilizados por tipo de objeto
• Convenções de nomes para modelos e objetos de informação
• Apresentação de faixas e conteúdos para modelos de informação
Os aspetos específicos documentados do repositório incluem:
• Uma estrutura de pastas pretendida
• Convenções de nomenclatura para a estrutura das pastas
• Estado dos modelos de informação e os seus impactos
• Autorizações por função de utilizador
• Verificações semânticas
Estes métodos e convenções são a base da governação de repositórios e ganharão vida com
a criação, atualização e divulgação dos processos de negócio. Num sistema que seja aplicável,
os benefícios são realizados com a execução de uma Gestão por Processos de Negócio.
A criação de um documento de métodos e convenções pode ser fastidiosa e demorada, apesar
de seguir o princípio orientador de manter as coisas simples. No entanto, este documento é
crucial para fornecer orientação aos membros existentes e aos novos membros da Organização
BPM. É também a base das auditorias de repositórios em processos de negócio.
92
4.2.8.3 Governação dos Processos e Governação dos Repositórios
A governação de processos e a governação dos repositórios sobrepõem-se, onde quer que os
papéis envolvidos na criação, atualização e divulgação de processos mexam com o repositório.
Exemplo de mudança de um modelo de processos
O exemplo seguinte ilustra a relação entre governação de processos e a governação de repositórios.
• Um modelo de processos que cria ordens de vendas já está capturado no repositório.
• O modelo dos processos é vivo.
• Uma pequena mudança é necessária.
• Pessoas envolvidas:
```
o Dono do processo (tem acesso de leitura, pode comentar).
```
```
o Modelador do processo de ordens de vendas (tem acesso de escrita, pode mudar).
```
```
o Arquiteto do processo (tem acesso de leitura, pode comentar).
```
Como a mudança é feita?
```
(1) O Dono do Processo solicita a mudança ao modelador.
```
```
(2) O Modelador cria uma versão não publicada do modelo de processo existente e marca
```
o status como rascunho.
```
(3) O Modelador pede ao Arquiteto para rever o rascunho (via e-mail ou através de uma ferramenta).
```
```
(4) Comentários do Arquiteto sobre o processo, indicam a necessidade de ajustes.
```
```
(5) O Modelador recebe um alerta de comentários.
```
```
(6) O Modelador ajusta o modelo do processo e solicita a aprovação do Arquiteto.
```
```
(7) Comentários do Arquiteto, indicam a aprovação do modelo do processo ajustado.
```
```
(8) O Modelador e o Proprietário recebem alerta de comentários.
```
```
(9) O Modelador define o modelo do processo para um estado aprovado pelo Arquiteto de
```
processos de negócio.
```
(10) O Dono do Processo comenta a aprovação do modelo do processo ajustado.
```
```
(11) O Modelador recebe um alerta com comentários.
```
```
(12) O Modelador define o modelo do processo para um estado aprovado pelo Dono do Processo.
```
```
(13) O Modelador publica o rascunho do modelo, tornando-o público e como está o novo processo.
```
```
(14) O Dono do Processo implementa o processo revisto nas atividades de negócio diárias.
```
A governação do repositório tem que assegurar que o seu conteúdo não esteja comprometido.
Esta governação de gestão de conteúdos é da responsabilidade do líder BPM da Organização
e é implementada pelo gestor da ferramenta de repositórios. Responde às questões de quem
pode ver, modificar, criar, aprovar e retirar modelos de processos de negócio, definir papéis e
responsabilidades e os respetivos processos.
Além disso, os processos de suporte precisam ser desenhados e implementados. Exemplos de
processos de suporte incluem:
• Um processo de auditoria regular para garantir que as pessoas adiram às diretrizes ou ao
documento de métodos e convenções
• Um processo de controle de versão, que controla quando a próxima versão pode ser publicada
• Um processo para medir o valor criado através do repositório de processos
• Um processo para a publicação de todas as diretrizes de governação
• Um processo para obter ajuda
93
Há também aspetos técnicos na governação de repositórios. Exemplos de considerações técnicas:
• Cronograma de backup da base de dados
• Processo para mover o conteúdo do repositório de processos para outra ferramenta
• Processo para mover o conteúdo de outra ferramenta para o repositório de processos
• Processo para a criação de símbolos e objetos personalizados
Estes aspetos técnicos de governação são da resposabilidade do gestor da ferramenta de
repositórios.
4.2.9 Monitorização da Utilização e Expansão dos Repositórios
Historicamente, muitas iniciativas de modelação de processos de negócio passaram por um
rigoroso escrutínio no que diz respeito à perceção do valor criado. Um trabalho extensivo foi
dedicado à criação de modelos de processos, mas estes quase não foram utilizados ou não
foram utilizados de todo. Este padrão contribuiu para desacreditar a modelação de processos
de negócio e a utilização de repositórios de processos.
A utilização de casos durante a fase de planeamento garante que os modelos e os repositórios
de processos forneçam valor para a Organização. Para assegurar que os modelos de processo
sirvam o seu propósito, a utilização deve ser monitorizada. Boas medidas para uma utilização
de processos incluem:
• Número de modelos de processos acedidos num determinado período de tempo
```
• Distribuição do acesso aos modelos de processos por áreas de processos (esta
```
```
distribuição deve ser aproximadamente uniforme)
```
• Percentagem de utilizadores de uma Organização que utilizam o repositório
• Número de diferentes tipos de iniciativas permitidas pelo repositório
• Taxa de atualização de informações no repositório
A maioria destas medidas pode ser calculada eletronicamente. No entanto, a realização regular
```
(uma vez por ano) de pequenas pesquisas relacionadas com o repositório ajudará a medir o
```
pulso da Organização e a identificar outros requisitos de negócio.
4.2.10 Melhores Práticas de Repositórios
As melhores práticas para a construção de um repositório robusto abordam cinco elementos:
valor, conteúdo, formato, governação e ferramentas e usabilidade.
1. Valor: Cenários de utilização
• Cenários de utilização identificados e com suporte de repositório definidos
• Atualização regular dos cenários de utilização
• Medição do valor entregue através do repositório
2. Conteúdo
• Conteúdo relevante para cenários de utilização de processos específicos disponíveis
• Relatórios apropriados disponíveis no repositório
3. Formato
• Dez ou menos métodos da modelação em utilização
• Método da modelação padrão utilizado em toda a Organização
• Arquitetura geral do processo definida até ao nível três
• Normas e diretrizes da modelação definidas e aplicadas
94
4. Governação
• Processos de governação de repositórios para a criação, manutenção, reforma de
modelos definidos e implementados
• Garantia de qualidade em vigor, medida pelo menos quatro vezes por ano
• Qualidade dos modelos e valor entregue medido
• Número acessos ao repositório por mês medido e consistente com os cenários de utilização
definidos
• Diretrizes de governação do repositório definidas e publicadas
5. Ferramentas e Usabilidade
• Ferramenta do repositório disponível através da nuvem
• Relatórios e configurações em vigor e atualizados com base em cenários de utilização
• Suporte local através de uma linha direta
• Outras ferramentas relevantes conectadas e abordagem de governação apropriadamente definida
4.2.11 Métricas Repositórias
Um bom repositório deve ser medido de acordo com:
```
(1) Percentagem de utilizadores numa Organização que utilizam o repositório
```
```
(2) Diferentes tipos de iniciativas viabilizadas pelo repositório
```
```
(3) Taxa de atualização de informações no repositório
```
Uma Gestão por Processos orientada por valores, se aplicada corretamente, garante o desenvolvimento
e a utilização otimizada do repositório de processos. Uma utilização otimizada significa usar os padrões
corretos, a governação da ferramenta e o foco em cenários de utilização acordados.
4.3 Capacidades das Ferramentas de Modelação de Processos
```
As ferramentas de modelação variam no número e tipos de componentes (e informações) que
```
podem capturar, o que afeta o tipo e nível da análise de desempenho dos processos que
podemos conduzir. Os projetos de modelação de processos frequentemente crescem em
âmbito e complexidade. Devido a isto, selecionar uma ferramenta mais poderosa do que a
necessária no início de um projeto de modelação, genericamente faz mais sentido.
```
A tabela seguinte apresenta alguns componentes de processos (e informações relacionadas)
```
que podemos capturar nos modelos de processos.
Exemplos de Componentes de Processos e Dados nos Modelos de Processos
Entradas e saídas Padrões de chegada e distribuições
```
Eventos e resultados Custos (diretos e indiretos)
```
Valor acrescentado Regras de entrada
Papéis e organizações Regras de saída
Dados e informações Regras de ramificação
Probabilidades Regras de junção
Fila de espera Tempo de trabalho e de manutenção
Tempo de transmissão Ligação
```
Tempo de espera Servidores (número de executantes
```
```
disponíveis para executar tarefas)
```
95
4.4 O Propósito da Modelação de Processos
Como uma atividade de trabalho, o propósito da modelação de processos é criar uma
representação dos processos que os descreva com precisão e o suficiente para as tarefas em
questão. Por este motivo, o nível de detalhe a modelar e o tipo específico de modelo é baseado
no que é esperado do projeto de modelação. Um diagrama simples pode ser suficiente para
um projeto, enquanto um modelo totalmente desenvolvido pode ser necessário para outro.
4.4.1 Modelação de Processos é um Meio para os Fins do Negócio
Os modelos de processos são um meio para:
• Gerir os processos da Organização
• Analisar o desempenho dos processos
• Definir mudanças
Os modelos de processos são ferramentas que podem expressar um estado organizacional
alvo ou especificar os requisitos de recursos para permitir operações corporativas eficazes, tais
como, pessoas, informação, instalações, automatização, finanças e energia. Um modelador de
processos deve estar alinhado com o nível de detalhe definido para o projeto, com base no
âmbito e na linha do tempo.
A tabela seguinte descreve diferentes pontos de vista e algumas razões para a modelação de processos.
Ponto de Vista Motivos para a Modelação de Processos
Comunidade de
negócio
• Poupar dinheiro – cortar custos
• Melhorar a qualidade – reduzir desperdícios
• Reduzir o tempo de produção
• Aumentar a produtividade
• Reduzir o tempo de entrega dos pedidos - satisfação do Cliente
• Orientar os problemas para corrigir esses problemas
• Capturar o conhecimento do executor - evitar a quebra de processos
• Padronizar o desempenho dos colaboradores
Profissional de
processos
corporativos
Resolve um problema corporativo por:
• Descrever o processo de forma tão precisa e suficiente quanto necessário
para a tarefa que tem em mãos
• Comunicar claramente o processo ao público pretendido
• Selecionar o nível de detalhe e o tipo específico do modelo com base em:
o O que se espera do projeto de modelação
o Um problema de negócio que precisa de ser corrigido
o Fornecer uma linha base para a melhoria contínua
Organizacional
Os modelos de processos são meios para:
• Gerir os processos da Organização
• Analisar o desempenho dos processos
• Definir mudanças
Os modelos de processos podem:
• Expressar um estado de negócio alvo
• Especificar requisitos de recursos para permitir operações eficazes:
o Pessoas
o Informações
o Instalações
o Automatização
o Finanças
o Energia
96
Ponto de Vista Motivos para a Modelação de Processos
Análise e melhoria
do desempenho
• Aumentar a clareza ou compreensão de um processo
• Auxiliar na formação
• Avaliar o desempenho em relação aos padrões e requisitos de conformidade
• Compreender o desempenho do processo sob cargas variáveis ou outras mudanças
• Analisar oportunidades potenciais de melhoria
• Desenvolver um novo processo ou uma nova abordagem ao processo existente
• Facilitar a comunicação e a discussão
• Documentar um esforço na determinação de requisitos
• Aumentar a capacidade de responder a novas restrições externas, tais como,
regulamentações governamentais ou regionais
Negócio gerido por
processos
• Ponto de partida central para impulsionar o entendimento coletivo e o
consenso entre as partes interessadas nos processos
• Economizar custos, tempo e esforço sobre conjeturas e experimentação com
processos reais
• Ajudar os executantes de processos de um departamento a ver como as suas
entradas e saídas afetam o desenvolvimento de valor através das áreas funcionais
• Pode resultar localmente na tomada de decisão que maximiza o valor nos
processos em vez de localmente produzir otimização
• Identifica a conformidade e/ou atividades auditáveis
4.5 Notações em Modelação de Processos Comumente Utilizadas
As notações existem em muitas disciplinas e são uma componente importante da modelação
em processos de negócio.
Notação.
Um conjunto padronizado de símbolos e regras que orientam o que os símbolos representam.
Por exemplo, uma notação musical inclui símbolos universalmente reconhecidos para notas e
claves. Similarmente, uma notação em modelação de processos de negócio inclui ícones
```
(figuras) e conectores que ajudam a mostrar as relações entre os vários componentes da vida
```
real de um processo de negócio.
Há uma série de padrões e técnicas de modelação e notação em utilização atualmente.
```
Selecionar a melhor abordagem a partir das opções disponíveis pode ser difícil; no entanto,
```
selecionar uma abordagem que siga padrões e convenções bem conhecidas oferece vantagens
com abordagem abrangente. Por exemplo, a escolha de uma abordagem que siga normas e
convenções bem conhecidas oferece vantagens com uma larga utilização:
• Membros da comunidade empresarial, profissionais alinhados a processos corporativos
e profissionais de TI têm um conjunto de símbolos, linguagem e técnica comum através
da qual se podem comunicar.
• Os modelos de processos resultantes são consistentes na forma e no significado, o que simplifica
o desenho, a análise e a medição, ao mesmo tempo que permitem a reutilização dos modelos.
• A equipa pode importar e exportar modelos de processos entre várias ferramentas.
• Com algumas ferramentas, a equipa pode transformar a notação em modelação numa
linguagem de execução.
Existe uma tendência de crescimento significativo em algumas destas características,
nomeadamente, a facilidade de importação e a compatibilidade com os motores de execução.
97
4.5.1.1 Orientações para a Seleção de uma Notação para Modelação
Esta secção fornece uma breve descrição de algumas das notações para modelação frequentemente
encontradas. Notemos que os exemplos fornecidos são apenas uma faceta gráfica dos sistemas de
notações apresentados. Em ambientes modernos de modelação, pode haver muitos níveis e atributos
detalhados que ajudam a descrever mais detalhadamente um processo de negócio.
Ao escolher uma notação para modelação, consideremos uma combinação única de circunstâncias
na Organização. Rever as notações para modelação na tabela seguinte pode ajudar a fazer a
seleção. E tenhamos em mente que às vezes é apropriado usar notações diferentes para diferentes
estágios de um projeto de modelação ou para diferentes níveis ou tipos de modelos.
Notações para Modelação de Processos Geralmente Utilizadas
Notações para Modelação Descrição
Business Process Model and
```
Notation (BPMN) 2.0
```
```
Norma criada pelo Object Management Group; 103 ícones, úteis para
```
apresentar um modelo a múltiplos públicos.
Event-driven process chain
```
(EPC)
```
Desenvolvido no âmbito da arquitetura ARIS, considera os eventos
```
como estímulos (triggers) ou resultados de uma etapa do processo;
```
útil para a modelação de conjuntos complexos de processos.
Flowcharting
Originalmente aprovado como uma norma ANSI, inclui um conjunto
```
muito simples e pequeno de símbolos que não são padronizados;
```
facilita a captura rápida do fluxo de processos.
```
Swim lanes Não é uma notação distinta, mas uma adição à maioria dos outrossistemas de notação; ajuda a identificar handoffs num processo.
```
Unified Modeling Language
```
(UML)
```
Mantido pelo Object Management Group, é um conjunto padrão de
técnicas com diagramas cuja notação é principalmente utilizada para
descrever os requisitos dos sistemas de informação.
Value stream mapping
Utilizada a partir do Lean Manufacturing é um conjunto muito simples
```
de símbolos; usado para adicionar custos de recursos e elementos de
```
tempo de processos a um modelo de processos serve para retratar
claramente a eficiência dos processos.
```
4.5.2 Modelo e Notação em Processos de Negócio (BPMN) 2.0
```
O Business Process Model and Notation 2.0 é um padrão criado pela Business Process
```
Management Initiative, entretanto fundido com o Object Management Group (OMG), um grupo
```
que define padrões de sistemas de informação.
O BPMN tem uma aceitação crescente como padrão sob várias perspetivas, o que resultou na
sua inclusão em várias das ferramentas de modelação mais amplamente utilizadas. Fornece um
conjunto robusto de símbolos para a modelação de diferentes aspetos dos processos de
negócio. Como a maioria das notações modernas, os símbolos descrevem relações definidas,
tais como, fluxos de trabalho e ordem de precedência. A Figura 4.8 mostra um exemplo de um
diagrama de processos em BPMN.
Principais Características
```
• Versão 2 (BPMN 2.0) representa uma significativa maturação e solidificação da notação
```
• Mais de 100 ícones no total, organizados em conjuntos descritivos e analíticos para
atender às diferentes necessidades dos utilizadores
• Notação muito precisa que indica:
98
o Eventos iniciais, intermediários e finais
o Atividades e fluxos de mensagens
o Comunicações intracorporativas e colaboração interempresarial
o Atividades e fluxos de dados
Quando usar
• Para apresentar um modelo de um processo a múltiplos conjuntos de audiências
• Para simular um processo de negócio com um motor de processos
• Para executar um processo
Vantagens
```
• Utilização e compreensão generalizados; considerado por muitos como sendo o padrão
```
de facto nos EUA e noutros países a nível global
• Utilização significativa no Departamento de Defesa dos EUA e outras entidades
governamentais
• Uma das notações mais poderosas e versáteis para identificar restrições de processos
Desvantagens
• Requer formação e experiência para usar corretamente todo o conjunto de símbolos
• É difícil ver as relações entre vários níveis de um processo
• Diferentes ferramentas de modelação podem suportar diferentes subconjuntos da notação
• As origens das tecnologias de informação inibem a sua utilização com os membros da
comunidade empresarial de algumas organizações
Figura 4.8 Diagrama de um Processo Simples em BPMN
Para mais informações, consultar:
• O site dedicado ao Object Management Group em www.bpmn.org
• Ficheiros de ajuda e amostras com modelos na maioria das principais ferramentas de modelação
99
```
4.5.3 Zonas de Navegação (Swim Lanes)
```
As Swim Lanes não são uma notação distinta, mas sim uma atribuição/distribuição de
responsabilidade notacional útil, além da maioria dos outros sistemas de notação. São
frequentemente incorporadas no BPMN, EPC, UML, ou simples fluxogramas, como um meio de
```
definir o executante responsável pela realização de uma atividade. As vias (filas) são geralmente
```
representadas como longos retângulos verticais ou horizontais ou, por vezes, como simples
linhas ou barras, assemelhando-se às marcações de um canal, zona de navegação ou pistas
numa competição de natação.
A organização do fluxo de atividades e tarefas através destas filas facilita a visualização das
```
transferências no trabalho. A Figura 4.9 mostra um exemplo (usado em BPMN) de uma piscina
```
com três faixas.
Principais Características
• As zonas de navegação representam executantes ou combinações de executantes
• As zonas de navegação podem indicar papéis, organizações, sistemas, ou qualquer outra
entidade ou combinação de desempenhos.
Quando usar
• Para distinguir claramente em que ponto a responsabilidade pelo desempenho muda
• Para aumentar a compreensão entre as partes interessadas no processo
Vantagens
• Ajuda na colaboração como executantes de processos, ser capaz de distinguir os seus
papéis em relação aos outros
• Define claramente os pontos de entrega num processo
• Pode descrever fluxos de precedência operacional, material e mensagens
Desvantagens
• Torna-se complexo em áreas onde a responsabilidade pelo desempenho é exercida
conjuntamente
• Em certos casos, pode preservar uma mentalidade de silo num processo
Figura 4.9 Diagrama de uma Swim Lane Tradicional de Bruce Silver
Para mais informações, consultar:
100
```
• O site Agile Modeling (AM) em
```
```
http://www.agilemodeling.com/style/activityDiagram.htm#Swimlanes
```
• Ficheiros de ajuda para a maioria dos principais ambientes de modelação
4.5.4 Fluxograma
O fluxograma é amplamente utilizado. É baseado num conjunto simples de símbolos para
operações, decisões e outros elementos primários do processo. A notação para os fluxogramas
mais comuns foi aprovada como padrão ANSI em 1970 para representar fluxos de sistemas.
Outras notações de fluxogramas têm sido usadas por engenheiros industriais há décadas e
usam símbolos e layouts diferentes para mapeamentos industriais específicos. Por exemplo, o
fluxograma é usado para descrever o fluxo de materiais, papéis e trabalho, colocação de
máquinas, análise de saídas e entradas nos centros de expedição. As figuras 4.10 e 4.11, que
usam símbolos comuns, ilustram o quanto os símbolos de diagramas de fluxo podem variar na
aparência de uma Organização para outra.
Principais Características
• Utilizado com ou sem pistas de natação
• Muitas variações para diferentes fins
• Conjunto central simples de símbolos facilmente reconhecíveis
• Precursor de muitas notações mais modernas
Quando usar
• Para capturar rapidamente o fluxo do processo de partilha onde os detalhes não
requerem documentação
• Para iniciar um projeto de modelação onde o financiamento não está disponível para
ferramentas completas
• Para desenvolver diagramas altamente detalhados para utilização na codificação do sistema
tradicional
Vantagens
• Bem compreendido pelos engenheiros de software e de sistemas
• Em alto nível, ajuda a construir consensos
• Adequado para ilustrações de caminhos positivos
• Económico na sua utilização
• Suportado por ferramentas de um nível inferior, incluindo gráficos de utilização geral e
ferramentas de visualização
Desvantagens
• Apesar da influência das normas ANSI, há muitas variações
• Pode ser impreciso quando usado para retratar processos de negócio complexos
• Deve desenvolver um léxico específico de símbolos, ícones e padrões de formatação para
cada projeto para manter a consistência e a legibilidade entre os modelos
• Os objetos não têm um conjunto robusto de atributos descritivos
• Os modelos construídos são planos, exigindo a utilização de símbolos de conector para
mostrar onde os segmentos de processos continuam
• Geralmente não é considerado robusto o suficiente para a captura de processos complexos
101
Figura 4.10 Exemplo de um Fluxograma
Figura 4.11 Outro exemplo de Fluxograma
Para mais informações, consultar:
• Normas ANSI aplicáveis
• Textos introdutórios de cursos de programação e de computadores
```
4.5.5 Cadeia de Processos Orientada por Eventos (EPC)
```
As cadeias de processos guiadas por eventos variam de muito simples a muito complexas. O
EPC descreve eventos como acionadores ou resultantes de uma etapa do processo,
conhecidos por função. Assim, o fluxo é normalmente um evento com função de evento. O EPC
depende fortemente de operadores lógicos conhecidos por regras. Os objetos de regra básica
são AND, OR e Exclusive OR. Esses objetos de regra expressam decisões, testes, paralelismo
e convergência no fluxo do processo. Um EPC simples define apenas os objetos como setas
que definem as relações entre eles. A Figura 4.12 mostra um exemplo de uma cadeia de
processos orientada por eventos.
102
Características principais
• O método EPC foi desenvolvido no âmbito da arquitetura ARIS pelo Professor Wilhelm-
August Scheer da Universidade de Saarland no início de 1990.
• Pode ser usado para modelação, análise e redesenho de processos de negócio
• Pode ser melhorado através de Swim Lanes verticais ou horizontais
• Conjunto central simples de símbolos facilmente reconhecíveis, ampliado com um grande
número de objetos opcionais ou de propósito especial
• Algumas ferramentas empregam um sistema de filtros para limitar ou controlar o
subconjunto de notação a ser utilizado
Quando usar
• Ao modelar conjuntos complexos de processos com muitas interfaces e sub-modelos de
processos
• Para preencher detalhes de processos abaixo dos níveis normalmente abordados por
algumas estruturas de Arquitetura Corporativa
Vantagens
• Amplamente utilizado e compreendido na Alemanha e também noutros países europeus,
especialmente em empresas multinacionais.
• Presença substancial no Departamento de Defesa dos EUA e noutras grandes empresas
• Um EPC devidamente construído pode ser lido como um conjunto de frases
• Pode ser usado como meio de colaboração entre grupos de especialistas funcionais que
têm pouca experiência com modelos
• É possível melhorar os modelos através da utilização de muitos tipos de objetos opcionais
que descrevem os executantes, os sistemas de apoio, as informações ou Swim Lanes de
atividades relacionadas
• Algumas ferramentas podem traduzir os artefatos entre as notações EPC e BPMN com
uma fiabilidade crescente
• É uma das mais poderosas e versáteis ferramentas para a identificação de restrições de
processos
Desvantagens
• Menos predominante que o BPMN e fluxogramas em projetos de modelação nos EUA
• As equipas de modelação devem ser disciplinadas na utilização da notação para evitar
possíveis lacunas lógicas
• A implementação mais forte é limitada à família ARIS através de ferramentas de
modelação de processos
103
Figura 4.12 Cadeia de Processos Dirigida por Eventos
Para mais informações, consultar:
• O site ARIS em ariscommunity.com
• No site da Software AG em www.softwareag.com
```
4.5.6 Linguagem de Modelação Unificada (UML)
```
A notação UML fornece um conjunto padrão de técnicas com diagramas e notações
principalmente para descrever os requisitos dos sistemas de informação. Enquanto o UML é
utilizado principalmente para análise e projetos de sistemas, algumas organizações também
usam diagramas de atividades UML para modelação de processos de negócio. O UML é
```
mantido pelo Object Management Group (OMG), uma entidade que define padrões para a área
```
dos sistemas de informação.
Principais Características
• Em rigor é um conjunto de nove ou mais técnicas com diagramas e notações relacionadas
• Descreve relações lateriais muito complexas entre pais e filhos
• O conjunto de símbolos varia um pouco, dependendo do tipo de modelo
• Um subconjunto importante, o SysML, é frequentemente utilizado para descrever
sistemas e sistemas de sistemas
104
Quando usar
• Para desenvolver casos relacionados
• Para descrever os requisitos dos sistemas de informação
• Para projetar interações do sistema a um nível inferior dos fluxos do processo retratado
noutras ferramentas
• Para capturar ou projetar estruturas de dados
• Também pode ser utilizado para retratar fluxos de processos de negócio num nível inferior
• Frequentemente utilizado para apresentar casos relacionados
Vantagens
• Comunidade de utilizadores bem estabelecida
• Implementado na maioria dos principais ambientes de modelação
• Muitas referências disponíveis em livros e fontes existentes online
Desvantagens
```
• Concebido para aplicações de software de modelação; a modelação de processos de
```
negócio é uma utilização secundária
• A representação da notação pode variar de ferramenta para ferramenta
Figura 4.13 Diagrama UML
Para mais informações, consulte:
• Object Management Group para uma especificação completa e através de links para
outras informações úteis em www.uml.org
• Estrutura de ficheiros de ajuda no software IBM Rational
4.5.7 IDEF0
O IDEF0 é uma família de conceitos de notação de modelação descritos na Federal Information
```
Processing Standard (FIPS) e que foi desenvolvido pela Força Aérea Americana. É uma notação
```
e técnica que é parte de uma metodologia para definir os processos de trabalho e sistemas de
informação em ambientes de manufatura. Foi amplamente utilizada nos Estados Unidos e está
disponível em muitas ferramentas de modelação ao longo dos anos, sendo de domínio público.
105
O IDEF0 é a notação de modelação de processos que emprega um conjunto muito simples de
símbolos e que consiste em caixas de processos com setas mostrando entradas, saídas, controlos e
mecanismos. Embora cada nível do modelo seja lido da esquerda para a direita e de cima para baixo,
o sistema de numeração utilizado para os principais passos é representado de uma forma que permite
uma fácil associação entre os níveis de decomposição de pais e filhos no processo. Assim, uma caixa
de processo filho designa-se por A1.3 e é interpretada como sendo um processo filho do diagrama
dos pais A1. Cada nível sucessivo de decomposição utiliza outro ponto decimal para continuar esta
fácil rastreabilidade da orientação. A Figura 4.13 ilustra uma amostra de um diagrama IDEF0.
Características principais
• O nível superior define o tópico a ser modelado
• Os níveis subsequentes mostram a decomposição do nível acima com séries de caixas
• Os passos em processos têm entradas, saídas, controlos e mecanismos representados
por setas rotuladas
```
• O sistema de etiquetas indica a relação exata com o próximo nível acima (B3.2 é o
```
```
segundo subpasso do processo da etapa do processo B3)
```
Quando usar
• Pode ser usado para qualquer nível de modelação de atividades
```
• Em Integrated Computer-Aided Manufacturing (ICAM)
```
Vantagens
• Expressão exata
• Decomposição lógica fácil de seguir nos níveis dos modelos
• Os nomes e as definições de caixas e setas inseridos no modelo são mantidos num
dicionário de dados que está disponível para consulta ou exportação separada
• Pode servir um modelo até ao nó num diagrama de uma página para apresentação aos
interessados a nível executivo
• Documentação exaustiva disponível por parte do Governo Federal Americano ou através
de fontes comerciais
Desvantagens
• As implementações podem ser visualmente pouco apelativas
```
• A notação é feita principalmente através de caixas e setas; pode parecer desorganizada
```
e sobrecarregada sem uma Organização cuidadosa de símbolos
```
• A sua popularidade diminuiu; os principais fornecedores que a utilizam, como por
```
exemplo, a Computer Associates já não comercializam o produto IDEF0
Figura 4.14 IDEF0 Diagrama Exemplo
Para mais informações, consultar o Projeto de Publicação 183 das Normas Federais
Americanas de Processamento de Informação em www.idef.com.
106
4.5.8 Mapeamento do Fluxo de Valor
O mapeamento do fluxo de valor é uma notação utilizada na técnica Lean Manufacturing.
Convém não confundir com a notação de cadeia de valor, pois o mapeamento do fluxo de valor
expressa o ambiente físico, o fluxo de materiais e produtos num ambiente de manufatura. Na
Toyota, onde a técnica teve origem, é conhecida como o mapeamento do fluxo de materiais e
informações. O mapeamento do fluxo de valor é utilizado para adicionar elementos de tempo e
custos de recursos de processos a um modelo de processos. A adição de custos e tempo
permite que o modelo de processos inclua uma visão da eficiência dos processos. A Figura
4.15 mostra um mapeamento do fluxo de valor.
Principais Características
• Conjunto muito simples de símbolos
• Pode incorporar diagramas a partir de outras notações
Quando usar
• Para aumentar o envolvimento dos executantes na análise de processos
• Para ajudar a orientar os executantes na auto-identificação de oportunidades para criar
um processo Lean
• Em qualquer projeto que não exija a utilização de ambientes de modelação com todas as
funcionalidades
• Em ambientes onde os custos dos processos e os requisitos de tempo são facilmente identificados
Vantagens
• Simples
• Fácil de usar
Desvantagens
• Modelos planos
• Sem repositório
• Incapaz de se utilizar para questões muito complexas
```
Figura 4.15 Diagrama da Amostra de um Mapeamento do Fluxo de Valor (da Publicação LSixSigma)
```
Para mais informações, ver a maioria dos textos Lean e Seis Sigma.
107
4.5.9 Abordagens Especializadas em Modelação de Processos
As três abordagens seguintes podem ser usadas na modelação de processos ou em iniciativas
```
de melhoria de processos. São consideradas abordagens especializadas; cada uma fornece
```
uma análise de perspetiva corporativa. Mais detalhes e exemplos de modelos estão disponíveis
nos websites para cada abordagem, listados nas secções específicas de cada uma.
Cadeia de Valor. Apresentada por Michael Porter, esta notação enfatiza a captura dos
processos e atividades que agregam valor ao serviço ou produto fornecido a um Cliente.
Fornece uma visão geral, mas não detalhada, dos processos corporativos.
SIPOC. Fornecedor, Entrada, Processo, Saída e Cliente. Um estilo de documentação de
```
processos utilizado no Seis Sigma, útil para enfatizar as fontes de entradas (fornecedores) e as
```
```
saídas dos resultados (Cliente).
```
Dinâmica de Sistemas. Os modelos de dinâmica de sistemas apresentam uma visão na
mudança do desempenho de um sistema de negócio.
4.5.10 Cadeia de Valor
As notações da cadeia de valor são uma categoria de conjuntos de símbolos usados para
visualizar a acumulação de valor ou os passos para o alcance de uma meta. Várias abordagens
às cadeias de valor empregam os seus próprios conjuntos de símbolos, mas estes são geral e
facilmente interpretados e frequentemente empregam uma seta ou traço horizontal para
expressar cada passo na cadeia. As relações também são geralmente fáceis de entender, em
que a principal descreve uma relação predecessor-sucessor.
Por vezes, grupos de passos são resumidos sob um objeto superior dos processos. Estes
modelos geralmente fluem da esquerda para a direita, descrevem os subprocessos que
```
contribuem diretamente para produzir valor aos Clientes (Clientes ou membros) da
```
Organização. O conceito de cadeia de valor foi introduzido por Michael Porter nos seus
trabalhos sobre estratégia corporativa e é tipicamente aplicado no nível de modelação e
planeamento organizacional. A Figura 4.16 mostra um diagrama da cadeia de valor.
Principais Características
As características variam entre as ferramentas:
• Algumas vezes implementado como Diagrama da Cadeia de Valor Acrescentado
• Sobreposições representam executantes, finanças, tempo, sistemas ou agrupamento de
dados específicos que podem ser adicionadas
• As Swim Lanes podem ser utilizadas para aumentar a eficácia
Quando usar
• Para criar uma decomposição dos segmentos dos processos que se relacionam mais
diretamente com a agregação de valor ao Cliente
• Para representar os níveis gerais dos processos
Vantagens
• Fácil de ler e interpretar
• Pequena ambiguidade por causa de relacionamentos simples
• Pode ser aumentado com identificação opcional de entrada e saída, ou outras
sobreposições, tais como envolvimento financeiro ou organizacional
Desvantagens
• Pontos de decisão pouco claros
• A utilidade decompõe-se com o aumento da complexidade, exige a utilização de notações
mais detalhadas para uma maior decomposição
108
Figura 4.16 Diagrama da Cadeia de Valor
Para mais informações, consultar:
• Modelo de Referência da Cadeia de Valor proposto pelo The Value Chain Group, Inc. em
www.value-chain.org/en/rel/19
• Uma forte implementação do Diagrama da Cadeia de Valor Acrescentado nas
```
ferramentas de modelação da Software AG (ARIS)
```
4.5.11 SIPOC
SIPOC significa Fornecedor, Entrada, Processo, Saída e Cliente. É um estilo de documentação
de processos utilizado no Seis Sigma. Não há um conjunto de notações padrão ou preferido e
esta técnica pode ser satisfeita preenchendo uma tabela com esses cabeçalhos. O modelo
SIPOC é frequentemente utilizado para obter um consenso inicial sobre as áreas de um
processo que estão a ser estudadas. A Figura 4.17 mostra uma folha de trabalho do SIPOC.
Principais Características
```
• Arranjo colunar simples (não existem Swim Lanes)
```
• As entradas de texto ou elementos notacionais bem compreendidos podem ser utilizados
para preencher colunas
Quando usar
• Utilizado extensivamente no início de projetos orientados a Lean e Seis Sigma
• O exercício de nomeação de entidades em cada coluna pode acelerar a modelação
detalhada noutra ferramenta
• Utilização para a construção de consenso inicial do âmbito do projeto numa modelação
de processos
Vantagens
• Rápido
• Simples
• Requer apenas um modelo numa folha de cálculo ou num documento de texto
Desvantagens
• Pouco potencial para uma captura em profundidade, em análise ou desenho
• Pode atrasar a adoção de um método mais poderoso
109
Figura 4.17 Folha de Trabalho SIPOC
Para mais informações, consultar o site do Seis Sigma em www.isixsigma.com.
4.5.12 Dinâmica de Sistemas
Mais do que apenas uma notação diferente, os modelos de dinâmica de sistemas não são estáticos
- mostram, com movimento, como as variáveis em mudança afetam um processo. Os modelos de
dinâmica de sistemas são especialmente úteis no desenvolvimento de modelos de ciclo de vida
que se concentram no desempenho geral de um sistema corporativo. Os modelos de dinâmica de
sistemas também mostram o impacto da mudança de variáveis chave que afetam o desempenho
geral. São usados principalmente para modelar toda uma empresa ou linha de negócio, em vez de
processos ao nível de fluxos de trabalho. Os modelos de dinâmica de sistemas são frequentemente
usados para descrever a arquitetura de negócio da empresa a partir de uma perspetiva
comportamental dinâmica, ao invés de uma perspetiva estrutural estática.
A Figura 4.18 mostra uma ilustração básica de um modelo de dinâmica de sistemas. Um modelo
de dinâmica de sistemas real não é estático, mas mostra, com movimento como as variáveis
em mudança afetam um processo.
Principais Características
• Incorpora diagramas de causalidade e de feedback
• Dinâmico - através de animação controlada, demonstra como o processo funciona
Quando usar
• Para fornecer uma visão macro, simulando o desempenho geral da Organização
• Para comparar os impactos da mudança de múltiplas variáveis num processo ou Organização
Vantagens
• Apresenta uma representação ativa, em movimento e flutuante de um processo de alto
nível
• Mais fácil de entender do que uma representação estática ou descrição de texto
• Fornece uma visão numa abordagem a sistemas para processamento
• Inclui condutores ou influenciadores no processo
• Mostra a importância do ciclo de feedback
Desvantagens
• Não é útil para discernir problemas a nível do colaborador ou com aplicações informáticas
de apoio.
• Não é útil para discernir influências externas a um processo sobre esse processo.
110
Figura 4.18 Modelo de Dinâmica de Sistemas em Melhoria Contínua
Para mais informações, consultar:
• System Dynamics Society em www.systemdynamics.org
• System Dynamics - Programa MIT Sloan Ph.D. está disponível em
mitsloan.mit.edu/phd/system-dynamics.php
• System Dynamics Review, a revista da Sociedade Dinâmica de Sistemas está disponível
em www.systemdynamics.org/system-dynamics-review
111
4.6 Níveis do Modelo de Processos
A descoberta de informações sobre processos mostra informações a vários níveis de detalhe.
Esses níveis precisam de ser ordenados e as informações atribuídas aos diferentes níveis de
processos dentro de uma hierarquia de modelo de processos. Os níveis variam de acordo com
a Organização, mas muitas vezes são baseados em perspetivas de áreas funcionais, tais como,
as operações.
4.6.1 Atribuição de Informações dos Processos
O nível superior da hierarquia do modelo mostra o processo ponta a ponta. A partir daí, o
```
modelo é repartido (decomposto) em níveis inferiores de detalhe, até que o utilizador tenha
```
identificado as atividades onde o trabalho dos processos é executado.
O essencial para ordenar a informação é estabelecer uma ontologia acordada. Uma ontologia
```
é a coleta dos nomes dos itens de um domínio (como recursos humanos, por exemplo). É muito
```
difícil definir um processo de negócio que seja completo e preciso se os itens constituintes de
um domínio são invocados por nomes diferentes. Conflitos de nomes ocorrem quando:
• O mesmo nome é utilizado para diferentes itens
• O mesmo item é invocado através de dois nomes diferentes
4.6.2 Alinhamento das Informações dos Processos
Ao recolher informações dos processos, consideremos atribuí-las ao nível do processo
apropriado à medida que as informações são recolhidas. À medida que a equipa aprende mais
sobre o processo, a informação associada pode ser reatribuída. Certifiquemo-nos em alinhar
as informações a qualquer nível funcional com as informações a um nível superior hierárquico.
Ao fazermos isto, as informações a cada nível funcional fornecem detalhes adicionais às
informações do nível superior seguinte. Por outro lado, o alinhamento das informações
associadas a processos através dos níveis de cada processo, permite que a equipa identifique
informações em falta ou informações que precisam de ser questionadas.
A Figura 4.19 mostra um exemplo de uma hierarquia de processos, começando no nível
corporativo e vai desdobrando-se até aos níveis dos processos operacionais e fluxos de
trabalho.
4.6.2.1 Níveis Variam em Número e em Nome
O número dos níveis e os seus nomes variam de acordo com os métodos e convenções de
nomenclatura nas diferentes organizações. Pontos-chave a lembrar:
• O processo deve ser dividido a um nível suficientemente baixo para entender as
atividades que estão a ocorrer e como se encaixam para produzir os produtos finais da
unidade de negócio.
• Para que exista esperança no controlo das informações dos processos e a sua qualidade,
a equipa precisa de uma forma de organizar as informações recolhidas e os modelos que
são construídos.
Os níveis da Figura 4.19 são um exemplo de como uma Organização pode definir os níveis de
detalhe e os seus padrões numa modelação de processos.
112
4.6.3 As Melhores Práticas: Padrões para Modelação de Negócio
Os padrões formais para modelação de negócio devem direcionar o número e o nome dos
níveis, tanto nos modelos atuais como nos futuros. No passado, estes padrões podiam ser
independentes de qualquer padrão ou ferramenta de modelação externa, mas isso está a
mudar. Consideremos o alinhamento dos padrões de modelação internos com as ferramentas
que são utilizadas e as suas capacidades e limitações. Por exemplo, embora não seja o único
padrão para modelação, o BPMN 2.0 está a tornar-se um padrão importante para fornecedores
```
de BPMS (Business Process Management Suite). Consequentemente, os padrões de
```
modelação interna de uma Organização podem precisar de estar em conformidade com o
BPMN. Uma boa regra geral ao olhar para os padrões de modelação é o que eles abordam, de
alguma forma, pelo menos nos níveis mostrados na Figura 4.19.
Figura 4.19 Um Exemplo de Níveis de Modelo de Processos
113
4.6.4 Um Conjunto de Exemplos de Níveis de Modelos
Os processos podem ser modelados de muitas perspetivas, ou pontos de vista, de acordo com
as necessidades da Organização. A modelação de processos tem sido utilizada para o
planeamento estratégico, melhorando as operações e especificando os requisitos do sistema
de dados e aplicações ao longo dos anos. A discussão passa por utilizar quatro níveis de
modelos de processos: corporativa, negócio, fluxos de trabalho e passos das tarefas, como
mostrado na Figura 4.19. Estes níveis são baseados em:
```
(1) Uma perspetiva executiva, que modela processos a um alto nível estratégico
```
```
(2) Uma perspetiva de negócio, na qual os modelos mostram os processos ponta a ponta
```
```
(3) Uma perspetiva de operações, onde os modelos mostram as atividades de trabalho reais
```
```
(fluxos de trabalho)
```
```
(4) A um nível mais baixo, as tarefas e as medidas tomadas para completar o trabalho
```
4.6.4.1 Modelos de Processos Integradores
O advento das disciplinas de gestão focadas em processos criou a necessidade de desenvolver
modelos que integrem estas diferentes perspetivas. Num ambiente BPM, a estratégia de uma
Organização é decretada através do desempenho de processos. O desempenho dos processos
```
liga os modelos corporativos e os processos de negócio ao modelo de fluxos de trabalho (ou
```
```
operações) que apresenta o que deve ser feito para fornecer ao Cliente interno ou externo um
```
produto ou serviço. O modelo de fluxos de trabalho, por sua vez, liga aos passos das tarefas - que
descrevem como o trabalho é feito. Os passos das tarefas, por sua vez, devem ser suportados por
sistemas com tecnologias de informação. Estas relações estão representadas na Figura 4.19.
4.6.4.2 O Repositório de Processos Mantém o Alinhamento
Para manter os tipos de modelos alinhados, é necessária uma linha de visibilidade de um tipo
de modelo e com a perspetiva para o seguinte, num quadro coerente, normalmente mantido
num repositório de processos. A tabela seguinte lista as diferentes perspetivas que um
repositório de processos pode manter.
Posição É Responsável por Toma esta
Perspetiva
Utiliza este Nível
de Modelo
Composto por
Gestão
Executiva
Alinhar a estratégia
com desempenho do
processo corporativo
Perspetiva
corporativa
Modelo de
processos
corporativos
Processos e
Sub Processos
Dono do
processo
Desempenho do
processo corporativo
Perspetiva de
negócio
Modelo de
processos de
negócio
Sub Processos e
Atividades
Gestor de
operações e
```
(staff) pessoal
```
Supervisionar e fazer o
trabalho
Perspetiva de
operações
Modelo de fluxos
de trabalho
Atividades
4.6.4.3 Modelos de Processos Corporativos
Os modelos corporativos fornecem uma visão de alto nível aos processos corporativos.
Perspetiva Corporativa
Os membros de uma Organização que precisam analisar como a empresa opera globalmente
e alinhar a estratégia corporativa global com o desempenho agregado dos processos têm uma
perspetiva corporativa.
114
A perspetiva corporativa organiza os processos primários de uma forma interfuncional para
fornecer uma visão completa do âmbito ao nível da interação, integração e agregação entre
áreas funcionais. A perspetiva corporativa é capturada, para cada Organização, num modelo
de processos de negócio corporativo.
Modelos Corporativos
Um modelo de processos de negócio corporativo fornece uma visão completa ponta a ponta e
interfuncional dos processos primários. O modelo pode mostrar os subprocessos, bem como,
problemas de alto nível e sistemas aplicacionais. Um modelo de processos corporativos é
tipicamente um modelo muito geral que descreve o foco de uma determinada Organização e
organiza os seus principais processos, de todas as áreas funcionais e de negócio, numa
representação visual e transversal ponta a ponta.
Componentes do Modelo de Processos Corporativos
Geralmente, cada processo de negócio multifuncional é decomposto e detalhado pelos seus
```
componentes principais (subprocessos). Um modelo corporativo normalmente tem dois ou
```
mais níveis de detalhe e serve como um plano organizacional de alto nível. O modelo de
processos corporativos inclui processos de suporte e processos de gestão.
Utilizações adicionais para modelos de processos corporativos
Os modelos de processos de negócio corporativo têm tido utilizações diferentes que não passam
por ser apenas uma ferramenta geral de classificação e comunicação. Estes processos podem
```
ser:
```
```
• Mapeados a indicadores-chave de desempenho (KPIs) e a objetivos estratégicos num
```
portfólio de processos
• Utilizado para prioritizar recursos e esforços de projetos
• Mapeado a um modelo de dinâmica de sistemas
o Formular estratégias para cenários futuros alternativos
o Desenvolver estimativas e previsões de alto nível
Nível Corporativo, Arquitetura e Métricas Corporativas
Ao nível corporativo, a arquitetura do negócio dirá o que medir e a métrica dirá que tipo de
dados são necessários para medir o valor. A Figura 4.20 ilustra como seria o nível corporativo
```
da arquitetura do negócio para o atendimento de pedidos (nível 0) até ao nível 2.
```
115
Figura 4.20: Arquitetura Corporativa e Métricas de Atendimento de Pedidos Representadas a Nível
Corporativo
Utilização de Estruturas de Modelos de Processos
Alguns projetos ao nível da modelação de processos corporativos começam por utilizar uma ou
mais estruturas de modelos de processos para criar um modelo corporativo leve. Um modelo
de processo corporativo leve fornece um trampolim para a verificação ou mudança do modelo
pela gestão executiva. Por outro lado, alguns projetos ao nível da modelação de processos
corporativos começam com uma perspetiva da gestão executiva e funcional e depois
comparam o modelo de processos corporativos com as estruturas do modelo de processos.
Exemplos de estruturas de modelos de processos
Exemplos de estruturas de modelos de processos incluem:
• Cadeia de Valor de Porter
```
• SCOR (Supply Chain Operations Reference)
```
```
• PCF (Process Classification Framework) da APQC - bom para processos de suporte e
```
processos de gestão
```
• Estruturas (frameworks) específicas da indústria, como as da distribuição de energia,
```
produção de petróleo e gás, telecomunicações e indústrias de seguros
Estruturas para Categorizar e Grupos de Processos
Estas estruturas tipicamente categorizam os processos como primários, suporte e de gestão.
Cada uma destas categorias pode ser utilizada para agrupar os principais processos da
Organização. Na cadeia de valor de Porter, os processos primários são a logística de entrada,
operações, logística de saída, marketing e vendas e serviço pós-venda, como é mostrado na
Figura 4.21.
116
Figura 4.21 Cadeia de Valor de Porter
SCOR
```
A Association of Supply Chain Management (ASCM) é um consórcio que comercializa um modelo de
```
```
referência denominado SCOR (Supply Chain Operations Reference). As organizações que procuram
```
um meio de entender as suas operações internas, especialmente a cadeia de distribuição com a
finalidade de analisar processos, comparar com concorrentes e avaliar as melhorias, podem subscrever
este modelo de referência. O SCOR fornece padrões, métricas de semântica comuns e integração
flexível de projetos para modelação da cadeia de distribuição. As estruturas de processos SCOR têm
uma componente que outras não têm - as métricas. As métricas são inter setoriais e podem ser
aplicadas para exercícios de benchmarking. A Figura 4.22 mostra uma estrutura de processos SCOR.
Note-se que anteriormente a 2014, a associação era conhecida por Supply Chain Council.
Figura 4.22 Estrutura de Processos SCOR 12.0
117
```
Na Process Common Framework (PCF), os principais processos (operações) são desenvolver
```
```
a visão e a estratégia (1.0), projetar e desenvolver produtos e serviços (2.0), comercializar e
```
```
vender produtos e serviços (3.0), entregar produtos e serviços (4.0) e gerir o atendimento ao
```
```
Cliente (5.0), como é mostrado na Figura 4.23.
```
```
Figura 4.23 PCF (APQC Framework)
```
Se o PCF da APQC fosse um modelo de serviços mais orientado para o Cliente, os principais
processos de negócio seriam, envolver os Clientes, fazer transações comerciais, atender às
expectativas dos Clientes.
4.7 Alinhamento Arquitetura Negócio e Desenvolvimento Mapa Capacidades
Uma Arquitetura de Negócio é a documentação formal dos processos centrais de uma
Organização, as suas funções e responsabilidades de apoio. Define as cadeias de valor da
Organização e como os seus processos de negócio se encaixam, são geridos e medidos. Uma
Arquitetura de Negócio é utilizada para:
• Alinhar a capacidade dos processos à estratégia e aos objetivos de negócio
• Estabelecer uma visão de arquitetura baseada na estratégia corporativa
• Criar princípios orientadores
• Documentação formal dos processos, das funções e das responsabilidades de apoio
• Medição de processos para um desempenho operacional e benchmarking
• Integração, alinhamento e reutilização de processos
• Comunicação e formação
• Armazenamento corporativo e gestão da mudança ao nível dos modelos de processos
As principais utilizações numa Arquitetura Corporativa são:
• Identificar processos primários interfuncionais alinhados e ligados à estratégia e objetivos de negócio
• Ligar esses processos interfuncionais às capacidades de processamento para definir a
visão e a direção de arquitetura com base na estratégia e objetivos definidos
• Mapear as capacidades dos processos para:
o Software configurado e disponível
118
o Processos, regras de negócio e requisitos de dados para o desenvolvimento de
software no interior de um BPMS
Cada nível de processos é geralmente documentado da seguinte forma:
```
(1) A Arquitetura de Negócio e os Arquitetos de Negócio analisam a estratégia e o seu
```
impacto na Organização. A documentação passa então para o nível 2.
```
(2) Os Arquitetos de Processos modelam as operações de negócio atuais e futuras. Em
```
seguida, a documentação passa para o nível 3.
```
(3) Os Analistas de Processos modelam os níveis de atividade e fluxos de trabalho (tarefas)
```
para o mapeamento de aplicações ou para o desenvolvimento de software. Finalmente, a
documentação passa para o nível 4.
```
(4) Os Arquitetos Corporativos alinham as aplicações e as infraestruturas TI em linha com
```
as as alterações da Arquitetura Corporativa.
A abordagem de uma Arquitetura de Negócio tem as funções e as atividades de dados,
aplicações e infraestrutura correspondentes que são feitas simultaneamente com as atividades
da Arquitetura de Negócio. A Figura 4.24 ilustra as atividades de alto nível das outras disciplinas
da Arquitetura Corporativa que são realizadas em simultâneo durante a Fase 2 do ciclo de vida
BPM.
Figura 4.24 Atividades Concorrentes de Arquitetura de Dados, Aplicações e Infraestruturas
A Arquitetura Corporativa faz parte de uma Arquitetura de Capacidades Corporativa maior,
quando todas estas atividades de Arquitetura Corporativa são finalizadas no interior da Fase 2,
como se ilustra na Figura 4.25.
119
Figura 4.25 Arquitetura de Capacidades Corporativas
O desenvolvimento de uma Arquitetura de Negócio e um mapa de capacidades de negócio
será abordado com mais detalhe no capítulo Tecnologia e Transformação.
4.7.1 Modelos de Processos de Negócio
Os modelos de processos corporativos são da responsabilidade de um Dono de Processos. Um
modelo de processos de negócio retrata o fluxo das atividades corporativas e como as mesmas
são realizadas para alcançar os objetivos estratégicos da Organização.
4.7.1.1 Perspetiva de Negócio
A perspetiva corporativa mostra o quê e o como. Cada modelo de processos de negócio tem
um Dono de Processos que é responsável pelo desempenho dos processos e tem autoridade
para adicionar ou remover recursos que afetam o desempenho dos processos. A perspetiva de
negócio, utilizada pelo Dono de Processos é a seguinte:
• Fornecer o contexto do negócio
• Descrever o processo de negócio
• Definir o âmbito do processo de negócio para análise e implementação de mudanças
A perspetiva de negócio é capturada nos modelos de processos de negócio.
4.7.1.2 O que incluem os Modelos de Processos de Negócio
Os modelos de processos de negócio, construídos a partir da perspetiva do negócio, mostram:
• Processos primários ponta a ponta. Os modelos de processos de negócio descrevem
os principais eventos, atividades e resultados de cada um dos principais processos, os
seus subprocessos e as suas interações com o seu ambiente.
• Processos de suporte e processos de gestão. Os modelos de processos de negócio
também descrevem os processos de suporte e de gestão e como eles interagem com,
ou suportam os processos primários.
120
4.7.2 Modelos de Fluxos de Trabalho
```
Os modelos de fluxos de trabalho (workflows) são da responsabilidade do gestor de uma
```
operação. Um workflow define as tarefas, informações e documentos que são passados de um
participante a outro para a ação seguinte, de acordo com um conjunto de regras processuais.
4.7.2.1 Perspetivas de Operação
Os gestores de operações responsáveis pela monitorização do desempenho e que procuram
formas de melhorar continuamente o desempenho operacional assumem uma perspetiva
operacional. Os modelos de fluxos de trabalho capturam a perspetiva das operações.
4.7.2.2 O que os Modelos de Fluxos de Trabalho Incluem
Os modelos de workflow descrevem o que deve ser feito e mais importante ainda, mostram
como é feito para completar um processo com sucesso. Os modelos de workflow são mais
detalhados que os modelos corporativos ou de processos de negócio - estão no terceiro nível
de detalhe numa Arquitetura de Negócio. Os modelos de workflow são mapeados para as
```
atividades (também conhecidas por tarefas ou procedimentos) que compõem os processos. Os
```
modelos de workflow incluem as atividades que as funções desempenham e a relação das
atividades com outras funções e processos. Neste contexto, as funções são posições,
departamentos e sistemas.
4.7.2.3 Atividades de Lançamento
Neste terceiro nível de detalhe, é fácil entender as atividades que são realizadas numa unidade
funcional de negócio. Um movimento contínuo das atividades até ao nível dos processos
corporativos, é fácil ver como todo o trabalho se encaixa nos processos e como as atividades
desempenham papéis na produção do produto final dos processos.
4.7.2.4 Detalhes abaixo do Modelo de Fluxos de Trabalho
O modelo de workflow fornece apenas uma visão básica de atividades numa determinada
operação de negócio. Muitas vezes não é um nível de detalhe suficiente para resolver
problemas, reduzir custos ou apoiar a automatização. Para estas ações, é necessário levar o
nível dos fluxos de trabalho a um nível maior de detalhe - o nível das tarefas.
4.7.3 Passos de Tarefas
O nível dos passos de tarefas é onde as atividades, por exemplo na área comercial, realmente
acontecem. As tarefas mostram como o trabalho é realizado e são constituídas por passos. As
tarefas também são conhecidas por atividades, procedimentos e responsabilidades, mas serão
denominadas tarefas neste guia de conhecimento. Devemos mapear processos até ao nível de
detalhe necessário para automatizar e apoiar o que estamos a fazer e o que alguém no próximo
passo do processo, em contexto de projeto, precisa de fazer.
4.7.3.1 O que o Nível de Etapas de Tarefas Inclui
Num quarto nível, o nível das etapas da tarefa, a Organização e os criadores de BPMS geralmente
têm detalhes suficientes para vincular regras a ações específicas dos colaboradores ou sistemas.
A utilização de dados está agora a um baixo nível, o detalhe suficiente para desenhar aplicações e
relatórios e definir as edições e decisões de baixo nível. Um profissional BPM pode participar num
projeto em que a fase seguinte envolve o desenvolvimento de aplicações de software.
121
Para apoiar os esforços no desenvolvimento de software:
• Conferir com os criadores de software o determinar de informações para:
```
o O desenho de software (ou desenvolvimento de um baixo nível de código ou sem código)
```
o Teste de software
• Considerar matrizes de rastreabilidade para o futuro e para o passado:
o Documentar requisitos funcionais
o Garantir que o software é codificado e testado para apoiar as pessoas que executam
os processos
Complementarmente, este nível é utilizado para gerar aplicações BPMS que gerem o trabalho
e que automatizam a entrada e a utilização de dados ao nível da transação manual.
Lembremo-nos de considerar que os requisitos para qualquer uma dessas atividades de
desenvolvimento subsequentes e os detalhes necessários para conduzir à sua conclusão, são
alcançados através dos modelos.
4.7.4 Perspetiva do Colaborador
Aqueles que realmente fazem o trabalho normalmente concentram-se nas suas tarefas e nos
passos que as compõem. Os passos das tarefas identificam como o trabalho é feito.
4.7.4.1 Passos da Tarefa e Trabalho Realizado
Este é o nível de detalhe onde o analista pode identificar os passos que são executados para
entregar o resultado de uma única tarefa. O nível das etapas da tarefa inclui para cada uma:
• Executor da tarefa
• Passos
• Critérios de desempenho
• Princípios a seguir
```
• Materiais e ferramentas a utilizar (incluindo software)
```
• Resultados esperados
• Indicadores de desempenho corretos
• Pessoas que precisam de ser consultadas
o Durante a tarefa
o Após a realização da tarefa
Exemplo de etapas de tarefas de serviço
Uma equipa de vendas de apólices de uma companhia de seguros precisa fazer entrar no
sistema um novo segurado. Ao nível de etapas da tarefa, é nomeada a tarefa e a lista das etapas
que a equipa de vendas deve executar para fazer entrar o novo segurado.
Exemplo de etapas de tarefas de produção
```
Outro exemplo a este nível passa pelo fabrico - o build-to-order (BTO). Aqui um Cliente faz uma
```
encomenda a um vendedor. O analista do processo do projeto recolhe os requisitos para um
produto personalizado. Assume-se um fabrico a partir de peças comuns, o analista identifica as
peças, define as opções, reduz ordens de fabrico, obtém as peças e em seguida, fabrica-se.
122
4.8 Capturar Informações dos Processos e os Participantes na Modelação
Existem várias e maneiras diferentes de capturar informações para a modelação de processos.
Consideremos a utilização de uma ou várias combinações das seguintes técnicas para reunir
descrições de um processo:
• Observação direta
• Entrevistas individuais
• Feedback por escrito
```
• Sessões (workshops) estruturadas
```
• Conferências via Internet
• Mineração de processos
4.8.1 Observação Direta
Vantagens
A observação direta é uma boa forma de documentar os detalhes dos processos existentes.
Pode revelar atividades e tarefas que de outra forma poderiam não ser reconhecidas e pode
ser eficaz na identificação de variações e desvios que ocorrem no dia-a-dia do trabalho.
Restrições
Por ser necessariamente limitada a uma amostra relativamente pequena, a observação direta
pode não captar a camada de variações entre grupos e locais. A observação direta também
implica o risco de os executantes fazerem o que eles pensam que queremos ver, em vez do
que eles normalmente fazem.
4.8.2 Entrevistas
Vantagens
As entrevistas podem criar um sentido de propriedade e participação num processo de
modelação e documentação dos processos de negócio. Esta abordagem requer uma
perturbação mínima do tempo dos participantes e das suas obrigações normais.
Restrições
Agendar e conduzir entrevistas é uma técnica mais demorada do que outros métodos. Pode
ser difícil construir um fluxo de processo coeso e mapear as diferentes visões numa única visão.
Esta técnica geralmente requer acompanhamento e às vezes não descobre todas as atividades
para descrever completamente o processo.
4.8.3 Levantamento ou Feedback Escrito
Vantagens
O feedback por escrito requer um tempo mínimo e uma interrupção limitada das tarefas.
Geralmente, os dados podem ser recolhidos desta forma.
Restrições
O feedback por escrito é frequentemente propenso ao mesmo tipo de problemas que são
encontrados em entrevistas individuais, inclusive:
• Requer mais tempo
• Falta de informação
• Tempo extra gasto em reconciliações
• Diferenças de opinião
• Descrições diferentes de um mesmo trabalho por pessoas diferentes
• Diferenças encontradas que requerem acompanhamento
123
```
4.8.4 Sessões (workshops) Estruturadas
```
Vantagens
As sessões estruturadas são focadas, as reuniões facilitadas onde especialistas e partes
interessadas reúnem o suficiente para criar um modelo de trabalho interativo. Oferecem
vantagens de encurtar o tempo decorrido do calendário necessário para desenvolver os
modelos e dar um sentido de propriedade mais forte para os participantes do workshop do que
outras técnicas. Os workshops estruturados também podem ser conduzidos por um facilitador
especializado em técnicas de modelação não conhecidas vulgarmente pelos participantes do
processo. Geralmente, os modelos produzidos nos workshops estruturados requerem menos
acompanhamento e geram uma descrição globalmente acordada de um processo mais
rapidamente e com maior qualidade do que outras técnicas.
Restrições
Devido às despesas de viagens e reuniões, os workshops podem ser mais caros do que outros métodos.
4.8.5 Conferências Baseadas na Internet
Vantagens
As conferências baseadas na Internet podem proporcionar muitos dos mesmos benefícios dos
workshops presenciais, mas funcionam melhor com grupos menores. Estas conferências web
podem ser mais convenientes e menos dispendiosas do que os workshops presenciais, quando
os participantes estão distribuídos globalmente.
Restrições
A utilização da tecnologia numa conferência baseada em Internet requer facilitadores
habilitados para conduzir reuniões remotas de uma forma eficaz. Em sessões à distância, pode
ser mais difícil monitorar e gerir a participação individual no trabalho em grupo.
```
4.8.6 Mineração (Minning) de Processos
```
Definição
Process Mining é um método de análise de processos que visa descobrir, monitorizar e
```
melhorar processos reais (processos não assumidos), extraindo facilmente o conhecimento dos
```
registos de eventos disponíveis nos sistemas de registo de informações existentes numa
Organização. A mineração de processos é um método automatizado de descoberta de
processos dentro dos sistemas existentes que utiliza os recursos do iBPMS para obter os
```
registos (logs) de eventos para reconstruir os processos reais.
```
```
O BPMS inteligente (iBMPS) é um tema abordado no capítulo Tecnologia e Transformação.
```
Vantagens
A mineração de processos vai além da pura apresentação de dados chave de um processo,
reconhece as relações contextuais dos processos, apresenta-os na forma de análise gráfica
para diagnosticar problemas e sugere melhorias na qualidade dos modelos de processos. Com
a mineração de processos, é possível detetar ou diagnosticar problemas com base em factos
e não em conjeturas ou intuições.
```
O Process Mining procura o confronto entre dados de eventos (comportamento observado) e
```
```
modelos de processos (feitos manualmente ou descobertos automaticamente). Através do
```
emparelhamento de dados de eventos e modelos de processos, é possível verificar a
conformidade, detetar desvios, prever atrasos, apoiar a tomada de decisão e recomendar o
redesenho de processos.
124
Restrições
Embora a mineração de processos seja frequentemente referida como um método ou técnica,
é mais uma capacidade incorporada em plataformas tecnológicas iBPMS. Para organizações
que não utilizam uma plataforma iBPMS para gerir processos é necessário aplicar um ou mais
métodos para recolha de informações.
4.8.7 Modelação dos Participantes
O desenvolvimento de modelos de processos envolve vários papéis devido à variedade de
utilizações para esses modelos. Criar um conjunto de modelos que representem totalmente os
processos requer muitas pessoas. As funções que podem criar diferentes modelos de
processos para os seus próprios propósitos incluem:
• Especialistas em estratégia de negócio
• Gestores de negócio
• Analistas financeiros
• Auditores e analistas em compliance
• Analistas de desempenho de processos
• Analistas de requisitos
• Analista de sistemas
Os modelos podem ser criados por indivíduos que expressam os seus conhecimentos pessoais
ou por grupos que definem o âmbito e a profundidade da Organização do que é a sua
abordagem. Numa aproximação mais estruturada, normalmente haverá um facilitador, um
modelador e vários especialistas em temas envolvidos.
Os especialistas nas temáticas podem ser qualquer um dos seguintes:
• Executivos que expressam as dinâmicas corporativas a um alto nível
• Gestores de nível médio que definem, monitorizam e controlam mecanismos
• Colaboradores que executam o trabalho que deve ser modelado
Para os esforços de redesenho, o pessoal dos sistemas de informação ou os analistas de
negócio que desenvolvem os requisitos para o suporte de TI devem colaborar com o pessoal
de desenho organizacional que determina as funções, responsabilidades e estruturas de
relatórios, ou com o pessoal financeiro que mede o custo e as opções que criam valor.
4.9 Estruturas e Modelos de Referência
Um projeto de modelação pode exigir muitos modelos individuais. Estes modelos têm valor
tanto individualmente, como através de representações isoladas, ou ainda através de
componentes de um complexo projeto como um todo. As estruturas e os modelos de referência
maximizam o valor e a utilidade do conjunto de modelos dentro do contexto como um todo. Há
uma série de estruturas e modelos de referência mencionadas em seguida.
125
4.9.1 Modelação Dentro de uma Estrutura
Uma estrutura pode variar desde uma simples pirâmide concetual até um complexo conjunto
de produtos de modelação com regras que regem onde o que será representado. Na pirâmide,
cada nível de modelo resume o seu nível mais abaixo e decompõe o nível mais acima. A
pirâmide pode ter uma simples cadeia de valor no nível superior que fornece um resumo geral
instantâneo do que o conjunto de modelos irá procurar explicar. Os níveis inferiores geralmente
introduzem eventos chave, executantes, atividades operacionais e um fluxo de processos mais
detalhado. Por vezes um nível é incluído abaixo dos níveis detalhados dos processos para
mostrar a estrutura de dados e detalhes dos componentes do sistema ou da Organização.
4.9.1.1 Estruturas de Modelação Complexa
As estruturas mais complexas podem prescrever um conjunto padrão de produtos para retratar
os detalhes dos processos em estudo. As instituições muito grandes e complexas
frequentemente adotam Frameworks TI destinadas a aplicar todos os esforços na modelação
da Organização.
Exemplos dessas estruturas de arquitetura incluem:
```
• Federal Enterprise Architecture Framework (FEAF)
```
```
• Ministry of Defense Architecture Framework (MODAF)
```
```
• Department of Defense Architecture Framework (DoDAF)
```
```
• The Open Group Architectural Framework (TOGAF)
```
Estas estruturas têm o duplo propósito de ajudar os utilizadores a lidar com extrema
complexidade dentro dos seus ambientes e de permitir comparações entre as diferentes
agências governamentais, dentro de complexas e diversificadas Organizações. A última
estrutura listada, o TOGAF, é uma versão geral de uma estrutura complexa originalmente
desenvolvida pelo DoD, suportado pelo The Open Group e ainda é usada pelo DoD em conjunto
com o DoDAF. A maioria destas estruturas aparentemente diferentes, são derivadas ou
fortemente influenciadas pela estrutura Zachman, proposta por John Zachman em 1987.
4.9.1.2 Gestão e Conformidade da Estrutura
A gestão destas estruturas corporativas ao nível de uma agência governamental ou
Organização é frequentemente utilizada pelo Arquiteto Corporativo, mas todos os profissionais
em Gestão por Processos Corporativos devem cumprir com uma estrutura para evitar lacunas
e inconsistências.
4.9.2 Utilização de um Modelo de Referência
Os modelos de referência facilitam a análise dos processos. Cada uma das estruturas de
arquitetura fornece modelos de referência, tais como:
• Modelo de referência de desempenho
• Modelo de referência corporativo
• Modelo de referência de componentes de serviço
• Modelo de referência de dados
• Modelo de referência técnica
Um modelo de referência fornece uma forma comum de visualizar algum aspeto de um
processo e uma forma comum de descrevê-lo para facilitar a análise e a comparação. Os
modelos de referência também são desenvolvidos e apoiados por organizações e consórcios
como a ASCM. Ver a secção anterior que menciona o modelo SCOR.
126
```
Figura 4.26 Hierarquia do Processo SCOR (ASCM 2017)
```
O modelo SCOR é parte de um portfólio corporativo que descreve os elementos críticos de
uma cadeia de valor. Incluindo o SCOR, o portfólio da estrutura mantido pela Advancing
```
Productivity, Innovation and Competitive Success (APICS) consiste no Product Life Cycle
```
```
Operations Reference model (PLCOR), no Modelo de Referência de Operações da Cadeia de
```
```
Clientes (CCOR), no Modelo de Referência de Operações da Cadeia de Desenho (DCOR) e no
```
```
Managing for Supply Chain Performance (M4SC) tal como é mostrado na Figura 4.27.
```
Para mais informações, aceder ao URL www.ascm.org.
```
Figura 4.27 Estruturas e Relacionamentos da APICS (ASCM 2017)
```
127
4.10 Técnicas e Ferramentas de Modelação
Há muitas ferramentas e técnicas de modelação disponíveis, que vão desde a utilização de
quadros brancos simples, papel pardo ou notas adesivas colocadas na parede, até ferramentas
BPM sofisticadas e especializadas que incluem modelação e armazenamento de dados para
esses modelos e processos. A análise de processos pode ser feita de forma eficaz e eficiente,
utilizando qualquer tipo de ferramenta. O foco da análise ou do projeto, no entanto, deve ser o
processo em si e não a ferramenta. Nenhuma destas técnicas é necessariamente exclusiva das
```
outras; todas podem ser empregues num projeto de redesenho ou melhoria de processos com
```
diferentes grupos ou em diferentes circunstâncias.
4.10.1 Ferramentas de Desenho e Relatórios
Durante ou após entrevistas e workshops, os participantes podem captar os fluxos e registar as
notas dos processos utilizando ferramentas de desenho gratuitas ou de baixo custo. Convém
observar que a um nível básico, o Visio da Microsoft ainda é a ferramenta de modelação de
```
processos mais utilizada, seguida pelas aplicações Office (PowerPoint, Excel e Word).
```
4.11 Validação e Simulação de Processos
```
A validação de processos é uma forma de garantir os resultados desejados; utiliza dados de
```
todas as etapas de um processo para verificar se o processo é capaz de fornecer os produtos
ou os serviços de qualidade e de forma consistente. A simulação de processos é um tipo de
validação que pode mostrar como um processo se irá comportar ao longo do tempo.
4.11.1 Utilização da Simulação de Processos
As simulações de processos são uma forma de modelo que fornece uma visão valiosa da
dinâmica dos processos. As simulações requerem dados suficientes para permitir que os
processos sejam matematicamente simulados sob vários cenários, cargas ou outras condições.
As simulações podem ser utilizadas para alcançar o seguinte:
• Validar um modelo que demonstra conjuntos de transações reais, quando executados
através da exposição do modelo, produzem as mesmas características de desempenho
que os do processo real.
```
• Prever o desempenho do desenho do processo sob diferentes cenários (variar o número
```
```
de transações ao longo do tempo, o número de colaboradores, entre outros).
```
• Determinar quais são as variáveis que têm o maior efeito sobre o desempenho dos processos.
• Comparar o desempenho de diferentes desenhos de processos sob o mesmo conjunto
de circunstâncias.
4.11.2 Ferramentas e Ambientes de Simulação
As simulações podem ser manuais ou eletrónicas, utilizando ferramentas de simulação de
processos. Os ensaios dos processos são frequentemente utilizados como parte de um esforço
de melhoria, redesenho ou reengenharia de processos. Um ensaio de processos pode realizar
simulações desenvolvendo transações simuladas que podem ser executadas manualmente
através de um processo de negócio ponta a ponta por uma pequena equipa multifuncional. As
simulações podem ser executadas, comparando com processos existentes ou projetadas como
os processos devem ser executados. Os ensaios de processos frequentemente identificam
exceções e handoffs enquanto fornecem importantes perspetivas sobre a comunicação
existente e a necessária entre tarefas, áreas funcionais, equipas e sistemas. Algumas
organizações requerem uma demonstração bem-sucedida dos seus processos ensaiados, antes
de testar ou implementar novos processos ou alterações no desenho dos processos.
128
4.11.3 Simulação Técnica e Análise de Carga
Algumas ferramentas de simulação de processos incluem capacidades de análise de carga. A
análise de carga testa componentes de um sistema sob determinadas condições. Por exemplo,
a simulação de picos, médias e cargas de transação, prevêm o impacto no tempo de ciclo,
requisitos de recursos e gargalos. A simulação gera conjuntos de dados que permitem muitos
tipos diferentes numa análise de processos. Algumas das análises típicas são utilização de
recursos, análise de distribuição, análise de tempo de ciclo e análise de custos. Algumas
ferramentas de simulação de processos também podem apresentar animações das simulações.
As animações podem ser úteis na identificação visual de fenómenos durante o desempenho
que podem não ser facilmente visíveis nas análises típicas em conjuntos de dados de simulação.
4.12 Conceitos Chave em Modelação de Processos de Negócio
A tabela seguinte mostra os conceitos chave para a modelação de processos de negócio.
Modelação de Processos de Negócio
Conceitos Chave
Modelos de Processos
```
• São representações simplificadas de alguma atividade corporativa;
```
• Servem como um meio para comunicar diferentes elementos e realidades de um
```
processo de negócio;
```
```
• São utilizados para documentar, visualizar, analisar, ou desenhar um processo de negócio;
```
```
• São úteis para documentar a comunicação, formação e alinhamento; desenho e
```
```
requisitos; ou ainda para analisar determinados componentes dos processos;
```
• Expressam frequentemente o estado em que se encontra o modelo e uma ou mais
propostas de mudança, culminando num modelo diferente e numa estratégia realista
```
para a necessária Gestão da Mudança;
```
• Podem exigir validação por simulação.
Perspetivas
• Diferentes níveis ou perspetivas de processos de negócio são expressos por modelos que
```
mostram diferentes âmbitos e níveis de detalhe para diferentes públicos e propósitos;
```
• Os modelos podem exibir diferentes perspetivas: corporativa, negócio e operações
```
(workflows);
```
• Cada perspetiva em observação tem tipos específicos de modelos e níveis de
composição que melhor se adaptam aos níveis em causa.
Notações
```
• Existem muitos estilos de modelação de processos e formas de desenvolver os modelos;
```
• A notação selecionada deve corresponder às necessidades do projeto - tarefa em mãos
```
e necessidades da próxima fase desse projeto;
```
• Algumas notações são mais versáteis e aplicam-se a uma ampla gama de necessidades
```
na modelação de processos;
```
• Por vezes, as combinações de notações combinam melhor com os requisitos do projeto
do que uma única ferramenta.
129
Modelação de Processos de Negócio
```
Conceitos Chave (continuação)
```
Estruturas / Frameworks
• Se o projeto tiver de cumprir uma estrutura específica, devemos identificar os requisitos
```
da estrutura desde o início;
```
• Os modelos de referência estão disponíveis para ajudar a orientar o desenvolvimento de
modelos em determinadas áreas de negócio.
Capturar Informações dos Processos
• Ao abordar um desafio de modelação, a equipa pode optar por modelar por Top Down,
```
Bottom Up ou Middle Out, dependendo da preferência e dos requisitos do projeto;
```
```
• As técnicas de captura de informações variam muito entre projetos; podem incluir
```
qualquer combinação de técnicas: observação direta, entrevistas, pesquisas e
```
workshops formais; podem ser presenciais ou online;
```
• Os participantes de um projeto de modelação incluem diversos atores: estrategistas,
gestores, especialistas funcionais, diferentes tipos de profissionais e diversos analistas.
A implementação de processos muitas vezes requer capacitação de profissionais em
Gestão da Mudança.
130
