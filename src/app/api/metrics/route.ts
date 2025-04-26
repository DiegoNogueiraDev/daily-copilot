import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { listMetricsSchema } from '@/domain/valueObjects/schemas';
import { PrismaSummaryRepository } from '@/infrastructure/repositories/PrismaSummaryRepository';
import { ListMetricsUseCase } from '@/application/useCases/ListMetricsUseCase';

// Inicializar dependências
const prisma = new PrismaClient();
const summaryRepository = new PrismaSummaryRepository(prisma);
const listMetricsUseCase = new ListMetricsUseCase(summaryRepository);

export async function GET(request: NextRequest) {
  try {
    // Extrair parâmetros da query
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId') || undefined;
    const userId = searchParams.get('userId') || undefined;
    const period = searchParams.get('period') || 'week';
    
    const requestData = {
      projectId,
      userId,
      period
    };
    
    // Validar usando o schema Zod
    const validationResult = listMetricsSchema.safeParse(requestData);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validationResult.error.errors },
        { status: 400 }
      );
    }
    
    const input = validationResult.data;
    
    // Executar caso de uso
    const result = await listMetricsUseCase.execute(input);
    
    // Responder com sucesso
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar métricas:', error);
    
    return NextResponse.json(
      { error: 'Erro interno ao buscar métricas' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    },
  });
}