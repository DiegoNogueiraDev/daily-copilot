import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { registerSummarySchema } from '@/domain/valueObjects/schemas';
import { PrismaSummaryRepository } from '@/infrastructure/repositories/PrismaSummaryRepository';
import { MockClassifierService } from '@/infrastructure/services/ClassifierService';
import { RegisterSummaryUseCase } from '@/application/useCases/RegisterSummaryUseCase';

// Inicializar dependências
const prisma = new PrismaClient();
const summaryRepository = new PrismaSummaryRepository(prisma);
const classifierService = new MockClassifierService();
const registerSummaryUseCase = new RegisterSummaryUseCase(summaryRepository, classifierService);

export async function POST(request: NextRequest) {
  try {
    // Extrair e validar dados da requisição
    const requestData = await request.json();
    
    // Validar usando o schema Zod
    const validationResult = registerSummarySchema.safeParse(requestData);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validationResult.error.errors },
        { status: 400 }
      );
    }
    
    const input = validationResult.data;
    
    // Executar caso de uso
    const result = await registerSummaryUseCase.execute(input);
    
    // Responder com sucesso
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Erro ao processar resumo:', error);
    
    return NextResponse.json(
      { error: 'Erro interno ao processar resumo' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    },
  });
} 