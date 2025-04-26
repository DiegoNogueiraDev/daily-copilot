import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { getTokenFromRequest } from '@/infrastructure/services/tokenUtils';
import jwt from 'jsonwebtoken';

// Inicializar client do Prisma
const prisma = new PrismaClient();

// Chave secreta para JWT (em produção, deveria estar em variáveis de ambiente)
const JWT_SECRET = process.env.JWT_SECRET || 'secret_temporario_para_desenvolvimento';

export async function GET(request: NextRequest) {
  try {
    // Obter token
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }
    
    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    // Buscar usuário pelo ID
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }
    
    // Retornar informações do usuário
    return NextResponse.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    
    return NextResponse.json(
      { error: 'Token inválido ou expirado' },
      { status: 401 }
    );
  }
} 