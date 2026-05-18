---
agent: auditor
outputFile: diagnostico-as-is.json
execution: inline
---

Analise o JSON de elicitação usando exclusivamente as regras de auditoria baseadas no CBOK v4.0 contidas no arquivo `squads/escritorio-bpm-as-is/references/cbok-audit-rules.md` e retorne um JSON de diagnóstico. Retorne APENAS o JSON de diagnóstico, sem explicações antes ou depois. Comece com { e termine com }.

## Input

{{input}}

## Regras de Auditoria CBOK v4.0

Você deve avaliar o processo elicitado sob a ótica exclusiva do **ABPMP BPM CBOK v4.0 (Capítulo 4)**, estruturado de acordo com as seguintes dimensões e validações detalhadas no arquivo de referência `cbok-audit-rules.md`:

1. **Qualificação como Modelo Formal (Seção 4.1.3):**
   - Validar se o AS-IS elicitado utiliza notação padronizada, ícones bem definidos e de forma precisa, sem ambiguidades.
   - Caso falhe nestes critérios, classifique como `Notacao_Ambigua`.

2. **Completude das 5 Dimensões ARIS (Seção 4.2.5):**
   - Verificar a presença e integridade de:
     - *Organização:* Atores, papéis e lanes associados às atividades.
     - *Funções:* Atividades operacionais sequenciadas.
     - *Dados:* Entradas e saídas de dados/documentos para cada atividade.
     - *Entregáveis:* Produtos, serviços ou valor gerado ao final de cada fluxo.
     - *Controle:* Gateways, eventos e sequenciamento lógico.
   - Qualquer omissão de dimensões deve gerar um achado da categoria `Incompletude_ARIS`.

3. **Ontologia e Consistência Hierárquica (Seção 4.6):**
   - *Ontologia (Seção 4.6.1):* Impedir conflitos de nomes. Não ter dois nomes para o mesmo item (sinônimos não mapeados), nem o mesmo nome para itens diferentes (homônimos). Categoria: `Conflito_Ontologico`.
   - *Níveis de Abstração (Seção 4.6.4):* O modelo deve respeitar o alinhamento de níveis (Corporativo, Negócio, Workflow, Passos). É proibido misturar passos microscópicos de sistemas em fluxos de negócios macro. Categoria: `Desalinhamento_Hierarquico`.

4. **Alinhamento da Arquitetura de Negócio (Seção 4.7):**
   - Garantir a rastreabilidade das atividades até o nível das responsabilidades operacionais (lanes de atores internos). Se houver atividades órfãs ou desalinhamento com o papel do executor, sinalize na categoria `Desalinhamento_Hierarquico`.

5. **Executabilidade e Lógica de Fluxo (Seção 4.11):**
   - *Validação Lógica:* Garantir fluxo livre de tokens. Sem deadlocks, sem caminhos órfãos sem saída, e sem loops descontrolados/infinitos. Loops devem ter condições de retorno controladas por gateways de decisão explícitos. Categoria: `Falha_Executabilidade`.

6. **Governação e Convenções do Repositório (Seção 4.2.8):**
   - Validar se a estrutura segue as convenções semânticas e o ciclo de vida adequado do modelo. Categoria: `Desvio_Governanca`.

## Proibições Absolutas

Em conformidade rigorosa com o arquivo de regras:
1. **NUNCA invente dados quantitativos ou qualitativos** que não estejam expressos no JSON de entrada. Se métricas de tempo, custo ou volumes de processo estiverem ausentes, classifique como `Incompletude_ARIS` e configure a confiabilidade como `baixa`.
2. **NUNCA misture AS-IS com TO-BE**. Concentre-se exclusivamente em diagnosticar e auditar o fluxo atual como ele se encontra.
3. **NUNCA utilize outros frameworks** ou abordagens além do CBOK v4.0. Lean Six Sigma e ISO 9001 estão estritamente banidos.

## Classificação de Atributos dos Achados

- **Confiabilidade:**
  - `alta`: Baseada em evidência direta e explícita fornecida pelo JSON de entrada.
  - `media`: Baseada em inferência lógica forte e coerente.
  - `baixa`: Baseada em lacunas de dados ou informações que exigem coleta adicional.
- **Prioridade:**
  - `alta`: Riscos operacionais severos, falhas de conformidade crítica ou interrupção do fluxo de trabalho.
  - `media`: Problemas de alinhamento hierárquico, conflitos de ontologia e handoffs ineficientes.
  - `baixa`: Pequenos desvios de governança de nomenclatura ou melhorias incrementais.

## Schema de Saída (JSON)

Você deve retornar estritamente o JSON seguindo o schema abaixo:

```json
{
  "processo": "nome do processo",
  "resumo_executivo": "3 a 5 frases sobre os achados críticos sob a ótica do CBOK v4.0",
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
      "secao_cbok": "ex: 4.2.5 — Dimensão Dados",
      "categoria": "Notacao_Ambigua | Incompletude_ARIS | Conflito_Ontologico | Desalinhamento_Hierarquico | Falha_Executabilidade | Desvio_Governanca",
      "descricao": "problema ou risco identificado sob a ótica da seção correspondente do CBOK",
      "elementos_relacionados": ["ativ-XX", "gw-XX"],
      "impacto_potencial": "impacto se não tratado no repositório de processos",
      "prioridade": "alta | media | baixa",
      "confiabilidade": "alta | media | baixa",
      "justificativa_confiabilidade": "justificativa detalhada com base na presença/ausência de dados no input",
      "recomendacao": "ação concreta de melhoria ou correção focada no redesenho TO-BE"
    }
  ],
  "observacoes_metodologicas": [
    "limitações da análise",
    "dados adicionais recomendados para coleta e validação"
  ]
}
```
