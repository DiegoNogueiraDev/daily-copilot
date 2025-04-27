'use client';

import { motion } from 'framer-motion';

interface TeamActivitiesProps {
  isLoading: boolean;
}

// Dados simulados
const activities = [
  {
    id: 1,
    user: 'Ana Silva',
    action: 'Registrou daily',
    time: '10 min atrás',
    tags: ['code', 'tests'],
    blockers: []
  },
  {
    id: 2,
    user: 'João Pereira',
    action: 'Reportou bloqueio',
    time: '32 min atrás',
    tags: ['code'],
    blockers: ['dependency']
  },
  {
    id: 3,
    user: 'Mariana Costa',
    action: 'Resolveu bloqueio',
    time: '1h atrás',
    tags: ['ci'],
    blockers: ['env']
  },
  {
    id: 4,
    user: 'Carlos Xavier',
    action: 'Registrou daily',
    time: '2h atrás',
    tags: ['deploy', 'docs'],
    blockers: []
  },
  {
    id: 5,
    user: 'Luana Mendes',
    action: 'Reportou bloqueio',
    time: '3h atrás',
    tags: ['review'],
    blockers: ['access']
  }
];

export default function TeamActivities({ isLoading }: TeamActivitiesProps) {
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
    <div className="rounded-lg border border-white/10 bg-[#0D0D0D] overflow-hidden h-full">
      <div className="p-4 border-b border-white/10">
        <h2 className="font-medium">Atividades Recentes</h2>
      </div>
      
      <div className="p-4 overflow-y-auto" style={{ maxHeight: '500px' }}>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <motion.div
                key={item}
                variants={shimmer}
                initial="hidden"
                animate="visible"
                className="h-16 rounded-md bg-gradient-to-r from-[#0D0D0D] via-white/5 to-[#0D0D0D] bg-[length:200%_100%]"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="p-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
              >
                <div className="flex justify-between mb-2">
                  <div className="font-medium">{activity.user}</div>
                  <div className="text-white/40 text-sm">{activity.time}</div>
                </div>
                
                <div className="flex justify-between mb-2">
                  <div className="text-white/60">
                    {activity.action}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {activity.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-2 py-0.5 bg-white/10 text-white/80 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  
                  {activity.blockers.map((blocker) => (
                    <span 
                      key={blocker} 
                      className="px-2 py-0.5 bg-[#FF0033]/10 text-[#FF6A00] text-xs rounded-full"
                    >
                      {blocker}
                    </span>
                  ))}
                  
                  {activity.action === 'Resolveu bloqueio' && (
                    <span className="px-2 py-0.5 bg-[#A8FF60]/10 text-[#A8FF60] text-xs rounded-full">
                      resolvido
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 