#!/usr/bin/env bash
set -e

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
INPUT_FILE="$PROJECT_ROOT/squads/escritorio-bpm-as-is/input/transcricao-final.txt"

echo "=========================================================="
echo "   Escritório de BPM — AS-IS Pipeline (Local Ollama)"
echo "=========================================================="
echo "Cole a descrição/transcrição da reunião abaixo."
echo "Depois de colar, pressione [ENTER] e depois [CTRL+D] para iniciar:"
echo "----------------------------------------------------------"

# Lê de stdin e grava no arquivo de entrada
cat > "$INPUT_FILE"

echo "----------------------------------------------------------"
echo "Transcrição salva com sucesso em:"
echo "  squads/escritorio-bpm-as-is/input/transcricao-final.txt"
echo ""
echo "Disparando o pipeline agêntico local..."
echo "=========================================================="
echo ""

# Roda o pipeline
bash "$PROJECT_ROOT/squads/escritorio-bpm-as-is/scripts/run-pipeline.sh"
