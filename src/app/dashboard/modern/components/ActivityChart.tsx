'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ActivityChartProps {
  isLoading: boolean;
  timeRange: string;
}

export default function ActivityChart({ isLoading, timeRange }: ActivityChartProps) {
  const [activeTab, setActiveTab] = useState('velocity');
  
  // Dados simulados para o gráfico
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
  const velocityData = [65, 72, 78, 75, 82, 85, 87];
  const blockersData = [3, 5, 2, 4, 3, 2, 1];
  
  // Valor máximo para escala
  const maxVelocity = Math.max(...velocityData);
  const maxBlockers = Math.max(...blockersData);
  
  // Determina dados baseado na tab ativa
  const chartData = activeTab === 'velocity' ? velocityData : blockersData;
  const maxValue = activeTab === 'velocity' ? maxVelocity : maxBlockers;
  
  // Altura para shimmer loading
  const loadingHeight = 240;

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
      <div className="p-4 border-b border-white/10">
        <div className="flex justify-between items-center">
          <h2 className="font-medium">Atividade do Time</h2>
          
          <div className="flex bg-white/5 rounded-md p-1">
            <button
              onClick={() => setActiveTab('velocity')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                activeTab === 'velocity' 
                  ? 'bg-[#39FF14] text-black' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Velocity
            </button>
            <button
              onClick={() => setActiveTab('blockers')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                activeTab === 'blockers' 
                  ? 'bg-[#FF0033] text-white' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Blockers
            </button>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="p-4">
          <motion.div
            variants={shimmer}
            initial="hidden"
            animate="visible"
            className="w-full h-[240px] rounded-md bg-gradient-to-r from-[#0D0D0D] via-white/5 to-[#0D0D0D] bg-[length:200%_100%]"
          />
        </div>
      ) : (
        <div className="p-4">
          <div className="relative h-[240px]">
            {/* Linhas de grade */}
            {[0, 25, 50, 75, 100].map((value) => (
              <div 
                key={value} 
                className="absolute w-full border-t border-white/5 text-white/40 text-xs"
                style={{ 
                  bottom: `${(value / 100) * 240}px`, 
                  left: 0 
                }}
              >
                <span className="absolute -top-2 -left-6">{value}</span>
              </div>
            ))}
            
            {/* Barras do gráfico */}
            <div className="absolute inset-0 flex items-end justify-between px-8">
              {chartData.map((value, index) => {
                const height = (value / (maxValue + 10)) * 100;
                
                // Cores específicas para cada tab
                const barColor = activeTab === 'velocity' 
                  ? `bg-gradient-to-t from-[#FFD600] to-[#FF6A00]`
                  : `bg-gradient-to-t from-[#FF0033] to-[#FF6A00]`;
                
                // Detectar valor anômalo (muito acima ou abaixo da média)
                const avg = chartData.reduce((a, b) => a + b, 0) / chartData.length;
                const isAnomaly = Math.abs(value - avg) > avg * 0.3;
                const glowColor = activeTab === 'velocity' 
                  ? 'rgba(255, 106, 0, 0.3)' 
                  : 'rgba(255, 0, 51, 0.3)';
                
                return (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 20,
                      duration: 0.3,
                      delay: index * 0.05
                    }}
                    className={`w-8 ${barColor} rounded-t-md ${
                      isAnomaly ? 'ring-1 ring-[#39FF14]' : ''
                    }`}
                    style={{
                      boxShadow: isAnomaly ? `0 0 15px ${glowColor}` : 'none',
                    }}
                  />
                );
              })}
            </div>
            
            {/* Rótulos de dias */}
            <div className="absolute bottom-[-24px] w-full flex justify-between px-8">
              {days.map((day, index) => (
                <div key={index} className="text-white/60 text-xs">{day}</div>
              ))}
            </div>
          </div>
          
          {/* Informações adicionais */}
          <div className="mt-6 pt-4 border-t border-white/10 flex justify-between text-sm">
            <div>
              <span className="text-white/60">Média: </span>
              <span className="font-medium text-white">
                {Math.round(chartData.reduce((a, b) => a + b, 0) / chartData.length)}
                {activeTab === 'blockers' ? ' bloqueios' : '%'}
              </span>
            </div>
            <div>
              <span className="text-white/60">Período: </span>
              <span className="font-medium text-white capitalize">{timeRange}</span>
            </div>
            <div>
              <span className={activeTab === 'velocity' ? 'text-[#A8FF60]' : 'text-[#FF0033]'}>
                {activeTab === 'velocity' 
                  ? '↗ Tendência positiva' 
                  : '↘ Redução de blockers'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 