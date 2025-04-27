import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ErrorDetectionSchema } from '@/domain/valueObjects/schemas';
import { AnalyzeErrorsUseCase } from '@/application/useCases/AnalyzeErrorsUseCase';
import { MCPService } from '@/infrastructure/services/MCPService';
import { BuildErrorRepository } from '@/domain/repositories/BuildErrorRepository';
import { PrismaBuildErrorRepository } from '@/infrastructure/prisma/repositories/PrismaBuildErrorRepository';

// Processa a requisição POST para analisar erros
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar entrada com Zod
    const validatedData = ErrorDetectionSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos', 
          details: validatedData.error.format() 
        }, 
        { status: 400 }
      );
    }
    
    // Obter chave de API do ambiente
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      console.error('OPENROUTER_API_KEY não definida no ambiente');
      return NextResponse.json(
        { error: 'Configuração de API incompleta' }, 
        { status: 500 }
      );
    }
    
    // Inicializar serviço e caso de uso
    const mcpService = new MCPService(apiKey);
    const buildErrorRepository = new PrismaBuildErrorRepository();
    const analyzeErrorsUseCase = new AnalyzeErrorsUseCase(
      buildErrorRepository,
      mcpService
    );
    
    // Executar análise
    const result = await analyzeErrorsUseCase.execute(validatedData.data);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao analisar erros:', error);
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    );
  }
} 