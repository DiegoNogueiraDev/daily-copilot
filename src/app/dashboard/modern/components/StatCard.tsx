'use client';

import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  status: 'up' | 'down';
  isLoading: boolean;
}

export default function StatCard({ title, value, change, status, isLoading }: StatCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`rounded-lg p-3 border border-white/10 backdrop-blur-sm ${
        isHovered ? 'bg-white/5' : 'bg-[#0D0D0D]'
      } transition-all duration-200`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        boxShadow: isHovered ? '0 0 20px rgba(57, 255, 20, 0.1)' : 'none',
      }}
    >
      {isLoading ? (
        <motion.div
          variants={shimmer}
          initial="hidden"
          animate="visible"
          className="w-full h-24 rounded-md bg-gradient-to-r from-[#0D0D0D] via-white/5 to-[#0D0D0D] bg-[length:200%_100%]"
        />
      ) : (
        <>
          <h3 className="text-sm font-medium text-white/60 mb-2">{title}</h3>
          <div className="flex justify-between items-end">
            <div className="text-3xl font-bold">{value}</div>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              status === 'up' 
                ? 'text-[#A8FF60]' 
                : (change === 0 ? 'text-white/40' : 'text-[#FF0033]')
            }`}>
              {status === 'up' ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M10.53 3.241a.75.75 0 01.713.31l4.56 6.403a.75.75 0 01-.713 1.19l-3.815-.31a.75.75 0 01-.648.47H7.71a.75.75 0 01-.696-.47L3.354 11a.75.75 0 01-.684-1.197l7.286-6.403a.75.75 0 01.574-.16z" clipRule="evenodd" />
                  <path d="M10.696 3.83L3.241 10.361a.75.75 0 00.684 1.196l3.362-.333c.23.6.597.446.686.47h2.927c.152-.024.328-.133.648-.47l3.814.31a.75.75 0 00.713-1.189l-4.56-6.403a.75.75 0 00-.713-.31l-.159.033-.12-.043z" />
                </svg>
              )}
              <span>{Math.abs(change)}%</span>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
} 