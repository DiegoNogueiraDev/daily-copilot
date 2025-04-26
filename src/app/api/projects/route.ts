import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { getTokenFromRequest } from '@/infrastructure/services/tokenUtils';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

// Schema para validação de novos projetos
const createProjectSchema = z.object({
  name: z.string().min(3, "Nome do projeto deve ter pelo menos 3 caracteres"),
  description: z.string().optional()
});

// Inicializar client do Prisma
const prisma = new PrismaClient();

// Chave secreta para JWT (em produção, deveria estar em variáveis de ambiente)
const JWT_SECRET = process.env.JWT_SECRET || 'secret_temporario_para_desenvolvimento';

// Função auxiliar para obter usuário autenticado do token
async function getAuthenticatedUser(request: NextRequest) {
  const token = getTokenFromRequest(request);
  
  if (!token) {
    throw new Error('Não autorizado');
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    
    return {
      ...user,
      isLeader: decoded.role === 'LEADER' || decoded.role === 'ADMIN'
    };
  } catch (error) {
    throw new Error('Token inválido ou expirado');
  }
}

// GET: Listar projetos
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    
    let projects;
    
    // Líderes podem ver todos os seus projetos, desenvolvedores só veem projetos a que foram adicionados
    if (user.isLeader) {
      projects = await prisma.project.findMany({
        where: {
          OR: [
            { ownerId: user.id },
            { users: { some: { id: user.id } } }
          ]
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      projects = await prisma.project.findMany({
        where: {
          users: {
            some: { id: user.id }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    }
    
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Erro ao listar projetos:', error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno ao listar projetos' },
      { status: error instanceof Error && error.message === 'Não autorizado' ? 401 : 500 }
    );
  }
}

// POST: Criar novo projeto
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    
    // Verificar se usuário tem permissão para criar projetos
    if (!user.isLeader) {
      return NextResponse.json(
        { error: 'Apenas líderes podem criar projetos' },
        { status: 403 }
      );
    }
    
    // Extrair e validar dados
    const body = await request.json();
    const validationResult = createProjectSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const { name, description } = validationResult.data;
    
    // Criar projeto
    const project = await prisma.project.create({
      data: {
        name,
        description: description || null,
        ownerId: user.id,
        users: {
          connect: { id: user.id } // Adicionar criador como membro do projeto
        }
      }
    });
    
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno ao criar projeto' },
      { status: error instanceof Error && error.message === 'Não autorizado' ? 401 : 500 }
    );
  }
} 