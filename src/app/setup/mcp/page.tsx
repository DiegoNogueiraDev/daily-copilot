'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function MCPSetupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

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
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Configuração do MCP (Model Context Protocol)</h2>
            <p className="text-white/60">
              Siga os passos abaixo para configurar o MCP na sua IDE e conectar ao DailyCopilot.
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index + 1 === currentStep 
                        ? 'bg-[#39FF14] text-black' 
                        : index + 1 < currentStep 
                          ? 'bg-white/20 text-white' 
                          : 'bg-white/10 text-white/40'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="text-xs mt-1 text-white/60">
                    {index === 0 ? 'Configuração' : index === 1 ? 'Cadastro' : 'Integração'}
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#39FF14] h-full transition-all duration-300 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Step content */}
          <div className="bg-white/5 rounded-lg border border-white/10 p-6">
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-medium mb-4">1. Configurando o MCP na sua IDE</h3>
                <div className="space-y-4">
                  <div className="rounded-md bg-black/30 p-4 border border-white/5">
                    <h4 className="font-medium mb-2">Pré-requisitos</h4>
                    <ul className="list-disc pl-5 space-y-2 text-white/80">
                      <li>Node.js v16 ou superior</li>
                      <li>NPM ou Yarn</li>
                      <li>Visual Studio Code, IntelliJ IDEA ou outra IDE compatível</li>
                    </ul>
                  </div>

                  <div className="mt-6 space-y-4">
                    <h4 className="font-medium">Passos para configuração:</h4>
                    
                    <div className="border-l-2 border-white/20 pl-4 py-2">
                      <p className="font-medium">1. Instale a extensão MCP</p>
                      <p className="text-white/60 mt-1">
                        Baixe e instale a extensão DailyCopilot MCP para sua IDE.
                      </p>
                      <div className="mt-2">
                        <Link href="https://marketplace.visualstudio.com/items?itemName=dailycopilot.mcp" 
                          className="inline-flex items-center px-3 py-1.5 bg-white/10 rounded-md hover:bg-white/20 transition-colors text-sm"
                          target="_blank"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          Download para VS Code
                        </Link>
                      </div>
                    </div>
                    
                    <div className="border-l-2 border-white/20 pl-4 py-2">
                      <p className="font-medium">2. Inicie a extensão na sua IDE</p>
                      <p className="text-white/60 mt-1">
                        Abra sua IDE e clique no ícone do DailyCopilot na barra lateral.
                      </p>
                      <div className="mt-3 bg-[#1E1E1E] rounded-md p-3 border border-white/10">
                        <code className="text-xs text-white/80">
                          # Ou use o comando via terminal integrado<br />
                          > DailyCopilot: Iniciar MCP
                        </code>
                      </div>
                    </div>
                    
                    <div className="border-l-2 border-white/20 pl-4 py-2">
                      <p className="font-medium">3. Configure o endpoint</p>
                      <p className="text-white/60 mt-1">
                        Nas configurações da extensão, adicione o endpoint do servidor MCP.
                      </p>
                      <div className="mt-3 bg-[#1E1E1E] rounded-md p-3 border border-white/10">
                        <code className="text-xs text-white/80">
                          # URL do servidor MCP<br />
                          https://api.dailycopilot.app/mcp/analyze
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-medium mb-4">2. Criando sua conta</h3>
                <div className="space-y-4">
                  <p className="text-white/80">
                    Para conectar o MCP ao servidor, você precisa criar uma conta no DailyCopilot.
                  </p>

                  <div className="mt-6 space-y-4">
                    <div className="border-l-2 border-white/20 pl-4 py-2">
                      <p className="font-medium">1. Cadastre-se no DailyCopilot</p>
                      <p className="text-white/60 mt-1">
                        Se ainda não possui uma conta, crie agora:
                      </p>
                      <div className="mt-3">
                        <Link href="/register" 
                          className="inline-flex items-center px-4 py-2 bg-[#39FF14] text-black font-medium rounded-md hover:bg-[#33EE10] transition-colors text-sm"
                        >
                          Criar conta
                        </Link>
                      </div>
                    </div>
                    
                    <div className="border-l-2 border-white/20 pl-4 py-2">
                      <p className="font-medium">2. Faça login</p>
                      <p className="text-white/60 mt-1">
                        Se já possui uma conta, faça login para continuar:
                      </p>
                      <div className="mt-3">
                        <Link href="/login" 
                          className="inline-flex items-center px-4 py-2 bg-white/10 text-white font-medium rounded-md hover:bg-white/20 transition-colors text-sm"
                        >
                          Entrar
                        </Link>
                      </div>
                    </div>
                    
                    <div className="border-l-2 border-white/20 pl-4 py-2">
                      <p className="font-medium">3. Selecione seu projeto</p>
                      <p className="text-white/60 mt-1">
                        Após o login, selecione ou crie um projeto para associar ao MCP.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-medium mb-4">3. Integrando com sua IDE</h3>
                <div className="space-y-4">
                  <p className="text-white/80">
                    Após criar sua conta, você receberá um token de autenticação único para conectar o MCP.
                  </p>

                  <div className="bg-[#111] rounded-lg border border-white/10 p-4 mt-4">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">Seu token pessoal de API</p>
                      <button className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition-colors">
                        Copiar
                      </button>
                    </div>
                    <div className="mt-2 bg-black/50 p-3 rounded-md border border-white/5 overflow-x-auto">
                      <code className="text-sm text-[#39FF14]">mcp_XXXXXXXXXXXXXXXXXXXXXXXXXXXX</code>
                    </div>
                    <p className="text-xs text-white/40 mt-2">
                      Este token permite que o MCP envie dados ao servidor. Mantenha-o privado.
                    </p>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="border-l-2 border-white/20 pl-4 py-2">
                      <p className="font-medium">1. Configure o token na extensão</p>
                      <p className="text-white/60 mt-1">
                        Na configuração da extensão MCP, adicione seu token pessoal.
                      </p>
                      <div className="mt-3 bg-[#1E1E1E] rounded-md p-3 border border-white/10">
                        <code className="text-xs text-white/80">
                          # Nas configurações da extensão<br />
                          DailyCopilot: MCP Token = mcp_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
                        </code>
                      </div>
                    </div>
                    
                    <div className="border-l-2 border-white/20 pl-4 py-2">
                      <p className="font-medium">2. Teste a conexão</p>
                      <p className="text-white/60 mt-1">
                        Verifique se a conexão está funcionando corretamente.
                      </p>
                      <div className="mt-3 bg-[#1E1E1E] rounded-md p-3 border border-white/10">
                        <code className="text-xs text-white/80">
                          # Na IDE, execute o comando<br />
                          > DailyCopilot: Testar Conexão MCP
                        </code>
                      </div>
                    </div>
                    
                    <div className="border-l-2 border-white/20 pl-4 py-2">
                      <p className="font-medium">3. Pronto!</p>
                      <p className="text-white/60 mt-1">
                        Sua IDE agora está configurada para enviar dados de erros e build para análise com IA.
                      </p>
                      <div className="mt-3">
                        <Link href="/dashboard/modern" 
                          className="inline-flex items-center px-4 py-2 bg-[#39FF14] text-black font-medium rounded-md hover:bg-[#33EE10] transition-colors text-sm"
                        >
                          Ir para o Dashboard
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation buttons */}
            <div className="mt-8 flex justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-4 py-2 rounded-md border border-white/10 ${
                  currentStep === 1 
                    ? 'bg-white/5 text-white/40 cursor-not-allowed' 
                    : 'bg-white/10 text-white hover:bg-white/20 transition-colors'
                }`}
              >
                Voltar
              </button>
              
              <button
                onClick={nextStep}
                disabled={currentStep === totalSteps}
                className={`px-4 py-2 rounded-md ${
                  currentStep === totalSteps 
                    ? 'bg-white/5 text-white/40 border border-white/10 cursor-not-allowed' 
                    : 'bg-[#39FF14] text-black hover:bg-[#33EE10] transition-colors'
                }`}
              >
                {currentStep === totalSteps ? 'Finalizado' : 'Próximo'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 