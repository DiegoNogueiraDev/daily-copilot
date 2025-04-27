import { BuildErrorRepository } from '@/domain/repositories/BuildErrorRepository';
import { ErrorMetricsInput, ErrorMetricsResponse } from '@/domain/valueObjects/schemas';

export class GetErrorMetricsUseCase {
  constructor(
    private buildErrorRepository: BuildErrorRepository
  ) {}

  async execute(input: ErrorMetricsInput): Promise<ErrorMetricsResponse> {
    // Obter contagem de erros por tipo
    const errorCountByType = await this.buildErrorRepository.getErrorCountByType(input.projectId);
    
    // Calcula data de início com base no período
    const startDate = this.getStartDateFromPeriod(input.period);
    
    // Obter erros não resolvidos para o projeto (ou todos os projetos se projectId não for especificado)
    const unsolvedErrors = input.projectId 
      ? await this.buildErrorRepository.findUnsolvedByProjectId(input.projectId)
      : [];
      
    // Obter contagem por usuário (mock - seria implementado no repositório real)
    const errorCountByUser: Record<string, number> = {};
    
    // Calcular tempo médio de resolução (mock - seria implementado no repositório real)
    const averageTimeToFix = 2.5; // Em horas
    
    // Erros mais comuns (mock - seria implementado no repositório real)
    const mostCommonErrors = [
      {
        type: 'typecheck',
        count: 12,
        examples: [
          "Property 'x' does not exist on type 'Y'",
          "Type 'string' is not assignable to type 'number'"
        ]
      },
      {
        type: 'build',
        count: 8,
        examples: [
          "Module not found: Error: Can't resolve 'package'",
          "SyntaxError: Unexpected token"
        ]
      }
    ];
    
    // Soluções recentes (mock - seria implementado no repositório real)
    const recentSolutions = [
      {
        error: "Property 'value' does not exist on type 'Event'",
        solution: "Use (e.target as HTMLInputElement).value em vez de e.target.value",
        appliedBy: "João Silva",
        solvedAt: new Date().toISOString()
      },
      {
        error: "Cannot find module 'react' or its corresponding type declarations",
        solution: "Execute 'npm install @types/react --save-dev'",
        appliedBy: "Maria Souza",
        solvedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    return {
      errorCountByType,
      errorCountByUser,
      averageTimeToFix,
      mostCommonErrors,
      recentSolutions
    };
  }
  
  private getStartDateFromPeriod(period: string): Date {
    const now = new Date();
    const startDate = new Date(now);
    
    switch (period) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }
    
    return startDate;
  }
} 