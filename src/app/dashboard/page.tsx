'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Tipos
type MetricsResponse = {
  countsByBlocker: Record<string, number>;
  topBlockers: string[];
  velocityScore: number;
  heatmap: number[][];
};

export default function Dashboard() {
  // Estados
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    projectId: '423e4567-e89b-12d3-a456-426614174003', // Projeto X selecionado por padrão
    period: 'week' as 'day' | 'week' | 'month'
  });
  
  // Usuários e projetos mockados para seleção
  const mockProjects = [
    { id: '423e4567-e89b-12d3-a456-426614174003', name: 'Projeto X' },
    { id: '523e4567-e89b-12d3-a456-426614174004', name: 'Projeto Y' },
    { id: '623e4567-e89b-12d3-a456-426614174005', name: 'Projeto Z' }
  ];
  
  // Função para buscar métricas
  const fetchMetrics = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Construir query params
      const params = new URLSearchParams({
        projectId: filters.projectId,
        period: filters.period
      });
      
      const response = await fetch(`/api/metrics?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar métricas');
      }
      
      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar métricas');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para atualizar filtros
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // Buscar métricas quando os filtros mudarem
  useEffect(() => {
    fetchMetrics();
  }, [filters]);
  
  // Gerar um dataset mockado se a API não retornar dados
  useEffect(() => {
    if (isLoading || metrics) return;
    
    // Dados mockados para demonstração
    const mockMetrics: MetricsResponse = {
      countsByBlocker: {
        'dependency': 4,
        'env': 2,
        'spec': 3,
        'access': 1
      },
      topBlockers: ['dependency', 'spec', 'env'],
      velocityScore: 76,
      heatmap: Array(7).fill(0).map(() => [Math.floor(Math.random() * 5)])
    };
    
    setMetrics(mockMetrics);
  }, []);
  
  // Formatar dias da semana para o heatmap
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">📊 Dashboard</h1>
          <p className="text-gray-600">
            Métricas e insights para acompanhar o progresso dos projetos.
          </p>
        </div>
        <Link
          href="/"
          className="bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded-md font-medium transition"
        >
          Voltar para Registro
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="w-full sm:w-auto flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Projeto
            </label>
            <select
              name="projectId"
              value={filters.projectId}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              {mockProjects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full sm:w-auto sm:min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Período
            </label>
            <select
              name="period"
              value={filters.period}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="day">Último Dia</option>
              <option value="week">Última Semana</option>
              <option value="month">Último Mês</option>
            </select>
          </div>
        </div>
        
        {error && (
          <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">Carregando métricas...</div>
          </div>
        ) : metrics ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Métricas Gerais</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-blue-600 font-semibold">Velocidade</div>
                  <div className="flex items-end gap-2">
                    <div className="text-3xl font-bold">{metrics.velocityScore}</div>
                    <div className="text-blue-600 text-sm pb-1">/100</div>
                  </div>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="text-amber-600 font-semibold">Total de Bloqueios</div>
                  <div className="text-3xl font-bold">
                    {Object.values(metrics.countsByBlocker).reduce((a, b) => a + b, 0)}
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-3">Top Bloqueadores</h3>
              <div className="space-y-3">
                {metrics.topBlockers.map(blocker => (
                  <div key={blocker} className="flex items-center">
                    <div className="w-32 text-sm font-medium">{blocker}</div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="bg-red-500 h-full" 
                          style={{ 
                            width: `${Math.min(100, (metrics.countsByBlocker[blocker] / 5) * 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-8 text-right font-medium text-sm ml-2">
                      {metrics.countsByBlocker[blocker]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Atividade no Período</h2>
              
              {filters.period === 'week' && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Atividade por dia</h3>
                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day, index) => (
                      <div key={day} className="text-center">
                        <div className="text-xs text-gray-500 mb-1">{day}</div>
                        <div 
                          className={`
                            w-full aspect-square rounded-md flex items-center justify-center text-xs font-medium
                            ${getHeatmapColor(metrics.heatmap[index]?.[0] || 0)}
                          `}
                        >
                          {metrics.heatmap[index]?.[0] || 0}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {filters.period === 'month' && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Visão mensal</h3>
                  <div className="grid grid-cols-6 gap-1">
                    {Array(30).fill(0).map((_, index) => (
                      <div 
                        key={index} 
                        className={`
                          w-full aspect-square rounded-sm flex items-center justify-center text-[10px]
                          ${getHeatmapColor(metrics.heatmap[index]?.[0] || 0)}
                        `}
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// Função auxiliar para definir a cor do heatmap
function getHeatmapColor(value: number): string {
  if (value === 0) return 'bg-gray-100 text-gray-400';
  if (value === 1) return 'bg-blue-100 text-blue-600';
  if (value === 2) return 'bg-blue-200 text-blue-700';
  if (value === 3) return 'bg-blue-300 text-blue-800';
  if (value >= 4) return 'bg-blue-400 text-blue-900';
  return 'bg-gray-100';
} 