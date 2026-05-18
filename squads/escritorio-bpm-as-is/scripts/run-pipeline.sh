#!/usr/bin/env bash
set -e

# ================================================================
# run-pipeline.sh — Pipeline AS-IS Escritório de BPM
# Uso: bash squads/escritorio-bpm-as-is/scripts/run-pipeline.sh [caminho/transcricao.txt]
# Padrão: squads/escritorio-bpm-as-is/input/transcricao-final.txt
# ================================================================

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SQUAD_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_ROOT="$(cd "$SQUAD_DIR/../.." && pwd)"
PIPELINE_DIR="$SQUAD_DIR/pipeline/steps"
INPUT_DIR="$SQUAD_DIR/input"
TRANSCRICAO="${1:-$INPUT_DIR/transcricao-final.txt}"

# ── Carregar QWEN_API_KEY ──────────────────────────────────────
export QWEN_API_KEY="sk-849de526b004446a890a2ca7a40e2a5a"
export QWEN_BASE_URL="https://ws-alz5lprkmvl6p01o.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1"
export QWEN_MODEL="${QWEN_MODEL:-qwen-plus}"

# ── Pré-condição ──────────────────────────────────────────────
if [ ! -f "$TRANSCRICAO" ]; then
  echo "ERRO: transcrição não encontrada: $TRANSCRICAO" >&2
  exit 1
fi

# ── Criar diretório de output ─────────────────────────────────
TIMESTAMP=$(date +%Y-%m-%d-%H%M%S)
RUN_ID="$TIMESTAMP"
OUTPUT_DIR="$SQUAD_DIR/output/$RUN_ID/v1"
mkdir -p "$OUTPUT_DIR"

echo "RUN_ID=$RUN_ID"
echo "OUTPUT=$OUTPUT_DIR"
echo ""

# ── Helpers ───────────────────────────────────────────────────
extract_json() {
  # Remove fences ```json ... ``` se presentes
  sed '/^```/d'
}

extract_xml() {
  # Isola o bloco BPMN válido: do primeiro <?xml OU primeiro <...definitions>
  # até o último </...definitions>. Descarta prosa antes/depois do XML
  # (o agente às vezes "explica" o que fez em markdown).
  awk '
    BEGIN { keep = 0 }
    # Início: linha que contém <?xml ou abre <...definitions
    !keep && /<\?xml|<[a-zA-Z0-9:]*definitions[ >]/ { keep = 1 }
    keep { print }
    # Fim: fecha </...definitions> — para de imprimir depois desta linha
    keep && /<\/[a-zA-Z0-9:]*definitions>/ { exit }
  ' | sed '/^```/d'
}

run_claude() {
  local TMP
  TMP=$(mktemp /tmp/bpm-pipeline-XXXXXX.txt)
  cat > "$TMP"
  node "$SCRIPT_DIR/anthropic-call.js" "$TMP"
  local EXIT=$?
  rm -f "$TMP"
  return $EXIT
}

validate_json() {
  node -e "
    process.stdin.resume();
    let d='';
    process.stdin.on('data', c => d += c);
    process.stdin.on('end', () => {
      try { JSON.parse(d); process.exit(0); }
      catch(e) { process.exit(1); }
    });
  "
}

# ── Step 01 — Elicitador ──────────────────────────────────────
echo "[01/06] Elicitador..."
ELICITACAO=$(printf '%s\n\n---\nTranscrição da reunião:\n%s' \
  "$(cat "$PIPELINE_DIR/01-elicitador.md")" \
  "$(cat "$TRANSCRICAO")" \
  | run_claude | extract_json)

echo "$ELICITACAO" > "$OUTPUT_DIR/elicitacao.json"

if ! echo "$ELICITACAO" | validate_json; then
  echo "[01] ERRO: elicitacao.json inválido" >&2
  exit 11
fi
echo "[01] Concluído → elicitacao.json"

# ── Step 02 — Checkpoint Elicitação ──────────────────────────
echo "[02/06] Checkpoint elicitação..."
RESULT_02=$(printf '%s\n\n---\nelicitacao.json:\n%s' \
  "$(cat "$PIPELINE_DIR/02-checkpoint-elicitacao.md")" \
  "$ELICITACAO" \
  | run_claude)

if echo "$RESULT_02" | grep -qiE "reprovado|bloqueado|inválido|FAIL"; then
  echo "[02] REPROVADO" >&2
  echo "$RESULT_02" >&2
  exit 12
fi
echo "[02] Aprovado"

# ── Step 03 — Modelador ───────────────────────────────────────
echo "[03/06] Modelador..."
BPMN=$(printf '%s\n\n---\nelicitacao.json:\n%s' \
  "$(cat "$PIPELINE_DIR/03-modelador.md")" \
  "$ELICITACAO" \
  | run_claude | extract_xml)

echo "$BPMN" > "$OUTPUT_DIR/processo-as-is.bpmn"

if ! grep -qi 'definitions' "$OUTPUT_DIR/processo-as-is.bpmn"; then
  echo "[03] ERRO: BPMN inválido (sem definitions)" >&2
  cat "$OUTPUT_DIR/processo-as-is.bpmn" | head -5 >&2
  exit 13
fi
echo "[03] Concluído → processo-as-is.bpmn"

# ── bpmn-layout.js ────────────────────────────────────────────
echo "[03b] Layout..."
node "$SCRIPT_DIR/bpmn-layout.js" \
  "$OUTPUT_DIR/processo-as-is.bpmn" \
  "$OUTPUT_DIR/processo-as-is-layout.bpmn"
echo "[03b] Concluído → processo-as-is-layout.bpmn"

# ── Step 04 — Checkpoint BPMN (determinístico) ────────────────
echo "[04/06] Checkpoint BPMN..."
BPMN_FILE="$OUTPUT_DIR/processo-as-is.bpmn"
ERROS_04=0

# 1b — nomes longos (>60 chars — gateways podem ter até 6 palavras em PT)
if grep -qP 'name="[^"]{61,}"' "$BPMN_FILE" 2>/dev/null; then
  echo "  [1b] FAIL: name= com mais de 60 caracteres:"
  grep -oP 'name="[^"]{61,}"' "$BPMN_FILE"
  ERROS_04=$((ERROS_04+1))
fi

# 1d — gateway DIVERGENTE (>1 saída) com saída sem name=
# Gateways de convergência (1 saída) não precisam de name= nas setas de saída
FAIL_1D=$(node -e "
const fs = require('fs');
const xml = fs.readFileSync(process.argv[1], 'utf8');
const allFlows = [...xml.matchAll(/<sequenceFlow\s[^>]*\/?>/g)].map(m => m[0]);
const outCount = {};
for (const f of allFlows) {
  const src = (f.match(/sourceRef=\"([^\"]+)\"/) || [])[1];
  if (src && /^gw-/.test(src)) outCount[src] = (outCount[src] || 0) + 1;
}
const diverging = new Set(Object.keys(outCount).filter(id => outCount[id] > 1));
const bad = allFlows.filter(f => {
  const src = (f.match(/sourceRef=\"([^\"]+)\"/) || [])[1];
  return src && diverging.has(src) && !f.includes('name=');
});
if (bad.length) console.log(bad.length);
" "$BPMN_WIN" 2>/dev/null || true)
if [ -n "$FAIL_1D" ]; then
  echo "  [1d] FAIL: sequenceFlow saindo de gateway divergente sem name= ($FAIL_1D ocorrência(s))"
  ERROS_04=$((ERROS_04+1))
fi

# 1e — ator externo como Lane
if grep -iE 'lane.*(fornecedor|cliente|transportadora)' "$BPMN_FILE" 2>/dev/null; then
  echo "  [1e] FAIL: ator externo modelado como Lane"
  ERROS_04=$((ERROS_04+1))
fi

# 1f — sequenceFlow cruzando Pool
if grep -qP 'sequenceFlow[^>]*(sourceRef|targetRef)="part-[^"]*"' "$BPMN_FILE" 2>/dev/null; then
  echo "  [1f] FAIL: sequenceFlow cruzando fronteira de Pool"
  ERROS_04=$((ERROS_04+1))
fi

# 1g — convergência implícita (aviso, não bloqueia)
DUPLICADOS=$(grep -oP 'targetRef="\K[^"]+' "$BPMN_FILE" 2>/dev/null | sort | uniq -d || true)
if [ -n "$DUPLICADOS" ]; then
  echo "  [1g] AVISO: targetRef duplicados (verificar convergência implícita): $DUPLICADOS"
fi

# 1h — loop sem timer
HAS_BACK=$(grep -cP 'sequenceFlow[^>]*targetRef="ativ-[^"]*"[^>]*conditionExpression' "$BPMN_FILE" 2>/dev/null | tr -d '[:space:]' || echo "0")
HAS_TIMER=$(grep -c 'intermediateCatchEvent' "$BPMN_FILE" 2>/dev/null | tr -d '[:space:]' || echo "0")
if [ "${HAS_BACK:-0}" -gt 0 ] && [ "${HAS_TIMER:-0}" = "0" ]; then
  echo "  [1h] FAIL: loop detectado sem timer intermediário"
  ERROS_04=$((ERROS_04+1))
fi

# 1i — tasks zumbi
BPMN_WIN=$(echo "$BPMN_FILE" | sed 's|^/\([a-zA-Z]\)/|\1:/|')
ZOMBIES=$(node -e "
const fs = require('fs');
const xml = fs.readFileSync(process.argv[1], 'utf8');
const ids = [...xml.matchAll(/<(?:userTask|serviceTask|scriptTask)\s[^>]*id=\"([^\"]+)\"/g)].map(m => m[1]);
const srcs = new Set([...xml.matchAll(/sourceRef=\"([^\"]+)\"/g)].map(m => m[1]));
const zombies = ids.filter(id => !srcs.has(id));
if (zombies.length) console.log(zombies.join(','));
" "$BPMN_WIN" 2>/dev/null || true)
if [ -n "$ZOMBIES" ]; then
  echo "  [1i] FAIL: tasks zumbi sem sequenceFlow de saída: $ZOMBIES"
  ERROS_04=$((ERROS_04+1))
fi

# 1j — elementos sem flowNodeRef em nenhuma lane
NO_LANE=$(node -e "
const fs = require('fs');
const xml = fs.readFileSync(process.argv[1], 'utf8');
const refs = new Set([...xml.matchAll(/<flowNodeRef>([^<]+)<\/flowNodeRef>/g)].map(m => m[1].trim()));
const nodes = [...xml.matchAll(/<(?:userTask|serviceTask|scriptTask|exclusiveGateway|startEvent|endEvent|intermediateCatchEvent)\s[^>]*id=\"([^\"]+)\"/g)].map(m => m[1]);
const orphans = nodes.filter(id => !refs.has(id));
if (orphans.length) console.log(orphans.join(','));
" "$BPMN_WIN" 2>/dev/null || true)
if [ -n "$NO_LANE" ]; then
  echo "  [1j] FAIL: elementos sem flowNodeRef em nenhuma lane: $NO_LANE"
  ERROS_04=$((ERROS_04+1))
fi

if [ "$ERROS_04" -gt 0 ]; then
  echo "[04] REPROVADO — $ERROS_04 erro(s) no BPMN" >&2
  exit 14
fi
echo "[04] Aprovado (10/10)"

# ── Step 05 — Auditor ─────────────────────────────────────────
echo "[05/06] Auditor..."
DIAGNOSTICO=$(printf '%s\n\n---\nelicitacao.json:\n%s\n\nprocesso-as-is.bpmn:\n%s' \
  "$(cat "$PIPELINE_DIR/05-auditor.md")" \
  "$ELICITACAO" \
  "$BPMN" \
  | run_claude | extract_json)

echo "$DIAGNOSTICO" > "$OUTPUT_DIR/diagnostico-as-is.json"

if ! echo "$DIAGNOSTICO" | validate_json; then
  echo "[05] ERRO: diagnostico-as-is.json inválido" >&2
  exit 15
fi
echo "[05] Concluído → diagnostico-as-is.json"

# ── Step 06 — Checkpoint Auditoria ───────────────────────────
echo "[06/06] Checkpoint auditoria..."
RESULT_06=$(printf '%s\n\n---\ndiagnostico-as-is.json:\n%s' \
  "$(cat "$PIPELINE_DIR/06-checkpoint-auditoria.md")" \
  "$DIAGNOSTICO" \
  | run_claude)

if echo "$RESULT_06" | grep -qiE "reprovado|bloqueado|FAIL"; then
  echo "[06] REPROVADO" >&2
  echo "$RESULT_06" >&2
  exit 16
fi
echo "[06] Aprovado"

# ── Sumário final ─────────────────────────────────────────────
echo ""
echo "=== PIPELINE CONCLUÍDO ==="
echo "RUN_ID=$RUN_ID"
echo "BPMN=$OUTPUT_DIR/processo-as-is-layout.bpmn"
echo "AUDITORIA=$OUTPUT_DIR/diagnostico-as-is.json"
echo ""
echo "Achados:"
# Converte path bash (/c/Users/...) para path Windows (C:/Users/...) para o node
DIAG_WIN=$(echo "$OUTPUT_DIR/diagnostico-as-is.json" | sed 's|^/\([a-zA-Z]\)/|\1:/|')
node -e "
try {
  const d = JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'));
  (d.achados||[]).forEach(a =>
    console.log('• [' + a.prioridade.toUpperCase() + '] [' + a.secao_cbok + '] ' + a.descricao)
  );
} catch(e) { console.error(e.message); }
" "$DIAG_WIN" 2>/dev/null
