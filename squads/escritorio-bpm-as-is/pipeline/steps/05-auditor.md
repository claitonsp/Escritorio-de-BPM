---
agent: auditor
outputFile: diagnostico-as-is.json
execution: inline
---

Você receberá o JSON de elicitação de um processo AS-IS. Analise-o sob três frameworks e retorne um JSON estruturado de diagnóstico.

## Input

{{input}}

## Frameworks de análise

### 1. ABPMP BPM CBOK v4.0
Consulte sua skill `bpm-auditoria` para fundamentar os achados com base nas melhores práticas documentadas no CBOK.
Avalie: qualidade dos pontos de handoff, completude dos controles em gateways, presença de pontos de medição, tratamento de exceções, rastreabilidade de documentos, e lacunas de especificação (fluxos indefinidos).

### 2. Lean Six Sigma — Desperdícios TIMWOOD
Avalie os oito desperdícios no contexto do processo:
- **Transporte**: handoffs desnecessários entre atores
- **Inventário**: filas de espera implícitas (atividades de confirmação passiva)
- **Movimento**: retrabalho manual que poderia ser automatizado
- **Espera**: atividades bloqueadas aguardando resposta externa
- **Superprodução**: atividades executadas além do necessário para o próximo passo
- **Superprocessamento**: etapas que geram mais trabalho do que valor
- **Defeitos**: caminhos de não-conformidade sem tratamento definido
- **Subutilização de talento**: tarefas manuais repetitivas executadas por atores com capacidade técnica superior

### 3. ISO 9001:2015
Avalie: rastreabilidade de registros, tratamento de não-conformidades (especialmente caminhos de exceção no processo), evidências de competência dos atores, controle de documentos e dados externos (fornecedores), e critérios de aceitação explícitos.

## Regras de análise

1. Cada achado deve citar pelo menos um elemento do JSON (ativ-XX, gw-XX, ev-XX, rn-XX, sis-XX)
2. Confiabilidade alta = evidência direta na transcrição. Confiabilidade média = inferência estrutural razoável. Confiabilidade baixa = requer coleta de dados adicionais
3. Prioridade alta = impacto direto em risco operacional ou conformidade. Média = impacto em eficiência. Baixa = oportunidade de melhoria incremental
4. Não invente dados quantitativos ausentes. Se o achado depende de tempo, custo ou volume, registre como hipótese com confiabilidade baixa
5. Identifique métricas do processo deriváveis do JSON: número de handoffs (mudanças de ator entre atividades consecutivas), atividades manuais (userTask), atividades automáticas (serviceTask), gateways, caminhos sem endEvent definido

## Schema de saída obrigatório

```json
{
  "processo": "nome do processo",
  "resumo_executivo": "parágrafo de 3 a 5 frases sintetizando os achados mais críticos",
  "metricas_estruturais": {
    "total_atividades": 0,
    "atividades_manuais": 0,
    "atividades_automaticas": 0,
    "total_handoffs": 0,
    "total_gateways": 0,
    "caminhos_indefinidos": 0,
    "atores_internos": 0,
    "atores_externos": 0
  },
  "achados": [
    {
      "id": "ach-01",
      "framework": "CBOK | Lean | ISO9001",
      "categoria": "handoff | controle | rastreabilidade | desperdicio_espera | desperdicio_defeito | desperdicio_superprocessamento | desperdicio_movimento | nao_conformidade | lacuna_especificacao | automacao_potencial",
      "descricao": "descrição clara do problema ou risco identificado",
      "elementos_relacionados": ["ativ-XX"],
      "impacto_potencial": "descrição do impacto se não tratado",
      "prioridade": "alta | media | baixa",
      "confiabilidade": "alta | media | baixa",
      "justificativa_confiabilidade": "por que esta confiabilidade foi atribuída",
      "recomendacao": "ação concreta recomendada para o TO-BE"
    }
  ],
  "observacoes_metodologicas": [
    "limitações da análise dado que os dados vêm de uma única entrevista",
    "dados recomendados para coleta em aprofundamento"
  ]
}
```

Retorne APENAS o JSON. Comece com { e termine com }.
