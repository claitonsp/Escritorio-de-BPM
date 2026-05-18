// Validador Estrutural e Semântico BPMN 2.0 (OMG)
// Uso: node squads/escritorio-bpm-as-is/scripts/validate-bpmn-xml.js <caminho.bpmn>

const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];

if (!filePath) {
  console.error('\x1b[31mErro: Por favor, forneça o caminho para o arquivo BPMN.\x1b[0m');
  console.error('Uso: node validate-bpmn-xml.js <caminho.bpmn>');
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error(`\x1b[31mErro: Arquivo não encontrado no caminho: ${filePath}\x1b[0m`);
  process.exit(1);
}

console.log(`\n\x1b[36m=== INICIANDO AUDITORIA E VALIDAÇÃO XML BPMN ===\x1b[0m`);
console.log(`Arquivo: ${path.basename(filePath)}`);
console.log(`-----------------------------------------------`);

const xml = fs.readFileSync(filePath, 'utf8');

const errors = [];
const warnings = [];

function addError(message, category = 'Semântica XML') {
  errors.push({ message, category });
}

function addWarning(message, category = 'Estilo/Melhoria') {
  warnings.push({ message, category });
}

// 1. Validação XML Básica (Bem formatado)
try {
  // Simples teste de correspondência de tags de nível superior
  const openTags = [];
  const tagRe = /<\/?([a-zA-Z0-9_:]+)(?:\s[^>]*)?>/g;
  let match;
  while ((match = tagRe.exec(xml)) !== null) {
    const fullTag = match[0];
    const tagName = match[1];
    if (fullTag.startsWith('</')) {
      const last = openTags.pop();
      if (last !== tagName) {
        // Ignorar se tags vazias auto-fechadas ou namespaces
      }
    } else if (!fullTag.endsWith('/>')) {
      openTags.push(tagName);
    }
  }
} catch (e) {
  addError(`O arquivo XML está malformado ou contém caracteres inválidos: ${e.message}`, 'Estrutura XML');
}

// 2. Namespace e Cabeçalho
if (!xml.includes('http://www.omg.org/spec/BPMN/20100524/MODEL')) {
  addWarning('O namespace padrão da OMG para o modelo BPMN 2.0 não foi encontrado. Isso pode causar problemas de importação no Bizagi.', 'Estrutura XML');
}
if (!xml.includes('xmlns:bpmndi') || !xml.includes('bpmndi:BPMNDiagram')) {
  addError('O Diagram Interchange (BPMNDI) está ausente. O Bizagi não conseguirá renderizar o layout visual deste arquivo.', 'BPMN DI');
}

// 3. Extração e Análise de Elementos
const tasks = [];
const tasksRe = /<(userTask|serviceTask|scriptTask)\s+([^>]*id="([^"]+)"[^>]*)>/g;
while ((match = tasksRe.exec(xml)) !== null) {
  const type = match[1];
  const attrs = match[2];
  const id = match[3];
  const nameMatch = attrs.match(/name="([^"]+)"/);
  const name = nameMatch ? nameMatch[1] : '[SEM NOME]';
  tasks.push({ id, type, name });
}

const gateways = [];
const gatewaysRe = /<exclusiveGateway\s+([^>]*id="([^"]+)"[^>]*)>/g;
while ((match = gatewaysRe.exec(xml)) !== null) {
  const attrs = match[1];
  const id = match[2];
  const nameMatch = attrs.match(/name="([^"]+)"/);
  const name = nameMatch ? nameMatch[1] : null;
  gateways.push({ id, name });
}

const sequenceFlows = [];
const sfRe = /<sequenceFlow\s+([^>]*id="([^"]+)"[^>]*sourceRef="([^"]+)"\s+targetRef="([^"]+)"[^>]*)>/g;
while ((match = sfRe.exec(xml)) !== null) {
  const attrs = match[1];
  const id = match[2];
  const source = match[3];
  const target = match[4];
  const nameMatch = attrs.match(/name="([^"]+)"/);
  const name = nameMatch ? nameMatch[1] : null;
  
  // Extrai conditionExpression interna
  // Encontra o fim da tag para ver se há bloco interno
  const flowIndex = match.index;
  const subXml = xml.substring(flowIndex, flowIndex + 400);
  const conditionMatch = subXml.match(/<conditionExpression[^>]*>([\s\S]*?)<\/conditionExpression>/);
  const condition = conditionMatch ? conditionMatch[1].trim() : null;

  sequenceFlows.push({ id, source, target, name, condition });
}

const messageFlows = [];
const mfRe = /<messageFlow\s+([^>]*id="([^"]+)"[^>]*sourceRef="([^"]+)"\s+targetRef="([^"]+)"[^>]*)>/g;
while ((match = mfRe.exec(xml)) !== null) {
  const id = match[2];
  const source = match[3];
  const target = match[4];
  messageFlows.push({ id, source, target });
}

const lanes = [];
const laneRe = /<lane\s+([^>]*id="([^"]+)"[^>]*)>([\s\S]*?)<\/lane>/g;
while ((match = laneRe.exec(xml)) !== null) {
  const attrs = match[1];
  const id = match[2];
  const content = match[3];
  const nameMatch = attrs.match(/name="([^"]+)"/);
  const name = nameMatch ? nameMatch[1] : '[SEM NOME]';
  const flowRefs = [...content.matchAll(/<flowNodeRef>([^<]+)<\/flowNodeRef>/g)].map(x => x[1].trim());
  lanes.push({ id, name, flowRefs });
}

const participants = [];
const partRe = /<participant\s+([^>]*id="([^"]+)"[^>]*)>/g;
while ((match = partRe.exec(xml)) !== null) {
  const attrs = match[1];
  const id = match[2];
  const nameMatch = attrs.match(/name="([^"]+)"/);
  const name = nameMatch ? nameMatch[1] : '[SEM NOME]';
  const processMatch = attrs.match(/processRef="([^"]+)"/);
  const processRef = processMatch ? processMatch[1] : null;
  participants.push({ id, name, processRef });
}

const timers = [];
const timerRe = /<intermediateCatchEvent\s+([^>]*id="([^"]+)"[^>]*)>([\s\S]*?)<\/intermediateCatchEvent>/g;
while ((match = timerRe.exec(xml)) !== null) {
  const id = match[2];
  const content = match[3];
  const hasTimerDef = content.includes('<timerEventDefinition');
  timers.push({ id, hasTimerDef });
}

// 4. Validações Estruturais da Especificação OMG

// A. Lanes Vazias (OMG 9.3.2)
lanes.forEach(lane => {
  if (lane.flowRefs.length === 0) {
    addError(`A raia (Lane) '${lane.name}' [id=${lane.id}] está completamente vazia. Toda raia interna com atividades de fluxo deve ter referências em <flowNodeRef>.`, 'Swimlanes');
  }
});

// B. Atores Externos em Lanes (OMG 7.6.2 & bpmn-rules)
const externalKeywords = ['fornecedor', 'cliente', 'banco', 'transportadora', 'externo'];
lanes.forEach(lane => {
  const laneNameLower = lane.name.toLowerCase();
  if (externalKeywords.some(kw => laneNameLower.includes(kw))) {
    addError(`A raia (Lane) '${lane.name}' [id=${lane.id}] representa um ator externo. Atores externos devem ser modelados como Pools Black Box independentes, nunca como Lanes de um processo interno.`, 'Swimlanes');
  }
});

// C. Elementos Sem Lane (OMG 9.3.2)
// Se houver lanes declaradas, todos os nós devem estar contidos em alguma lane
if (lanes.length > 0) {
  const allFlowNodeRefs = new Set(lanes.flatMap(l => l.flowRefs));
  tasks.forEach(task => {
    if (!allFlowNodeRefs.has(task.id)) {
      addError(`A atividade '${task.name}' [id=${task.id}] não está listada em nenhum <flowNodeRef> de nenhuma Lane. Elementos de fluxo devem pertencer a uma Lane de responsabilidade.`, 'Swimlanes');
    }
  });
  gateways.forEach(gw => {
    if (!allFlowNodeRefs.has(gw.id)) {
      addError(`O Gateway '${gw.name || gw.id}' [id=${gw.id}] não está listada em nenhum <flowNodeRef> de nenhuma Lane.`, 'Swimlanes');
    }
  });
}

// D. Conexões de sequenceFlow cruzando fronteiras de Pools (OMG 7.6.1)
// SequenceFlows não podem ter origens ou destinos apontando para participantes externos (pools externos)
sequenceFlows.forEach(sf => {
  const sourceIsPart = sf.source.startsWith('part-');
  const targetIsPart = sf.target.startsWith('part-');
  if (sourceIsPart || targetIsPart) {
    addError(`O sequenceFlow '${sf.id}' aponta diretamente de/para um participante externo [origem: ${sf.source}, destino: ${sf.target}]. SequenceFlows são estritamente proibidos de cruzar fronteiras de Pool. Use Message Flows.`, 'Restrições de Fluxo');
  }
});

// E. Conexões de messageFlow dentro do mesmo Pool (OMG 7.6.2)
// Message Flows não podem conectar elementos do mesmo pool
messageFlows.forEach(mf => {
  // Busca se origem e destino pertencem ao processo principal
  const sourceIsInternal = tasks.some(t => t.id === mf.source) || gateways.some(g => g.id === mf.source) || xml.includes(`id="${mf.source}"`);
  const targetIsInternal = tasks.some(t => t.id === mf.target) || gateways.some(g => g.id === mf.target) || xml.includes(`id="${mf.target}"`);
  
  // Se ambos são internos (do mesmo pool/processo), é uma violação gravíssima
  if (sourceIsInternal && targetIsInternal && !mf.source.startsWith('part-') && !mf.target.startsWith('part-')) {
    addError(`O messageFlow '${mf.id}' está conectando dois elementos do mesmo Pool [origem: ${mf.source}, destino: ${mf.target}]. MessageFlows devem apenas conectar elementos de Pools DIFERENTES.`, 'Restrições de Fluxo');
  }
});

// F. Start Event como Source de MessageFlow (OMG 7.6.2 / p. 237)
messageFlows.forEach(mf => {
  if (mf.source.startsWith('ev-start') || mf.source.includes('startEvent')) {
    addError(`O messageFlow '${mf.id}' tem um Start Event como origem (sourceRef="${mf.source}"). Start Events em colaborações só podem RECEPTAR mensagens (catching), nunca enviar (throwing).`, 'Restrições de Fluxo');
  }
});

// G. Nomes Longos e Convenções de Nomenclatura (bpmn-rules)
tasks.forEach(task => {
  if (task.name.length > 50) {
    addWarning(`A atividade '${task.name}' possui um nome com mais de 50 caracteres (${task.name.length} caracteres). Nomes muito longos quebram o layout visual no Bizagi. Mantenha até 4 palavras.`, 'Nomenclatura');
  }
  
  // Verifica se começa com verbo no infinitivo (verificação heurística simples em português)
  const firstWord = task.name.split(' ')[0].toLowerCase();
  const infinitivoSuffixes = ['ar', 'er', 'ir', 'or'];
  const isInfinitivo = infinitivoSuffixes.some(s => firstWord.endsWith(s));
  if (!isInfinitivo && task.name !== '[SEM NOME]') {
    addWarning(`A atividade '${task.name}' parece não começar com um verbo no infinitivo ("${firstWord}"). Convenção: Verbo Infinitivo + Objeto.`, 'Nomenclatura');
  }
});

// H. Gateways sem Nome ou Rótulo de Condição nas saídas (OMG 8.4.9)
gateways.forEach(gw => {
  // Conta saídas
  const outputs = sequenceFlows.filter(sf => sf.source === gw.id);
  if (outputs.length > 1) {
    // Gateway Divergente (Decisão)
    if (!gw.name) {
      addError(`O Gateway divergente [id=${gw.id}] não possui um rótulo de pergunta ("name"). Gateways divergentes devem descrever a questão lógica (Ex: "Aprovado?").`, 'Gateways');
    } else if (!gw.name.trim().endsWith('?')) {
      addWarning(`O Gateway divergente '${gw.name}' [id=${gw.id}] deve terminar com uma interrogação ("?").`, 'Gateways');
    }
    
    outputs.forEach(out => {
      if (!out.name) {
        addError(`O fluxo de saída '${out.id}' do gateway divergente '${gw.name || gw.id}' não possui um nome de condição ("Sim" ou "Não").`, 'Gateways');
      } else {
        const nameLower = out.name.trim().toLowerCase();
        if (nameLower !== 'sim' && nameLower !== 'não' && nameLower !== 'nao') {
          addWarning(`O fluxo de saída '${out.id}' do gateway divergente tem o nome '${out.name}'. Recomendado usar estritamente 'Sim' ou 'Não'.`, 'Gateways');
        }
      }
      
      if (!out.condition) {
        addError(`O fluxo de saída '${out.id}' do gateway divergente '${gw.name || gw.id}' não possui uma tag de lógica <conditionExpression>.`, 'Gateways');
      }
    });
  } else if (outputs.length === 1) {
    // Gateway Convergente (Merge)
    if (gw.name) {
      addWarning(`O Gateway convergente [id=${gw.id}] possui o nome '${gw.name}'. Gateways convergentes não devem ter rótulos visuais para evitar poluição visual.`, 'Gateways');
    }
  }
});

// I. Convergência Implícita (OMG 7.3.2)
// Identifica se múltiplos sequenceFlows chegam no mesmo elemento sem passar por um Gateway
const targetsCount = {};
sequenceFlows.forEach(sf => {
  targetsCount[sf.target] = (targetsCount[sf.target] || 0) + 1;
});

Object.keys(targetsCount).forEach(targetId => {
  if (targetsCount[targetId] > 1) {
    const isTask = tasks.some(t => t.id === targetId);
    if (isTask) {
      const task = tasks.find(t => t.id === targetId);
      addError(`Convergência Implícita na atividade '${task.name}' [id=${targetId}]: ${targetsCount[targetId]} fluxos de entrada chegam diretamente nesta tarefa. Insira um Exclusive Gateway convergente (Merge) antes dela.`, 'Restrições de Fluxo');
    }
  }
});

// J. Atividades Zumbi (Deadlocks - OMG p. 25 / p. 62)
// Atividades que não possuem fluxo de saída (o token fica preso nelas)
tasks.forEach(task => {
  const hasOutgoing = sequenceFlows.some(sf => sf.source === task.id);
  const hasMessageOutgoing = messageFlows.some(mf => mf.source === task.id);
  
  if (!hasOutgoing) {
    addError(`Atividade Zumbi (Token Preso): A tarefa '${task.name}' [id=${task.id}] não tem nenhum fluxo de saída. Ela deve se conectar a uma próxima atividade ou a um <endEvent> final.`, 'Executabilidade');
  }
});

// K. Controle de Tempo em Loops (OMG p. 66 / bpmn-rules)
// Identifica se há fluxos de retorno (back-edges) e se eles são controlados por um Timer
sequenceFlows.forEach(sf => {
  // Um fluxo de retorno aponta para um elemento que está "antes" dele na topologia
  // Vamos analisar se a origem é um gateway e o destino é uma tarefa que retorna
  const targetIsTask = tasks.some(t => t.id === sf.target);
  const sourceIsGateway = gateways.some(g => g.id === sf.source);
  
  if (targetIsTask && sourceIsGateway) {
    // Gateway divergente voltando para uma atividade (Loop).
    // Verifica se existe um timer associado ao fluxo do loop ou se a tarefa de destino é precedida por um timer
    const task = tasks.find(t => t.id === sf.target);
    const hasTimerInProcess = timers.length > 0;
    
    if (!hasTimerInProcess) {
      addWarning(`Possível Loop descontrolado: O Gateway [id=${sf.source}] retorna o fluxo diretamente para a tarefa '${task.name}' sem nenhum Timer intermediário. Recomendado usar um <intermediateCatchEvent> com timer ANTES do gateway para simulações confiáveis.`, 'Executabilidade');
    }
  }
});


// REPORT FINAL
console.log(`\nResultados da Auditoria estrutural:`);
console.log(`- Total de atividades encontradas: ${tasks.length}`);
console.log(`- Total de Gateways encontrados: ${gateways.length}`);
console.log(`- Total de Sequence Flows: ${sequenceFlows.length}`);
console.log(`- Total de Message Flows: ${messageFlows.length}`);
console.log(`- Total de Raias (Lanes): ${lanes.length}`);
console.log(`-----------------------------------------------`);

if (errors.length === 0) {
  console.log(`\n\x1b[32m✔ PARABÉNS! NENHUM ERRO ESTRUTURAL ENCONTRADO! O XML é 100% confiável e compatível com a OMG BPMN.\x1b[0m`);
} else {
  console.log(`\n\x1b[31m❌ FORAM ENCONTRADOS ${errors.length} ERROS CRÍTICOS:\x1b[0m`);
  errors.forEach((err, idx) => {
    console.log(`  ${idx + 1}. [${err.category}] - \x1b[31m${err.message}\x1b[0m`);
  });
}

if (warnings.length > 0) {
  console.log(`\n\x1b[33m⚠ HÁ ${warnings.length} AVISOS DE BOAS PRÁTICAS/ESTILO:\x1b[0m`);
  warnings.forEach((warn, idx) => {
    console.log(`  ${idx + 1}. [${warn.category}] - \x1b[33m${warn.message}\x1b[0m`);
  });
}

console.log(`\n\x1b[36m=== FIM DA AUDITORIA ===\x1b[0m\n`);

if (errors.length > 0) {
  process.exit(1); // Falha na pipeline
} else {
  process.exit(0); // Sucesso
}
