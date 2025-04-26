'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Tipos
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Home() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar informações do usuário atual
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/auth/me');
        
        if (response.status === 401) {
          // Usuário não autenticado
          router.push('/login');
          return;
        }
        
        if (!response.ok) {
          throw new Error('Erro ao buscar usuário');
        }
        
        const user = await response.json();
        setCurrentUser(user);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar usuário');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-400 text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🏠 Bem-vindo ao Daily-Copilot</h1>
        <p className="text-gray-600">
          Automatize suas dailies e tenha insights sobre o progresso da equipe.
        </p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

      {currentUser && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Olá, {currentUser.name}!</h2>
          <p className="text-gray-600 mb-4">
            Você está logado como {currentUser.role === 'LEADER' ? 'líder' : 'desenvolvedor'}.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Link 
              href="/projects" 
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition flex items-center justify-center"
            >
              🏗️ Meus Projetos
            </Link>
            
            <Link 
              href="/summaries" 
              className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium transition flex items-center justify-center"
            >
              📝 Registrar Daily
            </Link>
            
            {currentUser.role === 'LEADER' && (
              <Link 
                href="/dashboard" 
                className="md:col-span-2 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-md font-medium transition flex items-center justify-center"
              >
                📊 Ver Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-blue-600 text-4xl mb-4">🚫</div>
          <h3 className="text-lg font-semibold mb-2">Adeus às reuniões longas</h3>
          <p className="text-gray-600">
            Sem mais reuniões intermináveis. Economize tempo com registros rápidos de atividades.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-blue-600 text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold mb-2">Identificação automática</h3>
          <p className="text-gray-600">
            Bloqueios e impedimentos são identificados automaticamente com IA.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-blue-600 text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold mb-2">Métricas em tempo real</h3>
          <p className="text-gray-600">
            Dashboards com métricas de produtividade e identificação de problemas recorrentes.
          </p>
        </div>
      </div>
    </div>
  );
}
