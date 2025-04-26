'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Tipos
interface Project {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLeader, setIsLeader] = useState(false);

  // Estado para o formulário de novo projeto
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: ''
  });

  // Buscar projetos
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          throw new Error('Erro ao buscar projetos');
        }
        
        const data = await response.json();
        setProjects(data.projects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar projetos');
      } finally {
        setIsLoading(false);
      }
    };

    // Buscar usuário atual
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        
        if (!response.ok) {
          throw new Error('Erro ao buscar usuário atual');
        }
        
        const user = await response.json();
        setCurrentUser(user);
        setIsLeader(user.role === 'LEADER' || user.role === 'ADMIN');
      } catch (err) {
        console.error('Erro ao buscar usuário atual:', err);
      }
    };

    fetchCurrentUser();
    fetchProjects();
  }, []);

  // Manipular mudanças no formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  // Enviar formulário de novo projeto
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProject)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar projeto');
      }
      
      const createdProject = await response.json();
      
      // Adicionar novo projeto à lista
      setProjects(prev => [...prev, createdProject]);
      
      // Limpar formulário e fechar
      setNewProject({ name: '', description: '' });
      setShowNewProjectForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar projeto');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">🏗️ Projetos</h1>
          <p className="text-gray-600">
            Gerencie seus projetos e equipes.
          </p>
        </div>
        {isLeader && (
          <button
            onClick={() => setShowNewProjectForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition"
          >
            Novo Projeto
          </button>
        )}
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

      {showNewProjectForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Criar Novo Projeto</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Projeto
              </label>
              <input
                type="text"
                name="name"
                value={newProject.name}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                name="description"
                value={newProject.description}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 h-24"
                placeholder="Descrição opcional do projeto"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewProjectForm(false)}
                className="border border-gray-300 bg-white text-gray-700 py-2 px-4 rounded-md font-medium transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition"
              >
                Criar Projeto
              </button>
            </div>
          </form>
        </div>
      )}
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">Carregando projetos...</div>
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
              {project.description && (
                <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
              )}
              
              <div className="flex gap-2 mt-4">
                <Link
                  href={`/projects/${project.id}`}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 py-1 px-3 rounded text-sm font-medium transition"
                >
                  Ver Detalhes
                </Link>
                {isLeader && currentUser?.id === project.ownerId && (
                  <Link
                    href={`/projects/${project.id}/edit`}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-1 px-3 rounded text-sm font-medium transition"
                  >
                    Gerenciar Equipe
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-4xl mb-4">🏗️</div>
          <h2 className="text-xl font-semibold mb-2">Nenhum projeto encontrado</h2>
          <p className="text-gray-600 mb-6">
            {isLeader 
              ? "Você ainda não criou nenhum projeto. Crie seu primeiro projeto agora!" 
              : "Você ainda não foi adicionado a nenhum projeto."}
          </p>
          {isLeader && (
            <button
              onClick={() => setShowNewProjectForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition"
            >
              Criar Primeiro Projeto
            </button>
          )}
        </div>
      )}
    </div>
  );
} 