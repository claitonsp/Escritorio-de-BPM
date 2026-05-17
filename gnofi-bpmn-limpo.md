## BPMN
Business Process Modeling Notation
É  proibida  a  reprodução  total  ou  parcial  desta  obra,  de
qualquer    forma    ou    meio    eletrônico,    mecânico,
fotográfico   e   gravação   ou   qualquer   outro,   sem   a
permissão expressa daGNOFI TECNOLOGIA
Sumário
- 1.  Tipos de de Diagramas de de Process  Processo o de de Ne  Negóc  gócio io 55
1.1. 1.1. Privative  (internal(internal) ) business process 55
1.2. 1.2. Abstrat (Public) (Public) Process 55
1.3. 1.3. Colaboration n (Global) (Global) Process 66
1.4. 1.4. Elementos  de de um um BPD 77
1.5. 1.5. Elementos  essenciais 77
- 2.   Modelando Eventos de de Negócio 1212
2.1. 2.1. Notação básica de de tipo de de eventos 1212
2.2. 2.2. Eventos mais complexos 1212
- 3.  Processo o de de Ne  Negóci  gócio, o, Subprocessos os e e TaTarefas   refas 1515
3.1. 3.1. Decompondo seu processo dentro de de hierarquias 1515
Token 2020
- 5.  Ciclo de de Vida da da Ativ  Atividade    idade 2222
- 6.  Modul   Modulando Pontos s de de De  Decis  cisões com Gateways 2222
- 7.  Pools e e Lanes – – Quem faz o o quê? quê? 3939
7.1. 7.1. Um Um POOL pode representar  muitas coisas 4040
Apr Aprend   endend  endo B  o BPMN po  PMN por mr meio    eio de u  de um Exempemplo lo 4141
Referências 50
## Objetivo
O objetivo deste curso é apresentar os elementos da notação de modelagem de processos de
negócio BPMN 1.1 (Business Process Modeling negócio BPMN 1.1 (Business Process Modeling Notation) mostrando-os por meio de exemplosNotation) mostrando-os por meio de exemplos
práticos.
O que é processo
Processo é qualquer atividade ou conjunto de atividades que toma uma entrada, adicionando a
esta um valor, e fornece uma saída gerando um produto valorado. Então, em um processo são
conhecidos os passos a serem seguidos, as sequências em que eles acontecerão, as pessoas (ou
perfil) envolvidas em todas as atividades e o perfil) envolvidas em todas as atividades e o produto final a ser produzido.produto final a ser produzido.
"Os  processos  utilizam  os  recursos  da  organização  para  oferecer  resultados  objetivos  aos  seus
clientes" (Harrington, 1991).
"Um  processo  é  um  grupo  de  atividades  realizadas  numa  sequência  lógica  com  o  objetivo  de
produzir um bem ou um serviço que tem valor para um grupo específico de clientes" (Hammer e
Champy, 1994).
## Business Process Modeling Notation
A especificação da notação de modelagem de processos de negócio (BPMN) fornece uma notação
gráfica  para  expressar  os  processos  de  negócio  em  forma  de  diagrama  de  processo  de  negócio
(BPD). O objetivo do BPMN é dar suporte ao gerenciamento de processo de negócio, tanto para os
usuários técnicos quanto para os usuários de negócio, fornecendo uma notação intuitiva para os
usuários, tornando-os capazes de representarem semânticas de processos complexos.
Business  Process  Modeling  Notation  (BPMN)  é  uma  notação  gráfica  que  descreve  a  lógica  dos
passos  de  um  processo  de  negócio.  Essa  notação  tem sido  especialmente  desenhada  para
coordenar  a  sequência  dos  processos  e  as  mensagens que  fluem  entre  os  participantes  das
diferentes atividades.
Por que é importante Modelar com BPMN?
••BPMN é um padrão internacional de modelador de processos aceito pela comunidade.modelador de processos aceito pela comunidade.
- BPMN é indep• BPMN é indep
endente de qualquer metodologia de modelador de processos.
- BPMN cria uma ponte padronizada para diminuir a lacuna entre os processos de negócio e sua• BPMN cria uma ponte padronizada para diminuir a lacuna entre os processos de negócio e sua
implementação.
- BPMN permite modelar o processo de uma maneira unificada • BPMN permite modelar o processo de uma maneira unificada e padronizada.e padronizada.
## 1.
-  Tipos de diagramas de processo de negócio (BPD)Tipos de diagramas de processo de negócio (BPD)
A  modelagem  de  processo  de  negócio  é  usada  para  comunicar  uma  ampla  variedade  de
informações  para  uma  ampla  variedade  público.  O BPMN  está  projetado  para  cobrir  muitos
tipos  de  modelagens  e  permite  a  criação  de  um  processo  de  negócios  de  ponta  a  ponta.  Os
elementos estruturais do BPMN permitirão ao observador ser capaz de facilmente identificar as
seções de um diagrama de BPMN.
Existem três tipos básicos de diagrama de processo de negócio (BPD):processo de negócio (BPD):
1.1  -  Private  (internal)  business  process
––  ou  diagramas  de  processo  de  ––  ou  diagramas  de  processo  de
negócios  privados.  Nós  o  utilizamos  quando  não  é  do  nosso  interesse  a  interação  desse
processo com outros com os quais ele possa interagir. Estamos preocupados com o teor deste
fluxo em si.
## 1.1.1.1.
1.2 - Abstract (Public) Process
1.2 - Abstract (Public) Process – ou processos abstratos, representam uma interação – ou processos abstratos, representam uma interação
entre  um  processo  de  negócio  privativo  e  outro  processo  ou  participante.  Não  estamos
preocupados com o conteúdo do fluxo em si, mas sim como ele colabora com os outros fluxos
dentro de um sistema
1.3 - Colaboration (Global) Process
1.3 - Colaboration (Global) Process – O processo colaborativo descreve a interação – O processo colaborativo descreve a interação
entre dois ou mais entidades do negócio. Estas interações são definidas como uma sequência
de atividades que representa o padrão de trocas de mensagens entre as atividades envolvidas.de trocas de mensagens entre as atividades envolvidas.
O  processo  colaborativo  pode  ser  entendido  como  sendo  dois  ou  mais  processos  abstratos
comunicando  entre  si.  E  no  processo  abstrato,  as  atividades  que  são  as  participantes  na
colaboração podem ser consideradas como sendo os pontos de contato entre os participantes.os participantes.
## 1.4 -
1.4 - Elementos de um um BPDBPD
O  principal  objetivo  para  o  desenvolvimento  do  BPMN  é  que  fosse  uma  notação  simples  e
adaptável para os analistas de negócio. Para ajudar a entender como o BPMN pode gerenciar
as necessidades da organização, a lista de elementos gráficos do BPMN é apresentada em dois
grupos.
Primeiro,  existe  a  lista  de,  existe  a  lista  de
elementos  essenciais
(CORE  ELEMENTS)  que  irá  suportar  os  (CORE  ELEMENTS)  que  irá  suportar  os
requerimentos necessários para uma notação simples. Estes são os elementos que definem o
layout   básico   do   BPMN.   Muitos   processos   de   negócios   poderão   ser   modelados
adequadamente com estes elementos.
Segundo
, existe uma lista completa de elementos, os
quais ajudarão a suportar requerimentos de uma poderosa notação para gerenciar situações
de modelagem mais avançadas.
1.5 - Elementos essenciais
Enfatizando, novamente, que o objetivo do desenvolvimento do BPMN foi o de permitir por
meio de um mecanismo simples a criação de modelos de processos de negócio, enquanto que
ao  mesmo  tempo  seja  capaz  de  manipular  a  complexidade  inerente  de  um  processo  de
negócio.  A  abordagem  empregada  para  manipular  estes  dois  requerimentos  conflitantes  foi
organizar as figuras gráficas para anotação dentro de categorias específicas. O BPMN fornece
um pequeno conjunto de categorias para que o usuário (leitor) possa facilmente identificar os
tipos  básicos  dos  elementos  e  entender  o  diagrama. Dentro  dessas  categorias  básicas  de
elementos,  informações  e  modificações  adicionais  podem  ser  adicionadas  para  apoiar  as
necessidades da complexidade sem alterar drasticamente a aparência do diagrama. As quatros
categorias dos elementos são:
••  Objetos de Fluxo (Flow Objects)Objetos de Fluxo (Flow Objects)
## ••
Objetos de Conexão (Connecting Objects)
## ••
Raia de piscina (Swimlanes)
## ••
Artefatos (Artifacts)
1.5.1 - Objetos de Fluxos (Flow Objects)
Os  objetos  de  fluxos  são  os  principais  elementos  gráficos  para  definir  o
comportamento do processo de negócio. Existem tcomportamento do processo de negócio. Existem três tipos de objetos de fluxos:rês tipos de objetos de fluxos:
••  Eventos (events)Eventos (events)
••  Atividades (Activities)Atividades (Activities)
••  Decisões (Gateways)Decisões (Gateways)
1.5.2 - Objetos de Conexão (Connecting Objects)
A conexão dos objetos de fluxos com outra informação é realizada por meio de
três objetos:
## ••
Fluxo de sequência (sequence Flow)
••  Fluxo de mensagem (Message Fluxo)Fluxo de mensagem (Message Fluxo)
••  Associação (Association)Associação (Association)
1.5.3 - Raia de piscina (Swimlanes):
Existem duas maneiras de agrupar os elementos de modelagem básica por meio
dos
Swimlanes
## ::
## ••
Pool (piscina)
## ••
Lane (raia)
1.5.4 - Artefatos (Artifacts)
Os  artefatos  são  usados  para  fornecer  informações  adicionais  sobre  o  processo.
Existem  quatro  artefatos  padronizados,  mas  os  fabricantes  de  software  de
modelagem estão livres para adicionar outros artefatos. icionar outros artefatos.  O conjunto corrente dede
artefatos inclui:
## ••
Objeto de Dados (Data Object)
## ••
Grupos (Group)
## ••
Anotação (Annotation)
Lista dos elementos essenciais de modelagem que são descritas na notação:
Elemento Descrição Notação
## O   O
b   b
j   j
e  e
t   t
o  o
s  s
d   d
e  e
## F   F
l   l
u  u
x  x
o  o
s  s
## (   (
## F   F
l   l
o  o
w  w
## O   O
b   b
j   j
e  e
c  c
t   t
s  s
## )   )
Eventos
## (events)(events)
Um  evento  é  “alguma  coisa”  que
acontece  durante  o  curso  de  um
processo    de    negócio.    Esses
eventos   afetam   o   fluxo   do
processo  e  usualmente  tem  uma
causa  (
Gatilho
)  ou  um  impacto
((resultado). Eventos são). Eventos são
representados     por     círculos
vazados  para  permitir  sinalização
que  identificarão  os
Gatilhos  ou
resultados.resultados.   Existem   três   tipos
eventos:
## ••
Inicio
## ••
Intermediário
## ••
Final
Atividades
(Activities)
Atividade  é  um  termo  genérico
para  o  trabalho  que  a  empresa
realiza.  Uma  atividade  pode  ser
atômica    ou    não    atômica
(composta). Os tipos de atividades
que  fazem  parte  de  um  processo
de    negócio    são:    Processos,
Subprocessos e Tarefas. Tarefas e
Sub-Processos  são  representados
por  um  retângulo  arredondado.
Os    processos    podem    ser
representados    ou    por    um
retângulo arredondado ou
incluído dentro de um POOL.
Decisões
(Gateways)
Uma   Decisão   é   usada   para
controlar  as  ramificações  e  os
encontros    dos
Fluxos de
sequência  (sequence  Flow)sequência  (sequence  Flow). Desta. Desta
forma,   ele   irá   determinar   as
ramificações,    consolidações    e
união dos caminhos. A sinalização
gráfica  interna  ao  desenho  irá
indicar  o  tipo  de  comportamento
da decisão.
## O   O
b   b
j   j
e  e
t   t
o  o
s  s
d   d
e  e
## C   C
o  o
n  n
e  e
x  x
ã   ã
o  o
Fluxo de
sequência
## (sequence(sequence
Flow)
O Fluxo de seqüência é usado para
mostrar  a  ordem  que  as
atividades
serão processadas. serão processadas.
Fluxo de
mensagem
(Message Fluxo)
Um  Fluxo  de  mensagem  é  usado
para  mostrar  o  fluxo  de  uma
mensagem entre dois
participantes que estão
preparados   para   mandar   ou
recebê-las.  No  BPMN,
dois  Pools
(piscinas)(piscinas) no diagrama
representam os dois participantes.
Associação
(Association)
Uma  Associação  é  usada  para
relacionar  informações  com  os
objetos de fluxo. Textos e gráficos
que  não  fazem  parte  do  fluxo
podem  ser  associados  com  os
objetos de fluxo.
## R   R
a  a
i   i
a  a
d   d
e  e
p  p
i   i
s  s
c  c
i   i
n  n  a  a
## (   (
## S   S
w  w
i   i
m  m
l   l
a  a
n  n
e  e
s  s
## )   )
Pool (piscina)
Um  Pool  (piscina)  representa  um
participante  dentro  do  processo.
Ele   também   atua   como   uma
“Swimlane”   e   um   recipiente
gráfico  para  separar  um  conjunto
de   atividades   de   outro   Pool,
geralmente  em  um  contexto  de
situação de B2B.
Lane (raia)
Uma    Lane    (raia)    é    uma
subpartição  dentro  de  um
Pool
## (piscina)(piscina)
e e irá  ampliar    irá  ampliar o o tamanho
de um
Pool (piscina)
horizontalmente ou
verticalmente.   Lane   (raia)   são
usadas     para     organizar     e
categorizar as
atividades.
## A   A
r  r
t   t
e  e
f   f
a  a
t   t
o  o
s  s
## (   (
## A   A
r  r
t   t
i   i
f   f
a  a
c  c
t   t
s  s
## )   )
Objeto de
Dados (Data
Object)
Objetos  de  Dados  (Data  Object)
são considerados artefatos porque
eles   não   têm   nenhum   efeito
direto sobre o
fluxo  de de  sequência
ouou
fluxo    de de    mensagem
dodo
processo,    mais    eles    podem
fornecer informações  sobre o queque
a  atividade  necessita  para  ser
executada   ou/e   o   que   elas
produzem.
Grupo (Group)
## – –
Uma caixa que
circunda um grupo
de objetos para
propósito de
documentação
É  um  agrupamento  de  atividades
que  não  afeta  a  sequência  do
fluxo.  O  agrupamento  pode  ser
usado   para   o   propósito   de
documentação   ou   análise.   Os
Grupos  (Group)  podem  também
ser  usados  para  identificar  as
atividades   de   uma   transação
distribuída através de várias Pools.
Anotação
(Annotation)
Ligada com uma
associação
Uma  Anotação  (Annotation)  de
texto é um mecanismo para que o
modelador  forneça  informações
adicionais  para  facilitar  a  leitura
do diagrama por parte do usuário.
## 2.
-  Modelando Eventos de negócio
Durante a modelagem de negócio, você modela eventos que acontecem no seu negócio e mostra
como eles interferem no fluxo do processo. Um evento pode ser o ponta-pé inicial de um processo,
pode acontecer durante o fluxo do processo e finalizar o processo. O BPMN fornece uma notação
diferente para cada um desses tipos de eventos como mostrado na tabela abaixo:eventos como mostrado na tabela abaixo:
2.1 Notação básica de tipos de eventos
Evento de Início
(Start Events)
Evento Intermediário
(Intermedate Events)
Evento de Fim
(End Events)
Inicia um
processo
Acontece
durante o
curso de um
processo
Finaliza o
fluxo do
processo
2.2 Eventos mais complexos
Quando  você  modela  fluxos  de  processos  mais  complexos,  você  necessita  modelar  eventos  de
processos mais complexos também, tais como mensagens, cronômetros ou processos mais complexos também, tais como mensagens, cronômetros ou temporizadores, regrastemporizadores, regras
de negócios e condições de erro. O BPMN permite que você especifique o tipo de Gatilho (start) do
evento e o simbolize com um ícone representativo, como especificado na tabela abaixo.um ícone representativo, como especificado na tabela abaixo.
Especificar um tipo de gatilho para um evento coloca certas restrições no fluxo de processo que
você está modelando, conforme especificado na tabela. Por exemplo, um temporizador não pode
ser usado para finalizar um fluxo do processo.
Evento de
Início
Evento
Intermediário
Evento de de Fim Descrição
Mensagem
de início
Mensagem dede
fim
Uma  mensagem  de  início  chega  de  um
participante   ou   gatilho   de   início   do
processo,  ou  continua  o  processo,  neste
caso   um   evento   intermediário.   Uma
mensagem de fim denota a mensagem que
será gerada ao fim do processo.
Temporizador
de início
Temporizador
## OO
temporizador
não pode ser
um evento de
fim
Um tempo específico ou ciclo (por exemplo,
a  cada  segunda-feira  às  9:00AM)  pode  ser
ajustado  para  realizar  o  início  de  um
processo, ou a continuação do processo, no
caso de evento intermediário..
Regra de
início
Regra
A regra não
pode ser um
evento de fim
O  evento  é  iniciado  quando  a  condição  da
regra  for  verdadeira,  tal  como  “faça  novo
pedido
quando
a quantidade do estoque for a quantidade do estoque for
menor de 10%”.
A Ligação não
pode ser um
evento de
Início
Ligação
A Ligação não
pode ser um
evento de fim
É  usado  para  conectar  atividade  um
mesmo processo com a finalidade de deixar
o diagrama mais limpo.
Múltiplo
Início
Múltiplo
Múltiplo Fim
Para um evento de múltiplo início, existem
múltiplas   maneiras   desencadear   o
processo,  ou  de  continuar  o  processo,  no
caso  do  evento  intermediário.  Somente
uma  delas  é  necessária.  O  atributo  do
evento define qual gatilho é acionado. Para
Múltiplo Fim, existe múltiplas
consequências  na  finalização  do  processo,
todos  quais  irão  ocorrer,  como  por
exemplos, múltiplas mensagens enviadas.
A exceção
não pode ser
um evento de
Início
Exceção
Exceção no
fim
Um  evento  de  exceção  no  fim  informa  ao
mecanismo  do  processo  que  um  erro
deverá ser criado. Este erro deverá ser um
evento e exceção intermediária. No evento
de exceção intermediária ele só poderá ser
usado   conectado   na   borda   de   uma
atividade.
Uma
Compensação
não pode ser
um evento de
Início
Compensação
no fim
Um evento de compensação de fim informa
ao  mecanismo  do  processo  que  uma
compensação   é   necessária.   Assim   o
identificador da compensação é usado pelo
evento  intermediário  quando  o  processo
está sofrendo um
roll back roll back
## ..
UmUm
cancelamento
não pode ser
um evento de
Início
Cancelamento
Cancelar no
fim
O  evento  de  fim  significa  que  o  usuário
decidiu  cancelar  o  processo.  O  processo  é
finalizado  com  um  tratamento  de  evento
normal.
Não se se aplica    Não se se aplica
Terminar
Este  tipo  de  fim  indica  que  todas  as
atividades  dentro  do  processo  deverão  ser
imediatamente finalizadas. Isto inclui todas
as  instâncias  das  múltiplas  instâncias.  O
processo é finalizado sem compensação ou
tratamento de evento.
Sinal de Inicio
Sinal
Sinal no fim
Um  sinal  é  usado  para  gerar  comunicação
dentro ou por meio  de níveis de processos,e processos,
Pools e entre diagramas de processos.essos.
## 3.
-  Processo de Negócio, Subprocessos e TarefasProcesso de Negócio, Subprocessos e Tarefas
Um dos pontos-chave da modelagem de processos de negócios é o próprio processo. Existem três
tipos  de  processos  –  O  processo,  o  Sub-Processo  e  a  Tarefa.  Todas  elas  são  desenhadas
graficamente pelo mesmo símbolo retangular de bordas arredondadas; o uso de diferentes nomes
simplesmente reflete a hierarquia do relacionamento entre eles
## 3.1.
3.1.  Decompondo seu processo dentro de hierarquias
Um processo é uma rede de “ações acontecendo”. No BPMN você o desenha com um retângulo
arredondado  como  sendo  seu  nível  mais  alto  no  diagrama  de  processo  de  negócio.  Você  pode
especificar os detalhes internos do processo criando ou ligando-o a outro diagrama de processo de
negócio. Um processo que tem um diagramnegócio. Um processo que tem um diagrama filho recebe um sinal de ‘+’ no seu desenho.‘+’ no seu desenho.
Graficamente  mostramos  detalhes  de  um  processo  como  outro  diagrama  de  processo  de
negócio que é considerado como ‘decomposição’ do processo. Você pode continuar a decompor
processo sem nenhuma restrição. Processos que você desenha como sendo diagrama ‘filho’ são
considerados
Subprocessos
## ..
O menor nível do processo, o qual não pode ser mais decomposto, é
considerado como sendo uma  tarefa.tarefa.
Uma  atividade  representa  o  trabalho  realizado  dentro  de  um  processo.  Uma  atividade
normalmente  levará  algum  tempo  para  ser  realizada, envolverá  pessoas  e  recursos  (sistema  de
informática - Aplicação) e normalmente irá produzir algum tipo de saída.
Atividades – Tarefa
Genérico  ou  Indefinido,  Frequentemente
usado   durante   o   estágio   inicial   do
desenvolvimento do processo.
## Manual
,  é  uma  Tarefa  não-automática
realizada por humano fora do controle do
WorkFlow ou da solução BPM.
Receber Mensagem,
espera    uma
mensagem  chegar  de  um  participante
externo  (relacionado  com  o  processo  de
negócio).  Uma  vez  recebida  a  tarefa  é
completada. Seu comportamento é similar
ao evento de chegada de mensagem.
Script,
realiza um Script.
Envia Mensagem,
dispara uma mensagem
a  um  participante  externo.  Uma  vez
enviada   mensagem   a   tarefa   é
completada. Seu comportamento é similar
ao evento de envio de mensagem.
Serviço,  ligado  a  algum  serviço,  o  qual,  ligado  a  algum  serviço,  o  qual
pode ser um web service ou uma aplicação
automática.
Usuário
,  típica  tarefa  realizada  por  um
humano com auxílio de uma aplicação.
Atividades – Subprocesso
Estado Contraído
Estado Expandido
## LOOP PADRÃO
Uma atividade deloop padrão  terá  uma  expressão  booleana  que  é  avaliada  para  cada  ciclo  do
loop. Se a expressão for VERDADEIRA, então o loop irá continuar. Existem duas variações do loop,
as quais refletem no construtor de programaçãoWHILE(enquanto)WHILE(enquanto)  eeUNTIL(até)UNTIL(até).  O  loop.  O  loopWHILE WHILE
avalia a expressão antes que a atividade seja realizada, isto significa que a atividade talvez não seja
realizada.
O loop
## UNTIL
irá avaliar a expressão após a realização da atividade, isto significa que atividade vai irá avaliar a expressão após a realização da atividade, isto significa que atividade vai
ser realizada pelo menos uma vez.
O exemplo a seguir mostra uma situação típica de loop em processo,
Aplicando uma atividade de loop (neste caso um subprocesso) o fluxo ficaria:
A expressão booleana seria “O produto não passou no teste?” se a resposta for “verdade” então a
atividade será realizada novamente e se for “Falsa” atividade será realizada novamente e se for “Falsa” o processo seguirá seu fluxo.o processo seguirá seu fluxo.
Loop Multi-Instance
Loop
Multi-Instance
reflete o construtor de  reflete o construtor de programação de cada uma. programação de cada uma.  A expressão de avaliação
para um loop
Multi-Instance
é uma expressão numérica avaliada somente antes que a atividade é uma expressão numérica avaliada somente antes que a atividade
seja realizada. O resultado da avaliação da expressão será um número inteiro que especificará o
número de vezes que a atividade se repetirá. Existem também duas variações para o loop
Multi-
Instance
onde a estância será  onde a estância será realizada sequencialmente ou paralelamente.realizada sequencialmente ou paralelamente.
••Graficamente é representado por três linhas verticais
••A quantidade de vezes que a atividade vai ser realizada é conhecida antes de ativá-la.conhecida antes de ativá-la.
## ••
Cada atividade realizada é distinta das outras.outras.
••É usado quando desejamos realizar uma atividade várias vezes com um conjunto de dados
diferentes.
••As  Instâncias  podem  ocorrer  sequencialmente  ou  em  paralelo.  Atributos  devem  definirAs  Instâncias  podem  ocorrer  sequencialmente  ou  em  paralelo.  Atributos  devem  definir
estas características.
••Exemplo: Quando uma matriz de uma empresa está verificando os resultados financeirosExemplo: Quando uma matriz de uma empresa está verificando os resultados financeiros
de todas suas filiais. A condição de loop seria ade todas suas filiais. A condição de loop seria aquantidade de filiais que serão analisadas. que serão analisadas.
## AD HOC
Uma  atividade
Ad  Ad  HOCHOC
é  identificada  por  um‘~’‘~’.  Mas  atividades  (.  Mas  atividades  (
tarefas
)  em  seu  interior  são
soltas,  ou  seja,  elas  não  são  conectadas,  isto  significa  que  estas  atividades  podem  ocorrer  em
qualquer  ordem  e  várias  vezes  e  não  existe  a  obrigatoriedade  executar  todas  tarefas.
Geralmente  este  tipo  de  atividade  está  relacionado com  atividades  humanas,  onde  a  ordem,  a
quantidade de vezes e quais atividades serão realizadas, são decididas quantidade de vezes e quais atividades serão realizadas, são decididas por quem as realiza.por quem as realiza.
No próximo exemplo temos um subprocesso que é realizado por um estagiário de um escrito de
advocacia, ele terá que montar uma pasta com todos os documentos pertinentes ao processo que
o  referido  escritório  irá  trabalhar.  Para  realizar este  trabalho  ele  precisará  tirar  fotocópias  dos
documentos originais, tem que levá-los para reconhecimento de firma em cartórios, pode passar
fax, etc e não existe uma sequência definida. Cadafax, etc e não existe uma sequência definida. Cadatarefa pode ser realizada quantas vezes forem
necessárias, para o cumprimento da atividade “necessárias, para o cumprimento da atividade “Montagem de Processos Jurídicos”.”.
## 4.
Token
Para ajudar-nos na compreensão do comportamento fundamental do modelo do BPMN usaremos
o conceito de TOKEN. Token pode ser concebido como o objeto “Teórico” que nós usamos para
criar  um  comportamento  descritivo  do  comportamento “simulação”  dos  elementos  de  fluxo  da
notação BPMN. Utilizando este artifício podemos descrever como este teórico componente viaja
por meio do fluxo de sequência e dos objetos de fluxos.sequência e dos objetos de fluxos.
O Token atravessa do início até o fim do fluxo de sequência (Flecha), instantaneamente; não existe
um tempo associado com o Token enquanto percorre o fluxo de sequência.sequência.
Podemos pensar no Token como um pulso elétrico que percorre os elementos de fluxo do BPMN.do BPMN.
Token
Sendo assim podemos imaginar como seria uma possível trajetória do token no seguinte fluxo de
processo se os documentos estiverem Ok..
## 5.
-  Ciclo de Vida da atividade
Quando  se  inicia  uma  atividade,  isto  é,  quando  o  Token
chega  a  esta  Atividade,  ela  muda  o  Status  parachega  a  esta  Atividade,  ela  muda  o  Status  para"Pronta""Pronta"
isso não significa que a atividade começou imediatamente.
Outros  fatores  podem  também  afetar  a  realização  desta
atividade.
Neste exemplo a atividade (tarefa) Rever Projeto tem duas
entradas separadas (Projeto lógico e Projeto Físico) se essas
entradas  não  estão  disponíveis  quando  oToken  chega  à
atividade, então essa atividade não pode começar.
Para o tipo de tarefa (Para o tipo de tarefa (Usuário) é necessário o uso de uma aplicação e de um operador, se ambos) é necessário o uso de uma aplicação e de um operador, se ambos
não tiverem disponíveis a atividade também não pode começar.começar.
Quando  todas  restrições  estiverem  resolvidas  então  a  atividade  pode  ser  iniciada.  Neste
momento ela muda o status para"Em execução”"Em execução”e quando a atividade é finalizada ela muda o
Status para"Completada"."Completada".
Enquanto a atividade está no Status "Enquanto a atividade está no Status "Em Execução" ela pode mudar para o status de" ela pode mudar para o status de"Pausada","Pausada",
"Reiniciada""Reiniciada"ee"Interrompida","Interrompida",modelando  pontos  de  decisões  com
Gateways ou Comporta de
decisão
## ..
## 6.
-  Modelando  pontos  decisões  com  Gateways  (Comporta  deModelando  pontos  decisões  com  Gateways  (Comporta  de
decisão)
Gateways  são  elementos  de  modelagem  que  controlam  como  os  fluxos  de  processo  divergem
(Split)  ou  convergem  (me(Split)  ou  convergem  (merge)  representando  pontorge)  representando  pontos  de  controle  para  os  caminhos  dentro  do
processo.
Se um processo não requer controle, então não há necessidade do uso ontrole, então não há necessidade do uso do elemento Gateway.do elemento Gateway.
Decisões, uniões, bifurcação e as combinações no fluxo do processo são modeladas com o símbolo
de gateway. Podemos pensar no gateway como sendo as questões que são feitas em um ponto do
fluxo do processo. A questão tem definido um conjunto de respostas alternativas, o qual afeta uma
das portas do  Gateway (ou Comporta).Gateway (ou Comporta).Os símbolos representando os tipos de  Gateways  estão
descritos na tabela abaixo::
Tokenn
Gateways ou Comportas
Exclusive Gateway Decision
NoNo
Gateway Exclusive Baseado em Dados
, as condições para as alternativas devem ser avaliadas na
ordem especificada. A primeira das alternativas que for avaliada como VERDADEIRA irá determinar o
fluxo  que  será  seguido.  Visto  que  o  comportamento  do
## Gateway
é  exclusivo,  qualquer  outra  é  exclusivo,  qualquer  outra
condição  que  realmente  possa  ser  VERDADEIRA  irá  ser  ignorada.  Somente  um  caminho  pode  ser
escolhido. Um dos caminhos deve ser o padrão
## (DEFAULT)(DEFAULT)
e é o ultimo caminho a ser considerado. e é o ultimo caminho a ser considerado.
Isto significa que se nenhum dos outros caminhos for escolhido, então o caminho padrão irá ser o
escolhido.
Supondo  que  na  execução  deste  fluxo  a  resposta  do  Gateway  seja  “Sim”  então  o  Token  teria  o
seguinte comportamento.
Exclusive Gateway Merge (XOR)
Exclusive Gateway também pode ser usado como convergentes de Fluxos (Merge). Isto é, ele pode
ter múltiplas entradas de fluxo de sequência. Entretanto, quando um Token chega a um Exclusive
Gateway,  não  há  validação  de  condição.  Nem  há  necessidade  sincronização  de  TOKENS  que
possam  vir  de  qualquer  dos  outros  fluxos  de  sequência. sequência.   O  Token,  quandO  Token,  quando  chega  ao  Exclusivee
Gateway, imediatamente move-se para o fluxo de saída. Geralmente se utiliza este Gateway quando
a  atividade  que  vem  após  este
Gateway  Exclusive
é  comum  a  todas  ramificações  que  o  é  comum  a  todas  ramificações  que  o
antecedem.  No  exemplo  abaixo  a  Atividade  “Preparar Compras  do  Cliente”  será  realizada
independente da forma de pagamento. Então, supondo que o pagamento tenha sido realizado em
dinheiro o fluxo do Token Seria:
Event-Based
Exclusive Gateway Decision
OOExclusive Gateway Baseados em eventos representa uma alternativa de pontos de ramificações
onde  a  decisão  é  baseada  sobre  dois  ou  mais  eventos  que  possam  ocorrer.  Ele  tem  o  mesmo
comportamento do
Exclusive  Gateway  Baseado  em  dados
, isto é, somente uma das ramificações
será escolhida. Processos que envolvem comunicação com parceiro de negócio ou alguma entidade
externa necessita deste comportamento. No exemplo acima a atividade “Enviar Proposta de Crédito”
é  usada  para  enviar  uma  proposta  a  um  cliente  (entidade  Externa),  seguindo  o  Fluxo  temos  um
Exclusive Gateway Baseados em eventos
, neste ponto o processo fica esperando que um dos três
possíveis eventos aconteça: ou chega até ele uma mensagem “SIM”, uma mensagem “NÃO” ou o
“Temporizador de 5 dias” “Temporizador de 5 dias”  finaliza a contagem. O comportamento é que quando o Token chega nestefinaliza a contagem. O comportamento é que quando o Token chega neste
Gateway ele é replicado para cada um dos eventos.cada um dos eventos.
Assim o primeiro evento que venha ocorrer disparará seu Token e eliminará os demais. Partindo do
exemplo acima, suponhamos que o cliente enviou a mensagem “SIM”, neste caso o Token que está
no Evento que receberá a mensagem “SIM” irá seguir o seu caminho e os demais serão eliminados.
Parallel Gateway Decision
Um Gateway paralelo é também chamado de AND. chamado de AND.  Não há processo de decisão, todos os de decisão, todos os caminhos são
seguidos. Quando um token chega a um
Parallel
Gateway não existe avaliação de condição sobre o fluxo de
sequência (Diferentemente do
## Exclusive Gateway Exclusive Gateway
), por definição este gateway irá criar caminhos paralelos,
isto significa que o Gateway irá criar o número de Tokens iguais ao número de fluxo de sequência de saídas.
No exemplo acima após a Atividade “Preparar Documentos para Assinatura”, tanto a Atividade “Preparar
Contrato” quanto “Preparar Procuração” serão executadas.
Parallel Gateway Merge
Utilize o GatewayParallel Gateway Mergequando os caminhos paralelos necessitam ser sincronizados
antes de o processo continuar. Para sincronizar o fluxo, o
## Parallel Gateway Parallel Gateway
irá esperar que todos os Tokens irá esperar que todos os Tokens
cheguem  de  cada
Fluxo  de  sequência
de  entrada.  No  exemplo  acima,  suponhamos  que  a  atividade  de  entrada.  No  exemplo  acima,  suponhamos  que  a  atividade
“Preparar  Contrato”  termine  primeiro  do  que  a  atividade  “Preparar  Procuração”  o  Token  ““Preparar  Contrato”  termine  primeiro  do  que  a  atividade  “Preparar  Procuração”  o  Token  “T1T1”  desta”  desta
atividade chegará primeiro no
Parallel Gateway.
Este então esperará que o Token “Este então esperará que o Token “T2T2” da atividade “Preparar Procuração” chegue para sincronizar ambos” da atividade “Preparar Procuração” chegue para sincronizar ambos
os toquens e dar continuidade ao fluxo do processo.fluxo do processo.
Inclusive Gateway Decision
Tal  como  o
Exclusive  Gateway  (decision)
,  um  ,  um
Inclusive  Gateway  (decision)
tem  várias  tem  várias
sequências de saída, cria vários caminhos (ramificações) alternativos baseados sobre as condições
destes  fluxos  de  sequência.  A  diferença  é  que  o
## Inclusive  Gateway Inclusive  Gateway
pode  ativar  uma  ou  mais  pode  ativar  uma  ou  mais
ramificações, isto significa que, uma ou ramificações, isto significa que, uma ou mais das saídas do fluxo de sequência pode ser seguida.de sequência pode ser seguida.
Cada condição que for avaliada como verdadeira irá resultar em um Token movendo sobre este
fluxo de sequência. Não pode acontecer de não ter saída. Caso nenhuma condição seja satisfeita
você deve especificar uma saída padrão (defauvocê deve especificar uma saída padrão (default). lt).  No exemplo acima o fluxo “Cartão de Débito?”   No exemplo acima o fluxo “Cartão de Débito?”
é a saída padrão, identificada com um corte transversal (“/”) no seu fluxo de sequência.
Partindo do exemplo acima, suponhamos que na atividade “Definir Serviço” foram escolhidos os
seguintes serviços:
1.1.  Cheque Especial
2.2.  Cartão de Crédito Internacional
3.3.  Cartão de Débito
O comportamento do Token seria,
Caso na atividade “Definir Serviços” não fosse escolhida nenhum serviço, o caminho padrão seria
então ativado, assegurando que o processo não então ativado, assegurando que o processo não fique emperrado.fique emperrado.
Inclusive Gateway Merge
## OO
Inclusive  Gateway  Merge
irá  sincronizar  cada  um  dos  Tokens  que  estejam  nos  fluxos  de  irá  sincronizar  cada  um  dos  Tokens  que  estejam  nos  fluxos  de
sequência, isto que disser que enquanto tiver um Token em qualquer um dos fluxos de sequência
que cheguem ao
inclusive Gateway inclusive Gateway
o processo não tem andamento. o processo não tem andamento.
Partindo  exemplo  acima,  suponha  que  a  atividade “confeccionar  cheque  Especial”  termine
primeiro  que  as  atividades  “Confeccionar  Cartão  Internacional”  e  “Confeccionar  Cartão  de
Débito” então o Token “T1” desta atividade chega ao
## Inclusive Gateway Inclusive Gateway
. Este percebe que tem
mais dois Token “T2” e “T3” que faltam chegar.
## ..
Agora a atividade “Confeccionar Cartão de Débito” é completada, então o Token “T3” sai desta
atividade e chega ao
## Inclusive Gateway Inclusive Gateway
, que fica esperando pelo o ultimo Token “T2”.
Por  último  a  Atividade  “Confeccionar  Cartão  Internacional”  é  completada,  neste  momento  o
Token  “T2”  sai  desta  atividade  e  chega  ao  Inclusive  Gateway.  Agora  todos  Tokens  serão
sincronizados e deste Gateway sairá um único Token dando continuidade ao fluxo do Processo.do Processo.
Token
Sicronizado
Complex Gateway Decision
Quando  o  Gateway  é  usado  como  uma  decisão,  então  a
expressão
determina  a  saída  que  o  fluxo  de  determina  a  saída  que  o  fluxo  de
sequência irá escolher para continuar o processo. A expressão talvez se refira ao dado do processo e ao
status para fluxo de sequência de saída. Por exemplo, uma expressão talvez avalie o dado do processo e
então selecione um conjunto de saída do fluxo de sequência, baseados sobre os resultados da avaliação.
Porém, a expressão deverá ser projetada para que ao menos uma das saídas do fluxo de sequência seja
escolhida.
No Exemplo acima a expressão avalia se o pagamento foi realizado a vista ou Cartão de Débito, no caso de
acontecer uma destas atividades então a atividade “Entregar Brinde” ocorrerá também.
A expressão foi colocada em um
elemento de notação, para uma
melhor clareza
Complex Gateway Merge
Quando o Gateway é usado como merge, então nele deverá ter uma expressão que determinará qual das
expressões do fluxo de seqüência irá ser obrigatória para o processo continuar. A expressão talvez se refira
ao dado do processo. Por exemplo, uma expressão pode especificar que qualquer uma dos 2, dentre os 3
fluxos de seqüência de entrada, irá continuar o processo. Outro exemplo poderia ser uma expressão que
especifique o
Token
da  atividade  “Realizar  Teste  A”  é  requerido  para  fluxo  de  sequência  e  que  um  da  atividade  “Realizar  Teste  A”  é  requerido  para  fluxo  de  sequência  e  que  um
Token
da sequência de fluxo “Realizar Teste B” ou “Realizar Teste C” é aceitável. Porém, a expressão deve da sequência de fluxo “Realizar Teste B” ou “Realizar Teste C” é aceitável. Porém, a expressão deve
ser projetada de tal forma que processo não crie um impasse.
No exemplo acima estamos especificando que oteste A é obrigatório e que qualquer uma das outras duas
atividades  é  opcional.  Isto  é,  o  Token  da  atividade  A  deve  ser  sincronizado  com  um  ou  os  dois  outros
Tokens .
Suponha que o Token “T1” da atividade “Realizar Teste A” chegue aoSuponha que o Token “T1” da atividade “Realizar Teste A” chegue aoComplex Gateway Mergeeste irá
esperar por mais um Token para dar sequência ao Fluxo do processo.
Agora a atividade “Realizar Teste C” finaliza. Neste momento o seu Token “T3” chega ao
Complex
Gateway Merge
e este é sincronizado com o Token “T1” e o fluxo do processo tem continuidade.
## 7.
-  Pools e Lanes – Quem faz o quê?Pools e Lanes – Quem faz o quê?
À medida que você progride na modelagem de fluxo de processo, você pega os processos, eventos
e gateways do diagrama de processo de negócio e os colocam dentro de
Pools
ououLanes.Lanes.  UmUm
Pool  é um desenho com uma região retangular desenhada horizontalmente através do diagrama.é um desenho com uma região retangular desenhada horizontalmente através do diagrama.
Uma  Lane  é  uma  subpartição  dentro  do  Pool  e  estende-se  por  todo  comprimento  do  Pool.e  estende-se  por  todo  comprimento  do  Pool.
Tipicamente, um Pool representa uma organização e a
Lanerepresenta os departamentos dentro
desta organização. Pegando os processos e colocando-os dentro de um
Pool
ou ou
Lanes
## ,,
você está
## TOKEN
Sincronizado
especificando  QUEM  fazfaz  O QUÊ,,especificando,,para eventos,para eventos,  ONDE  eles ocorrem e para os
gatewaysONDE AS DECISÕES  são tomadas, ousão tomadas, ou  QUEM  as toma..
Poderíamos  fazer  uma  analogia  entre  estas  representações  e  uma  piscina,  é  bem  interessante.
Você pode imaginar um processo como sendo uma piscina com raias dentro dela, e a sendo uma piscina com raias dentro dela, e a troca de raias
como a necessidade de realizar uma atividade dentro dela. Então um Pool pode ser considerado
como uma piscina de recursos. Existe ocasião em que o processo necessita saltar para outro Pool,
porque este tem diferentes recursos necessários para completar a atividade.
## 7.1.
7.1.  Um POOL pode representar muitas coisas
Um Pool pode representar outras coisas além de uma organização, tais como uma Função (Algo
que a organização realiza, tal como Vendas, Treinamentos ou Compras),que a organização realiza, tal como Vendas, Treinamentos ou Compras),  uma Aplicação (ou programa deuma Aplicação (ou programa de
computador)
,,uma Localização (Uma localização física na companhia), uma Classe (Um módulo de umuma Localização (Uma localização física na companhia), uma Classe (Um módulo de um
software em um programa orientado a objeto), ou uma entidade (representação lógica de uma
tabela de um banco de dados). Ele pode somente representar uma coisa. Mais esta coisa pode ser
de diferentes tipos.
Concluindo, BPMN está destinado a ser o novo padrão de modelagem de processos de negócio e
Web Services. Ele é projetado para lhe permitir facilmente modelar típicos processos de negócios,. Ele é projetado para lhe permitir facilmente modelar típicos processos de negócios,
e oferecem a capacidade de modelar processos de negócios complexos, incluindo a passagem de
mensagens viaWeb Services.Web Services.
yg  ,  p
Aprendendo BPMN por meio de um
exemplo
Business  Process  Modeling  Notation  BPMN  proporciona  uma  linguagem  comum  para  que  as  partes
envolvidas possam comunicar os processos de forma clara, completa e eficiente. Desta forma BPMN define a
notação e semântica de um diagrama de Processos de Negócio (Business Process Diagram, BPD).
BPBPD é u D é um Dm Diagr   iagram ama desenh a desenhado para representar graficamente a sequência de todas as atividades  queque
ocorrem  durante  um  processo  baseado  na  técnica  de  “Flow  Chart”,  incluindo  todas  informações
necessárias para análises.
BPD é um diagrama desenhado para ser usado pelos analistas de processos os quais desenham, controlam e
fazem gestão dos processos. Dentro de um Diagrama de Processo de Negócio BPD se utilizam um conjunto
de elementos gráficos, que se encontram agrupados em categorias.
Para introduzir o tema de BPMN, no decorrer deste documento o leitor se encontrará com uma série de
exemplos desenvolvidos em torno de um processo de Solicitação de crédito de Consumo
Um processo de crédito consta basicamente de um registro de solicitação, em que o cliente irá manifestar seu
interesse  de  adquirir  um  crédito.  Nesta  etapa  se  inclui  a  apresentação  da  solicitação  e  documentação
requerida pela entidade de Crédito, na sequência se realiza uma verificação das informações, posteriormente
segue  a  etapa  de  análise  da  solicitação  de  crédito e  por  ultimo  encontramos  atividades  referentes  à
realização efetiva do crédito ou comunicação da recusa ao cliente.
yg  ,  p
Como pode observar no exemplo acima, dentro de um diagrama de processos de negócio existe um conjunto
de elementos gráficos que nos permitem representar um processo de negócio.
No No exemplo anteri    plo anterior se pode e  visualizar diferferentes tipos de elementos que descrevem o comportamento do
processo, dentre estes elementos encontramos as ATIVIDADES que representam o trabalho realizado, os
EVENTOS de início e de fim do processo que indicam o início e o fim do processo e os elementos de decisão
conhecidos em BPMN como Gateways (comportas) que indicam uma divisão no caminho. Estes elementos se
encontram conectados por linhas de sequência que mostram como flui o processo. O princípio do processo de
solicitação de crédito está evidenciado na figura “Evento de início” indicando o começo do processo. Os
processos podem iniciar de diferentes formas, BPMN fornece diferentes tipos de eventos de início (Simples,
mensagem, sinal entre outras).
O Gateway ou Comporta utilizada dentro do exemplo anterior é a comporta EXCLUSIVE, esta comporta como
elemento de decisão se comporta como um “XOR”, que dizer, das varias alternativas apresentadas só uma
delas pode ser tomada. Dentro do processo de solicitação de crédito podemos observar dois exemplos do uso
da comporta EXCLUSIVA, no primeiro dependendo do resultado da verificação da informação do solicitante o
fluxo tomaria um caminho; o outro, se o resultado for “Recusado” o processo terminaria e se o solicitante for
aceito o processo continua. Na segunda comporta a decisão será tomada com base no resultado do estudo do
pedido do crédito, uma vez que se a solicitação for recusada o cliente é informado e se for aprovada se
procede com a realização do desembolso.
Se analisarmos o processo de solicitação de crédito, podemos ver que existem atividades que podem ser
analisadas  com  mais  detalhes,  uma  destas  atividades  é  a  “Verificação  da  Informação  “  fornecida  pelo
solicitante,  uma  vez  que  normalmente  as  entidades  que  concedem  créditos  realizam  várias  análises  do
solicitante , por exemplo se verifica se o solicitante já é um cliente da entidade, se é um cliente que o banco
tem interesse, ou por outro lado, se este se encontra em uma lista de clientes negativados e posteriormente,
consulta sua situação financeira.
A As a s atitivvididaaddees ps pooddeem m sseer cr coommppoosstatas os ou u AAtôtômmicicaa, d, deenntrtro o ddo o BBPPMMN N aas a  s atitivvididaaddees cs coommppoosstatas ss sãão o ccoonnhheeccididaass
como Sub-Processos e as atividades atômicas como tarefas.
Tarefas  (task):Tarefas  (task):  Uma  tarefa  é  utilizada  quando  o  trabalho  no
processo não é mais decomposta em mais detalhes. É executada
por uma pessoa e/ou uma aplicação.
Subprocesso:Subprocesso: É uma atividade composta que é incluída dentro
de um processo. Esta atividade por sua vez é composta de um
conjunto de atividades e uma sequência lógica (processo) que
indica  que  a  referida  atividade  pode  ser  analisada em  mais
detalhes, visualmente pode aparecer em modo contraído ou
expandido.
O  diagrama  de  fluxo  do  processo  de  solicitação  de  Crédito
ficaria  da  seguinte  maneira  ao  transformar  a  atividade  “Verificar  Informação  do  Solicitante”  como  um
subprocesso.
O Subprocesso ‘”Verificar Informação do Solicitante” pode ser:
Também é possível visualizar o processo de solicitação de crédito com o subprocesso “Verificar Informação
do Solicitante” expandido:
A Addicicioionnaalmlmeenntete, ,  ddeenntrtro o ddo o SSuubbpprorocceesssso o “V“Veerrifificicaar r  InInfoformrmaaççãão o ddo o SSooliliccititaanntete” ” eennccoonntrtraammoos s aatitivvididaaddeess
“Verificar a Existência do Cliente”, “Verificar Lista de Negativados” e “Verificar Perfil de Crédito” que são
tarefas automáticas, em que a realização ocorre por meio de um sistema sem a intervenção humana, podendo
ser uma aplilicação automátiática ou um serviço W  ço WEB. Para diagrama   EB. Para diagramar este tipo de atividades BPMPMN propõe   N propõe  umum
tipo de tarefa chamada Tarefa Automática (Service).
O Subprocesso “Verificar Informação do Solicitante” teria agora o seguinte aspecto:
Outra das atividades do processo de Solicitação de Crédito que pode ser mais detalhada é a atividade é a
“Desembolsar Crédito”.
Se visualizarmos o Subprocesso “Desembolsar Crédito” representado no diagrama abaixo, podemos observar
que existem várias formas de desembolsar um crédito; Desembolsar em Conta, abono em outro crédito ou
Cheques.  Estas  formas  não  necessariamente  têm  que  ser  excludentes,  quer  dizer,  um  crédito  pode  ser
desembolsado usando só uma das formas disponíveis, ou usando diferentes combinações, por exemplo, uma
parte com abono em uma conta e outra parte em cheque. Para diagramar esta situação de negócio se utiliza o
Gateway (Comporta) INCLUSIVE como elemento de decisão, esta comporta permitirá ativar um ou vários
caminhos dependendo dos dados do processo.
Uma vez desembolsado o crédito deve-se informar ao cliente o resultado, mas é necessário que todas as
ramificações que foram ativadas sejam finalizadas para realizar a atividade de “Informar Resultado ao Cliente”,
para isto se utiliza a Comporta (Gateway) “Inclusive” como elemento de convergência (Sincronizador) o que
significa que esta esperará por todas as ramificações ativadas antes de continuar o fluxo.
No  exemplo  anterior  visualizamos  uma  ANOTAÇÔES  dentro  diagrama  do  processo,  BPMN  provêem
diferentes artefatos que permitem incluir informações adicionais sobre o diagrama e desta forma fornece ao
leitor maiores detalhes do processo.
No BPMN também é possível detalhar quais atividades são automáticas (No BPMN também é possível detalhar quais atividades são automáticas (Tarefas  Automáticas) ,quais são) ,quais são
realizadas  com  ajuda  de  um  sistema  (realizadas  com  ajuda  de  um  sistema  (Tarefa  de  Usuário),  quais  são  realizadas  manualmente  (),  quais  são  realizadas  manualmente  (Tarefas
Manuais), dentre outras.), dentre outras.
Dentro  do  Subprocesso  “Desembolsar  Crédito”,  as  tarefas  de  “Desembolsar  com  abono  em  Conta”,
“Desembolsar em Cheque” e “Desembolsar com abono a Outro Crédito” são“Desembolsar em Cheque” e “Desembolsar com abono a Outro Crédito” sãoTarefas  Automáticas, quer, quer
dizer, são realizadas por sistemas sem a intervenção humana, adicionalmente poderíamos especificar que a
atividade “Entregar Cheque” é uma tarefa completamenteatividade “Entregar Cheque” é uma tarefa completamenteManuale que a atividade “Completar Informaçõese que a atividade “Completar Informações
Desembo   mbolso”    lso” é reali   é realizada com ajuda de uma apliplicação, cação,  indicada como umaaTarefa de Usuário..
Suponhamos que uma vez aprovado o crédito é necessário coordenar uma data de desembolso com o cliente,
para tanto o desembolso efetivo só deveria ser feito unicamente no dia acordado com o cliente. Para isto, é
necessário realizar uma espera antes das tarefas de desembolso. bolso.  O BO BPM PMN o N oferferece o Evento Intermediário
Temporizador , o qual é um tipo de evento intermediário que representa uma espera dentro do Fluxo., o qual é um tipo de evento intermediário que representa uma espera dentro do Fluxo.
Retornando  ao  processo  de  Solicitação  de  Crédito,  é  possível  que  em  um  determinado  momento  da
solicitação, o cliente não apresente todos os documentos requeridos, mas não é possível continuar com o
processo até que toda a documentação esteja completa. Por isso faz-se necessário incluir uma atividade de
recepção de documentação de documentos, mas o cumprimento desta atividade depende do cliente e não do
funcionário da entidade. Para esta situação é possível utilizar umfuncionário da entidade. Para esta situação é possível utilizar umEvento Intermediário Simples.Evento Intermediário Simples.
Pd B  G   fi Tl   i   Atil  V  2 1
No caso anterior o evento Intermediário Simples “Receber Docs” representa algo que pode ocorrer dentro do
fluxo do processo e não depende do usuário e sim de um cliente externo .
Temos mais um detalhe que devemos prestar atenção. A entrega de documentos é algo que pode ou não
ocorrer dentro do processo, isto é, o cliente pode não apresentar os documentos ou levar muito tempo para
fazê-lo, por isso é necessário controlar o tempo que é dado ao cliente para a entrega dos documentos e desta
forma poder cobrá-lo caso não o faça ou demore muito tempo para fazê-lo. Para isto é necessário diagrama
dentro do processo de Solicitação de Crédito as seguintes situações: o cliente tem um tempo para entregar os
documentos, se isto não ocorre dentro deste tempo, se desabilita o evento simples de “Receber Docs” e se
procede à atividade de “Contactar o Cliente” para que este traga os documentos. Porém se os documentos
são entregues pelo cliente dentro do tempo esperado, se revisão os documentos e o tempo que controla a
entrega dos documentos deve deixar de correr, isto é, se desabilita o “
EveEvento    nto intermediário Temporizador    intermediário Temporizador
## ””..
Para diagramar esta situação vamos utilizar a Comporta (Gateway)Para diagramar esta situação vamos utilizar a Comporta (Gateway)Exclusiva  Baseada  em  Eventos, esta, esta
comporta  permite  habilitar  vários  caminhos  alternativos  e  somente  um  deles  será  executado,  “O  primeiro
Ganha” já que este ganhador desabilita todos os outros caminhos.
O processo se visualizaria da seguinte forma:
Pd B  G   fi Tl   i   Atil  V  2 1
Por ultimo, os diagramas de processos de negócio normalmente utilizam separadores visuais indicando papeis
ou diferentes responsabilidades das atividades de um processo BPMN permite diagramar as diferentes áreas
ou participantes que interagem dentro do processo, para isto vamos utilizar Lanes e o processo ficaria da
seguinte    inte forma..
Pd B  G   fi Tl   i   Ail  V  2 1
## Referencias:
## 1.1.
Business Process Modeling Notation, V1.1Business Process Modeling Notation, V1.1OMG Available SpecificationOMGOMG
Document Number: formal/2008-01-17 Standard document URL:
http://www.omg.org/spec/BPMN/1.1/PDF
2.2.BPMN and Business Process Management ,Introduction to the New BusinessBPMN and Business Process Management ,Introduction to the New Business
Process Modeling Standard  By Martin Owen and Jog Raj, Jog Raj, Popkin Software
3.3.BPMN Modeling and Reference Guide, Stephen A. White, Derek Miers.BPMN Modeling and Reference Guide, Stephen A. White, Derek Miers.
4.4.Business Process Model and Notation (BPMN) 2.0 Request For Proposal OMGBusiness Process Model and Notation (BPMN) 2.0 Request For Proposal OMG
Document: Document: BMI/2007-06-0BMI/2007-06-055
5.5.Introduction to BPMN Stephen A. White, Introduction to BPMN Stephen A. White, BPM Architect, IBMBPM Architect, IBM
6.6.Modelagem de Processos de negócios com BPMN, Gluco S. Reis. EditoraModelagem de Processos de negócios com BPMN, Gluco S. Reis. Editora
PortalBMP,PortalBMP,  www.portalbpm.com.br
www.portalbpm.com.br ..
7.7.  Documentação Bizagi,Documentação Bizagi, www
www.bizagi..bizagi.comcom
8.8.The MicroGuide Process Modeling in BPMN, Tom Debevoise , Rick Geneva.The MicroGuide Process Modeling in BPMN, Tom Debevoise , Rick Geneva.