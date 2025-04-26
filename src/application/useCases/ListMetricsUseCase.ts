import { SummaryRepository } from '@/domain/repositories/SummaryRepository';
import { ListMetricsInput, MetricsResponse } from '@/domain/valueObjects/schemas';

export class ListMetricsUseCase {
  constructor(
    private summaryRepository: SummaryRepository
  ) {}

  async execute(input: ListMetricsInput): Promise<MetricsResponse> {
    // Calcular datas de início e fim baseado no período
    const endDate = new Date();
    let startDate = new Date();
    
    switch (input.period) {
      case 'day':
        startDate.setDate(endDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
    }
    
    // Buscar resumos para o período e filtros especificados
    const summaries = await this.summaryRepository.findByPeriod({
      projectId: input.projectId,
      userId: input.userId,
      startDate,
      endDate
    });
    
    // Calcular contagem por bloqueador
    const countsByBlocker: Record<string, number> = {};
    
    for (const summary of summaries) {
      for (const blocker of summary.blockers) {
        countsByBlocker[blocker.name] = (countsByBlocker[blocker.name] || 0) + 1;
      }
    }
    
    // Calcular bloqueadores principais
    const topBlockers = Object.entries(countsByBlocker)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);
    
    // Calcular pontuação de velocidade (métrica simulada baseada na quantidade de resumos e ausência de bloqueios)
    const summariesWithBlockers = summaries.filter(summary => summary.blockers.length > 0);
    const velocityScore = summaries.length > 0 
      ? Math.round((1 - (summariesWithBlockers.length / summaries.length)) * 100)
      : 100;
    
    // Gerar heatmap simulado (matriz de atividade por dia/semana)
    // Na implementação real, isso seria mais complexo
    // Para simplificar, vamos usar uma matriz 7x1 (para semana) ou 30x1 (para mês)
    let heatmap: number[][] = [];
    
    if (input.period === 'week') {
      // Matriz 7x1 para semana
      heatmap = Array(7).fill(0).map(() => [0]);
      
      // Preencher matriz com contagem de resumos por dia
      for (const summary of summaries) {
        const dayOfWeek = summary.date.getDay();
        heatmap[dayOfWeek][0] += 1;
      }
    } else if (input.period === 'month') {
      // Matriz 30x1 para mês
      heatmap = Array(30).fill(0).map(() => [0]);
      
      // Preencher matriz com contagem de resumos por dia
      for (const summary of summaries) {
        const dayOfMonth = summary.date.getDate() - 1; // 0-indexed
        if (dayOfMonth < 30) {
          heatmap[dayOfMonth][0] += 1;
        }
      }
    } else {
      // Para 'day', usamos uma matriz 1x1
      heatmap = [[summaries.length]];
    }
    
    return {
      countsByBlocker,
      topBlockers,
      velocityScore,
      heatmap
    };
  }
} 