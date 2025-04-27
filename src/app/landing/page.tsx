'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Animações
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const glowPulse = {
  initial: { 
    boxShadow: '0 0 5px rgba(46, 213, 115, 0.6), 0 0 20px rgba(46, 213, 115, 0.4)' 
  },
  animate: { 
    boxShadow: '0 0 10px rgba(46, 213, 115, 0.8), 0 0 30px rgba(46, 213, 115, 0.6)', 
    transition: { 
      duration: 1.5, 
      repeat: Infinity, 
      repeatType: "reverse" as const
    } 
  }
};

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxOffset = -(scrollY * 0.1);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 overflow-hidden z-0">
          <div 
            className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10"
            style={{ transform: `translateY(${parallaxOffset}px)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#111111] via-black to-[#0c0c0c]"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="mb-6"
            >
              <motion.div 
                initial="initial"
                animate="animate"
                variants={glowPulse}
                className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-[#2ed573] to-[#7bed9f] mb-6"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 md:w-12 md:h-12 text-black">
                  <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM16.2 16.2L11 13V7H12.5V12.2L17 15L16.2 16.2Z" />
                </svg>
              </motion.div>
              <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tight">
                Daily<span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2ed573] to-[#7bed9f]">Copilot</span>
              </h1>
              <p className="mt-5 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Automatize suas reuniões diárias e potencialize a produtividade da sua equipe
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="flex flex-col sm:flex-row gap-4 mt-8"
            >
              <Link 
                href="/register" 
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#2ed573] to-[#7bed9f] text-black font-medium text-lg hover:from-[#26c066] hover:to-[#6dde8f] transition-all shadow-lg hover:shadow-[0_0_15px_rgba(46,213,115,0.5)] transform hover:-translate-y-1"
              >
                Comece Grátis
              </Link>
              <Link 
                href="/login" 
                className="px-8 py-3 rounded-lg bg-transparent text-[#2ed573] font-medium text-lg border border-[#2ed573] hover:bg-[#2ed57320] transition-all shadow-lg hover:shadow-[0_0_15px_rgba(46,213,115,0.3)] transform hover:-translate-y-1"
              >
                Entrar
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            className="relative mx-auto max-w-5xl mt-12"
          >
            <div className="bg-[#111] rounded-xl shadow-[0_0_25px_rgba(46,213,115,0.15)] overflow-hidden border border-[#2ed57320]">
              <div className="relative aspect-[16/9] bg-gradient-to-br from-[#111] to-[#0a0a0a] p-8 flex flex-col items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 800 450" className="text-[#2ed57330] opacity-40">
                    <rect width="800" height="450" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8,8" />
                    <line x1="0" y1="225" x2="800" y2="225" stroke="currentColor" strokeWidth="2" strokeDasharray="8,8" />
                    <line x1="400" y1="0" x2="400" y2="450" stroke="currentColor" strokeWidth="2" strokeDasharray="8,8" />
                  </svg>
                </div>
                <div className="relative flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24 text-[#2ed573] mb-4">
                    <path d="M13,2.05V4.05C17.39,4.59 20.5,8.58 19.96,12.97C19.5,16.61 16.64,19.5 13,19.93V21.93C18.5,21.38 22.5,16.5 21.95,11C21.5,6.25 17.73,2.5 13,2.05M12,6A6,6 0 0,0 6,12C6,14.22 7.21,16.16 9,17.2V19.58C5.67,18.33 3.33,14.5 4.05,10.82C4.8,7.2 8.07,4.56 11.75,4.97C15.5,5.38 18.24,8.79 17.83,12.5C17.41,16.21 14.04,19 10.33,18.58C9.67,18.5 9,18.33 8.42,18.07L7.83,16.33C8.21,16.5 8.58,16.67 9,16.75C11.94,17.07 14.56,15.16 14.96,12.21C15.33,9.25 13.46,6.58 10.5,6.17C7.6,5.75 5,7.58 4.58,10.5C4.18,13.28 6.08,15.88 8.83,16.27C9.83,16.38 10.79,16.17 11.67,15.75V14.13C11.04,14.5 10.33,14.58 9.58,14.5C7.96,14.27 6.83,12.79 7.04,11.17C7.25,9.54 8.75,8.42 10.33,8.63C11.96,8.83 13.08,10.33 12.88,11.96C12.75,12.96 12.08,13.75 11.25,14.13V19.92C15.5,19.08 18.58,15.25 17.83,10.96C17.08,6.75 13.33,3.83 9.08,4.58C4.83,5.33 1.92,9.04 2.67,13.33C3.08,15.5 4.33,17.42 6.13,18.67L6.67,17.21C5.38,16.17 4.5,14.67 4.25,13C3.67,9.58 5.92,6.33 9.38,5.75C12.83,5.17 16.08,7.42 16.67,10.83C17.25,14.25 15,17.5 11.58,18.08C10.33,18.33 9.08,18.08 8,17.58L7.1,19.13C8.33,19.67 9.67,20 11,20A9,9 0 0,0 20,11A9,9 0 0,0 11,2C7.75,2 4.83,3.58 3.08,6.08L4.5,7.08C5.92,5.08 8.38,3.83 11,4.08C13.62,4.33 15.88,6.08 17,8.5" />
                  </svg>
                  <h3 className="text-2xl font-bold text-white mb-2">Dashboard Interativo</h3>
                  <p className="text-center text-gray-400 max-w-md">
                    Visualize métricas importantes, bloqueios e progresso do time em tempo real
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#080808]">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Por que escolher o <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2ed573] to-[#7bed9f]">Daily-Copilot</span>?
            </h2>
            <p className="mt-4 text-xl text-gray-400 max-w-3xl mx-auto">
              Economize tempo, aumente a visibilidade e impulsione a produtividade da sua equipe
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeIn} className="bg-[#111] rounded-xl p-8 shadow-lg border border-[#ffa50220] hover:shadow-[0_0_25px_rgba(255,165,2,0.15)] transition-all group">
              <div className="w-14 h-14 bg-gradient-to-r from-[#ffa502] to-[#ff9900] text-black rounded-lg flex items-center justify-center mb-6 group-hover:shadow-[0_0_15px_rgba(255,165,2,0.5)] transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                  <path d="M17 4h-1V3c0-.55-.45-1-1-1s-1 .45-1 1v1H10V3c0-.55-.45-1-1-1S8 2.45 8 3v1H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-1 15H8c-.55 0-1-.45-1-1V8h10v10c0 .55-.45 1-1 1z" />
                  <path d="M9 10h6c.55 0 1 .45 1 1s-.45 1-1 1H9c-.55 0-1-.45-1-1s.45-1 1-1zm0 4h6c.55 0 1 .45 1 1s-.45 1-1 1H9c-.55 0-1-.45-1-1s.45-1 1-1z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#ffa502] transition-colors">Economia de Tempo</h3>
              <p className="text-gray-400">
                Reduza o tempo gasto em reuniões diárias para menos de 5 minutos por desenvolvedor.
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="bg-[#111] rounded-xl p-8 shadow-lg border border-[#ff4d4d20] hover:shadow-[0_0_25px_rgba(255,77,77,0.15)] transition-all group">
              <div className="w-14 h-14 bg-gradient-to-r from-[#ff4d4d] to-[#ff6b6b] text-black rounded-lg flex items-center justify-center mb-6 group-hover:shadow-[0_0_15px_rgba(255,77,77,0.5)] transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14c0 .55-.45 1-1 1s-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4zm1-7c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#ff4d4d] transition-colors">Identificação de Bloqueios</h3>
              <p className="text-gray-400">
                Detecte e resolva impedimentos rapidamente com classificação automática de bloqueios.
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="bg-[#111] rounded-xl p-8 shadow-lg border border-[#2ed57320] hover:shadow-[0_0_25px_rgba(46,213,115,0.15)] transition-all group">
              <div className="w-14 h-14 bg-gradient-to-r from-[#2ed573] to-[#7bed9f] text-black rounded-lg flex items-center justify-center mb-6 group-hover:shadow-[0_0_15px_rgba(46,213,115,0.5)] transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM8 17c-.55 0-1-.45-1-1v-5c0-.55.45-1 1-1s1 .45 1 1v5c0 .55-.45 1-1 1zm4 0c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v8c0 .55-.45 1-1 1zm4 0c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1s1 .45 1 1v2c0 .55-.45 1-1 1z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#2ed573] transition-colors">Métricas em Tempo Real</h3>
              <p className="text-gray-400">
                Dashboard interativo com visualização de métricas por projeto, desenvolvedor e período.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-black relative">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Como <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2ed573] to-[#7bed9f]">Funciona</span>
            </h2>
            <p className="mt-4 text-xl text-gray-400 max-w-3xl mx-auto">
              Registre, analise e acompanhe o progresso da sua equipe em 3 passos simples
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8"
          >
            <motion.div variants={fadeIn} className="relative">
              <div className="bg-[#111] rounded-xl p-6 shadow-lg relative z-10 border border-[#ffa50220] hover:shadow-[0_0_25px_rgba(255,165,2,0.15)] transition-all group">
                <div className="w-12 h-12 bg-gradient-to-r from-[#ffa502] to-[#ff9900] text-black rounded-full flex items-center justify-center text-xl font-bold mb-4 group-hover:shadow-[0_0_15px_rgba(255,165,2,0.5)] transition-all">
                  1
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#ffa502] transition-colors">
                  Registre seu resumo diário
                </h3>
                <p className="text-gray-400">
                  Desenvolvedores registram suas atividades diárias em formato de texto livre
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 left-full h-1 w-16 bg-gradient-to-r from-[#ffa502] to-[#ff4d4d] z-0 transform -translate-y-1/2"></div>
            </motion.div>

            <motion.div variants={fadeIn} className="relative">
              <div className="bg-[#111] rounded-xl p-6 shadow-lg relative z-10 border border-[#ff4d4d20] hover:shadow-[0_0_25px_rgba(255,77,77,0.15)] transition-all group">
                <div className="w-12 h-12 bg-gradient-to-r from-[#ff4d4d] to-[#ff6b6b] text-black rounded-full flex items-center justify-center text-xl font-bold mb-4 group-hover:shadow-[0_0_15px_rgba(255,77,77,0.5)] transition-all">
                  2
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#ff4d4d] transition-colors">
                  Classificação inteligente
                </h3>
                <p className="text-gray-400">
                  A IA identifica automaticamente tags, bloqueios e sugestões a partir do texto
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 left-full h-1 w-16 bg-gradient-to-r from-[#ff4d4d] to-[#2ed573] z-0 transform -translate-y-1/2"></div>
            </motion.div>

            <motion.div variants={fadeIn}>
              <div className="bg-[#111] rounded-xl p-6 shadow-lg border border-[#2ed57320] hover:shadow-[0_0_25px_rgba(46,213,115,0.15)] transition-all group">
                <div className="w-12 h-12 bg-gradient-to-r from-[#2ed573] to-[#7bed9f] text-black rounded-full flex items-center justify-center text-xl font-bold mb-4 group-hover:shadow-[0_0_15px_rgba(46,213,115,0.5)] transition-all">
                  3
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#2ed573] transition-colors">
                  Visualize métricas e insights
                </h3>
                <p className="text-gray-400">
                  Acompanhe o progresso da equipe, identifique padrões e resolva bloqueios rapidamente
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#111] to-black relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#ffa502] via-[#ff4d4d] to-[#2ed573]"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Pronto para transformar suas reuniões diárias?
            </h2>
            <p className="text-xl mb-8 text-gray-400">
              Junte-se a centenas de equipes que economizam tempo e aumentam a produtividade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register" 
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#2ed573] to-[#7bed9f] text-black font-medium text-lg hover:from-[#26c066] hover:to-[#6dde8f] transition-all shadow-lg hover:shadow-[0_0_15px_rgba(46,213,115,0.5)] transform hover:-translate-y-1"
              >
                Começar Agora
              </Link>
              <Link 
                href="#" 
                className="px-8 py-3 rounded-lg bg-transparent text-white font-medium text-lg border border-white hover:border-[#2ed573] hover:text-[#2ed573] transition-all shadow-lg transform hover:-translate-y-1"
              >
                Agendar Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#080808] text-gray-400 pt-16 pb-12 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2ed573] via-[#ff4d4d] to-[#ffa502]"></div>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2ed573] to-[#7bed9f] flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-black">
                    <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM16.2 16.2L11 13V7H12.5V12.2L17 15L16.2 16.2Z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">DailyCopilot</span>
              </div>
              <p className="mb-4">
                Automatize suas reuniões diárias e potencialize a produtividade da sua equipe.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Produto</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-[#2ed573] transition-colors">Funcionalidades</Link></li>
                <li><Link href="#" className="hover:text-[#2ed573] transition-colors">Preços</Link></li>
                <li><Link href="#" className="hover:text-[#2ed573] transition-colors">Integrações</Link></li>
                <li><Link href="#" className="hover:text-[#2ed573] transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-[#2ed573] transition-colors">Sobre nós</Link></li>
                <li><Link href="#" className="hover:text-[#2ed573] transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-[#2ed573] transition-colors">Carreiras</Link></li>
                <li><Link href="#" className="hover:text-[#2ed573] transition-colors">Contato</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-[#2ed573] transition-colors">Termos de Serviço</Link></li>
                <li><Link href="#" className="hover:text-[#2ed573] transition-colors">Privacidade</Link></li>
                <li><Link href="#" className="hover:text-[#2ed573] transition-colors">Cookies</Link></li>
                <li><Link href="#" className="hover:text-[#2ed573] transition-colors">Segurança</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-sm text-center">
            <p>© 2025 DailyCopilot. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 