import { ErrorAnalysisResponse, ErrorDetectionInput } from '@/domain/valueObjects/schemas';
import { BuildError, ErrorType, ErrorSeverity } from '@/domain/entities/BuildError';

export interface MCPServicePort {
  analyzeErrors(input: ErrorDetectionInput): Promise<ErrorAnalysisResponse>;
}

export class MCPService implements MCPServicePort {
  private apiKey: string;
  private endpoint: string;
  
  constructor(apiKey: string, endpoint: string = 'https://openrouter.ai/api/v1/chat/completions') {
    this.apiKey = apiKey;
    this.endpoint = endpoint;
  }
  
  async analyzeErrors(input: ErrorDetectionInput): Promise<ErrorAnalysisResponse> {
    try {
      // Construir prompt específico com base no source
      const prompt = this.buildPromptForErrorSource(input.source, input.buildOutput);
      
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://dailycopilot.app',
          'X-Title': 'DailyCopilot'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-maverick',
          messages: [
            { 
              role: 'system', 
              content: `Você é um expert em análise de erros de desenvolvimento, especializado em identificar problemas em código. Ao analisar a saída de um comando, identifique erros, classifique por severidade e proponha soluções. Sua resposta deve seguir estritamente o formato JSON solicitado.`
            },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' }
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error from OpenRouter: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      
      // Validar e estruturar a resposta
      return {
        errors: result.errors || [],
        suggestions: result.suggestions || [],
        summary: result.summary || 'Análise realizada, porém sem conclusões claras.'
      };
    } catch (error) {
      console.error('Error analyzing errors with OpenRouter:', error);
      // Fallback para análise simplificada
      return this.fallbackErrorAnalysis(input.buildOutput, input.source);
    }
  }
  
  private buildPromptForErrorSource(source: string, buildOutput: string): string {
    const promptBase = `
    Analise a seguinte saída de ${source} e identifique todos os erros presentes.
    
    Para cada erro encontrado, determine:
    1. A mensagem de erro
    2. O tipo de erro (build, test, lint, typecheck ou runtime)
    3. A severidade (critical, high, medium, low)
    4. O arquivo relacionado (se disponível)
    5. A linha e coluna (se disponível)
    
    Para cada erro, proponha uma solução específica que resolveria o problema.
    
    Responda APENAS em formato JSON seguindo este modelo:
    {
      "errors": [
        {
          "message": "string",
          "type": "build|test|lint|typecheck|runtime",
          "severity": "critical|high|medium|low",
          "file": "string (opcional)",
          "line": number (opcional),
          "column": number (opcional)
        }
      ],
      "suggestions": [
        {
          "errorIndex": number (índice correspondente ao erro),
          "solution": "string",
          "codeSnippet": "string (opcional)"
        }
      ],
      "summary": "string"
    }
    
    Saída a analisar:
    \`\`\`
    ${buildOutput}
    \`\`\`
    `;
    
    return promptBase;
  }
  
  private fallbackErrorAnalysis(buildOutput: string, source: string): ErrorAnalysisResponse {
    // Implementação simplificada para casos em que a API falha
    const errors = [];
    const suggestions = [];
    let summary = 'Análise realizada sem API externa.';
    
    // Padrões comuns de erros por tipo de ferramenta
    const errorPatterns = {
      npm: [
        { regex: /npm ERR! code (.+)/i, type: 'build', severity: 'high' },
        { regex: /404 Not Found/i, type: 'build', severity: 'high' }
      ],
      jest: [
        { regex: /FAIL (.+)/i, type: 'test', severity: 'medium' },
        { regex: /Expected (.+) but received (.+)/i, type: 'test', severity: 'medium' }
      ],
      eslint: [
        { regex: /error\s+(.+)\s+/i, type: 'lint', severity: 'medium' },
        { regex: /warning\s+(.+)\s+/i, type: 'lint', severity: 'low' }
      ],
      tsc: [
        { regex: /TS\d+:/, type: 'typecheck', severity: 'high' },
        { regex: /Property '(.+)' does not exist on type/i, type: 'typecheck', severity: 'high' }
      ],
      webpack: [
        { regex: /Module not found/i, type: 'build', severity: 'high' },
        { regex: /ERROR in (.+)/i, type: 'build', severity: 'high' }
      ],
      next: [
        { regex: /Build error occurred/i, type: 'build', severity: 'high' },
        { regex: /Failed to compile/i, type: 'build', severity: 'high' }
      ]
    };
    
    // Extrair erros baseado em padrões
    const patterns = errorPatterns[source as keyof typeof errorPatterns] || errorPatterns.npm;
    
    // Extrair linhas da saída
    const lines = buildOutput.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      for (const pattern of patterns) {
        const match = line.match(pattern.regex);
        if (match) {
          // Tentar extrair arquivo e linha
          const fileMatch = line.match(/([a-zA-Z0-9_\-/.]+\.[a-zA-Z0-9]+):(\d+)(?::(\d+))?/);
          
          const error = {
            message: match[1] || match[0],
            type: pattern.type as ErrorType,
            severity: pattern.severity as ErrorSeverity,
            file: fileMatch ? fileMatch[1] : undefined,
            line: fileMatch && fileMatch[2] ? parseInt(fileMatch[2], 10) : undefined,
            column: fileMatch && fileMatch[3] ? parseInt(fileMatch[3], 10) : undefined
          };
          
          errors.push(error);
          
          // Adicionar sugestão genérica
          suggestions.push({
            errorIndex: errors.length - 1,
            solution: this.generateGenericSolution(error.type, error.message)
          });
        }
      }
    }
    
    if (errors.length === 0) {
      summary = 'Não foram detectados erros claros na saída fornecida.';
    } else {
      summary = `Foram detectados ${errors.length} possíveis erros. Verificação manual é recomendada.`;
    }
    
    return { errors, suggestions, summary };
  }
  
  private generateGenericSolution(type: string, message: string): string {
    // Soluções genéricas baseadas no tipo de erro
    const solutions = {
      build: 'Verifique as dependências do projeto e garanta que todas estão instaladas corretamente.',
      test: 'Revise a lógica no teste e confirme que os resultados esperados correspondem ao comportamento real.',
      lint: 'Atualize o código para atender aos padrões definidos nas regras de linting.',
      typecheck: 'Corrija as tipagens para garantir compatibilidade com a interface esperada.',
      runtime: 'Verifique o fluxo de execução e os valores sendo processados durante o runtime.'
    };
    
    return solutions[type as keyof typeof solutions] || 'Analise o contexto do erro para identificar a melhor solução.';
  }
} 