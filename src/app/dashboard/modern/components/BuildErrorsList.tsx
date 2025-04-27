'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface BuildErrorsListProps {
  isLoading: boolean;
}

// Tipos para os dados
type ErrorType = 'build' | 'test' | 'lint' | 'typecheck' | 'runtime';
type ErrorSeverity = 'critical' | 'high' | 'medium' | 'low';

interface BuildError {
  id: string;
  message: string;
  type: ErrorType;
  severity: ErrorSeverity;
  file?: string;
  project: string;
  user: string;
  solved: boolean;
  createdAt: string;
}

// Dados simulados
const buildErrors: BuildError[] = [
  {
    id: '1',
    message: 'Property "value" does not exist on type "Event"',
    type: 'typecheck',
    severity: 'high',
    file: 'src/components/Form.tsx',
    project: 'Portal Admin',
    user: 'Carlos Xavier',
    solved: false,
    createdAt: '15min atrás'
  },
  {
    id: '2',
    message: 'Cannot find module "react-query" or its corresponding type declarations',
    type: 'build',
    severity: 'critical',
    file: 'src/hooks/useData.ts',
    project: 'API Gateway',
    user: 'Ana Silva',
    solved: false,
    createdAt: '1h atrás'
  },
  {
    id: '3',
    message: 'Expected ";" but found ","',
    type: 'lint',
    severity: 'low',
    file: 'src/utils/format.ts',
    project: 'Portal de Clientes',
    user: 'Rafael Costa',
    solved: false,
    createdAt: '3h atrás'
  }
];

export default function BuildErrorsList({ isLoading }: BuildErrorsListProps) {
  const [filter, setFilter] = useState<string>('all');
  
  // Filtrar erros
  const filteredErrors = filter === 'all' 
    ? buildErrors 
    : buildErrors.filter(error => error.type === filter);
  
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
        <h2 className="font-medium">Erros de Build e Testes</h2>
        
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-md bg-white/5 p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                filter === 'all' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('typecheck')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                filter === 'typecheck' ? 'bg-[#FF6A00] text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              TypeCheck
            </button>
            <button
              onClick={() => setFilter('build')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                filter === 'build' ? 'bg-[#FF0033] text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              Build
            </button>
            <button
              onClick={() => setFilter('test')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                filter === 'test' ? 'bg-[#8A2BE2] text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              Testes
            </button>
            <button
              onClick={() => setFilter('lint')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                filter === 'lint' ? 'bg-[#FFD600] text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              Lint
            </button>
          </div>
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
                className="h-20 rounded-md bg-gradient-to-r from-[#0D0D0D] via-white/5 to-[#0D0D0D] bg-[length:200%_100%]"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredErrors.length === 0 ? (
              <div className="p-8 text-center text-white/40">
                Nenhum erro encontrado com o filtro atual.
              </div>
            ) : (
              filteredErrors.map((error, index) => (
                <motion.div
                  key={error.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="p-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col">
                      <div className="font-medium text-sm truncate max-w-2xl">
                        {error.message}
                      </div>
                      <div className="text-white/40 text-xs">
                        {error.file} • {error.createdAt}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        error.severity === 'critical' 
                          ? 'bg-[#FF0033]/20 text-[#FF0033]' 
                          : error.severity === 'high'
                          ? 'bg-[#FF6A00]/20 text-[#FF6A00]'
                          : error.severity === 'medium'
                          ? 'bg-[#FFD600]/20 text-[#FFD600]'
                          : 'bg-white/10 text-white/80'
                      }`}>
                        {error.severity}
                      </span>
                      
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        error.type === 'typecheck' 
                          ? 'bg-[#FF6A00]/20 text-[#FF6A00]' 
                          : error.type === 'build'
                          ? 'bg-[#FF0033]/20 text-[#FF0033]'
                          : error.type === 'test'
                          ? 'bg-[#8A2BE2]/20 text-[#8A2BE2]'
                          : error.type === 'lint'
                          ? 'bg-[#FFD600]/20 text-[#FFD600]'
                          : 'bg-white/10 text-white/80'
                      }`}>
                        {error.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-white/60 text-xs">
                      {error.project} • {error.user}
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        className="px-2 py-1 text-xs bg-white/5 rounded hover:bg-white/10 transition-colors"
                        aria-label="Ver solução"
                      >
                        Ver solução
                      </button>
                      <button 
                        className="px-2 py-1 text-xs bg-[#A8FF60]/20 text-[#A8FF60] rounded hover:bg-[#A8FF60]/30 transition-colors"
                        aria-label="Aplicar solução"
                      >
                        Aplicar solução
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
} 