'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Componentes
import StatCard from './components/StatCard';
import ActivityChart from './components/ActivityChart';
import TeamActivities from './components/TeamActivities';
import BlockersList from './components/BlockersList';
import BuildErrorsList from './components/BuildErrorsList';
import ProjectSelector from './components/ProjectSelector';

export default function ModernDashboard() {
  const [currentProject, setCurrentProject] = useState('all');
  const [timeRange, setTimeRange] = useState('week');
  const [isLoading, setIsLoading] = useState(true);

  // Simulação de carregamento dos dados
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Estatísticas simuladas
  const stats = [
    { id: 1, title: 'Velocity Score', value: 87, change: 12, status: 'up' },
    { id: 2, title: 'Bloqueios Ativos', value: 3, change: -2, status: 'down' },
    { id: 3, title: 'Tempo Médio p/ Resolução', value: '1.2d', change: -8, status: 'down' },
    { id: 4, title: 'Membros Ativos', value: 12, change: 3, status: 'up' },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-[#0D0D0D]/80 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-[#39FF14] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-black">
                <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM16.2 16.2L11 13V7H12.5V12.2L17 15L16.2 16.2Z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold">DailyCopilot</h1>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#" className="text-white/80 hover:text-[#39FF14] transition-colors duration-200">Dashboard</Link>
              <Link href="#" className="text-white/80 hover:text-[#39FF14] transition-colors duration-200">Projetos</Link>
              <Link href="#" className="text-white/80 hover:text-[#39FF14] transition-colors duration-200">Time</Link>
              <Link href="#" className="text-white/80 hover:text-[#39FF14] transition-colors duration-200">Configurações</Link>
            </nav>

            <div className="flex items-center gap-2">
              <button 
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Notificações"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </button>
              <button 
                className="w-8 h-8 rounded-full bg-gradient-to-r from-[#39FF14] to-[#A8FF60] flex items-center justify-center shadow-[0_0_10px_rgba(57,255,20,0.5)]"
                aria-label="Perfil"
              >
                <span className="text-black font-bold text-sm">DC</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-8">
        {/* Dashboard controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-1">Dashboard</h2>
            <p className="text-white/60">Visão geral do progresso e bloqueios do time</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <ProjectSelector 
              currentProject={currentProject} 
              onProjectChange={setCurrentProject} 
            />
            
            <div className="flex rounded-lg border border-white/10 overflow-hidden h-10">
              <button 
                onClick={() => setTimeRange('day')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${timeRange === 'day' ? 
                  'bg-[#39FF14] text-black' : 'bg-transparent text-white/80 hover:bg-white/10'}`}
              >
                Dia
              </button>
              <button 
                onClick={() => setTimeRange('week')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${timeRange === 'week' ? 
                  'bg-[#39FF14] text-black' : 'bg-transparent text-white/80 hover:bg-white/10'}`}
              >
                Semana
              </button>
              <button 
                onClick={() => setTimeRange('month')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${timeRange === 'month' ? 
                  'bg-[#39FF14] text-black' : 'bg-transparent text-white/80 hover:bg-white/10'}`}
              >
                Mês
              </button>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map(stat => (
            <StatCard key={stat.id} {...stat} isLoading={isLoading} />
          ))}
        </div>

        {/* Charts & Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ActivityChart isLoading={isLoading} timeRange={timeRange} />
          </div>
          <div>
            <TeamActivities isLoading={isLoading} />
          </div>
        </div>

        {/* Blockers & Errors Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <BlockersList isLoading={isLoading} />
          </div>
          <div>
            <BuildErrorsList isLoading={isLoading} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="px-6 py-3 bg-[#39FF14] text-black font-medium rounded-lg shadow-[0_0_15px_rgba(57,255,20,0.4)] hover:shadow-[0_0_20px_rgba(57,255,20,0.6)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0D0D0D] focus:ring-[#39FF14]"
          >
            Novo Registro
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="px-6 py-3 bg-transparent border border-white/20 text-white font-medium rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0D0D0D] focus:ring-[#39FF14]"
          >
            Exportar Relatório
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="px-6 py-3 bg-[#FF0033] text-white font-medium rounded-lg shadow-[0_0_15px_rgba(255,0,51,0.3)] hover:shadow-[0_0_20px_rgba(255,0,51,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0D0D0D] focus:ring-[#FF0033]"
          >
            Resolver Bloqueios
          </motion.button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-white/40 mb-4 md:mb-0">
            © 2025 DailyCopilot. Todos os direitos reservados.
          </div>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-white/40 hover:text-[#39FF14] transition-colors">Termos</Link>
            <Link href="#" className="text-sm text-white/40 hover:text-[#39FF14] transition-colors">Privacidade</Link>
            <Link href="#" className="text-sm text-white/40 hover:text-[#39FF14] transition-colors">Suporte</Link>
          </div>
        </div>
      </footer>
    </div>
  );
} 