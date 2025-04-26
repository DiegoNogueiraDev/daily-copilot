'use client';

import { useState } from 'react';
import { z } from 'zod';

// Tipos e schemas
type SummaryResponse = {
  summaryId: string;
  tags: string[];
  blockers: string[];
  suggestions: string[];
};

const summaryFormSchema = z.object({
  userId: z.string().uuid(),
  projectId: z.string().uuid(),
  text: z.string().min(1, "O texto não pode ser vazio"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
});

export default function Home() {
  // Estado do formulário
  const [formData, setFormData] = useState({
    userId: '',
    projectId: '',
    text: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  // Estado para resposta do servidor
  const [response, setResponse] = useState<SummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Usuários e projetos mockados para seleção
  const mockUsers = [
    { id: '123e4567-e89b-12d3-a456-426614174000', name: 'João Silva' },
    { id: '223e4567-e89b-12d3-a456-426614174001', name: 'Maria Souza' },
    { id: '323e4567-e89b-12d3-a456-426614174002', name: 'Carlos Ferreira' }
  ];
  
  const mockProjects = [
    { id: '423e4567-e89b-12d3-a456-426614174003', name: 'Projeto X' },
    { id: '523e4567-e89b-12d3-a456-426614174004', name: 'Projeto Y' },
    { id: '623e4567-e89b-12d3-a456-426614174005', name: 'Projeto Z' }
  ];
  
  // Função para atualizar estado do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Função para enviar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Resetar estados
    setError(null);
    setResponse(null);
    setIsLoading(true);
    
    try {
      // Validar dados do formulário
      const validation = summaryFormSchema.safeParse(formData);
      
      if (!validation.success) {
        setError(validation.error.errors[0].message);
        setIsLoading(false);
        return;
      }
      
      // Enviar para API
      const res = await fetch('/api/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao registrar resumo');
      }
      
      // Sucesso
      setResponse(data);
      
      // Limpar apenas o campo de texto
      setFormData(prev => ({ ...prev, text: '' }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar resumo');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">📝 Registrar Daily</h1>
        <p className="text-gray-600">
          Compartilhe o que você fez hoje, identifique bloqueios e receba sugestões automaticamente.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Desenvolvedor
                  </label>
                  <select
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  >
                    <option value="">Selecione um desenvolvedor</option>
                    {mockUsers.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Projeto
                  </label>
                  <select
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  >
                    <option value="">Selecione um projeto</option>
                    {mockProjects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resumo do dia
                </label>
                <textarea
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  placeholder="Descreva o que você fez hoje, bloqueios enfrentados e sugestões se tiver..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 h-32"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Dica: Mencione claramente seus bloqueios com "BLOQUEIOS: ..." se tiver algum.
                </p>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition"
              >
                {isLoading ? 'Processando...' : 'Registrar Daily'}
              </button>
            </form>
          </div>
        </div>
        
        <div>
          {response ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">✅ Resumo registrado!</h2>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">📋 Tags identificadas</h3>
                <div className="flex flex-wrap gap-2">
                  {response.tags.map(tag => (
                    <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {response.blockers.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">🚧 Bloqueios identificados</h3>
                  <div className="flex flex-wrap gap-2">
                    {response.blockers.map(blocker => (
                      <span key={blocker} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                        {blocker}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {response.suggestions.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">💡 Sugestões</h3>
                  <ul className="text-sm text-gray-600 list-disc pl-5">
                    {response.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📊</div>
                <h2 className="text-lg font-medium mb-1">Resumo aparecerá aqui</h2>
                <p className="text-sm">
                  Preencha o formulário para ver a classificação do seu resumo.
                </p>
              </div>
            </div>
          )}
          
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">🔍 Consultar métricas</h2>
            <p className="text-sm text-gray-600 mb-4">
              Veja métricas e insights sobre os projetos e desenvolvedores.
            </p>
            <a
              href="/dashboard"
              className="block text-center bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded-md font-medium transition"
            >
              Acessar Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
