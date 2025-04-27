'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface BlockersListProps {
  isLoading: boolean;
}

// Tipos para os dados
type Priority = 'critical' | 'high' | 'medium' | 'low';

interface Blocker {
  id: number;
  title: string;
  type: string;
  project: string;
  user: string;
  priority: Priority;
  created: string;
}

// Dados simulados
const blockers: Blocker[] = [
  {
    id: 1,
    title: 'Dependência incompatível com Node 18',
    type: 'dependency',
    project: 'API Gateway',
    user: 'João Pereira',
    priority: 'high',
    created: '32min atrás'
  },
  {
    id: 2,
    title: 'Credenciais de acesso ao serviço de pagamento expiradas',
    type: 'access',
    project: 'Portal de Clientes',
    user: 'Luana Mendes',
    priority: 'critical',
    created: '3h atrás'
  },
  {
    id: 3,
    title: 'Configuração do ambiente de staging com erro',
    type: 'env',
    project: 'Microsserviço de Notificações',
    user: 'Rafael Costa',
    priority: 'medium',
    created: '5h atrás'
  },
  {
    id: 4,
    title: 'Especificação de API com dados inconsistentes',
    type: 'spec',
    project: 'API de Pagamentos',
    user: 'Fernanda Lima',
    priority: 'medium',
    created: '1d atrás'
  },
  {
    id: 5,
    title: 'Conflito de merge na branch feature/auth',
    type: 'merge-conflict',
    project: 'Portal Admin',
    user: 'Lucas Souza',
    priority: 'low',
    created: '1d atrás'
  }
];

export default function BlockersList({ isLoading }: BlockersListProps) {
  const [sortBy, setSortBy] = useState<'priority' | 'created'>('priority');

  // Mapeamento de prioridades para ordenação
  const priorityValues: Record<Priority, number> = {
    'critical': 0,
    'high': 1,
    'medium': 2,
    'low': 3
  };

  // Ordenar blockers baseado no critério selecionado
  const sortedBlockers = [...blockers].sort((a, b) => {
    if (sortBy === 'priority') {
      return priorityValues[a.priority] - priorityValues[b.priority];
    } else if (sortBy === 'created') {
      // Simplificado para exemplo - normalmente você usaria timestamps
      return a.created.localeCompare(b.created);
    }
    return 0;
  });

  // Shimmer efeito para estado de carregamento
  const shimmer = {
    hidden: { backgroundPosition: '-200% 0' },
    visible: { 
      backgroundPosition: '200% 0',
      transition: { 
        repeat: Infinity, 
        duration: 1.5, 
        ease: 'linear',
      } 
    }
  };

  return (
    <div className="rounded-lg border border-white/10 bg-[#0D0D0D] overflow-hidden">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h2 className="font-medium">Bloqueios Ativos</h2>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/60">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'priority' | 'created')}
              className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#39FF14] focus:ring-offset-1 focus:ring-offset-[#0D0D0D]"
            >
              <option value="priority">Prioridade</option>
              <option value="created">Mais recentes</option>
            </select>
          </div>
          
          <button className="px-2 py-1 bg-[#39FF14] text-black text-sm font-medium rounded hover:bg-[#33EE10] transition-colors">
            Adicionar
          </button>
        </div>
      </div>
      
      <div className="p-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                variants={shimmer}
                initial="hidden"
                animate="visible"
                className="h-24 rounded-md bg-gradient-to-r from-[#0D0D0D] via-white/5 to-[#0D0D0D] bg-[length:200%_100%]"
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-white/60 text-sm border-b border-white/10">
                  <th className="pb-2">Bloqueio</th>
                  <th className="pb-2">Tipo</th>
                  <th className="pb-2">Projeto</th>
                  <th className="pb-2">Reportado por</th>
                  <th className="pb-2">Prioridade</th>
                  <th className="pb-2">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sortedBlockers.map((blocker, index) => (
                  <motion.tr 
                    key={blocker.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="hover:bg-white/5"
                  >
                    <td className="py-3 pr-4">
                      <div className="font-medium">{blocker.title}</div>
                      <div className="text-white/40 text-sm">{blocker.created}</div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full">
                        {blocker.type}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-white/80">{blocker.project}</td>
                    <td className="py-3 pr-4 text-white/80">{blocker.user}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        blocker.priority === 'critical' 
                          ? 'bg-[#FF0033]/20 text-[#FF0033]' 
                          : blocker.priority === 'high'
                          ? 'bg-[#FF6A00]/20 text-[#FF6A00]'
                          : blocker.priority === 'medium'
                          ? 'bg-[#FFD600]/20 text-[#FFD600]'
                          : 'bg-white/10 text-white/80'
                      }`}>
                        {blocker.priority}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button 
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                          aria-label="Resolver bloqueio"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#A8FF60]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                        <button 
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                          aria-label="Detalhes do bloqueio"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white/60">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 