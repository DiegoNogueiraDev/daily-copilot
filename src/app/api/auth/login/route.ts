import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';

// Schema para validação da entrada
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
});

// Segredo usado para assinar o JWT
const JWT_SECRET = process.env.JWT_SECRET || 'desenvolvimento-segredo-temporario';

export async function POST(request: Request) {
  try {
    // Extrai e valida os dados do corpo da requisição
    const body = await request.json();
    const validation = loginSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message }, 
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Busca o usuário no banco de dados
    const user = await db.user.findUnique({
      where: { email }
    });

    // Verifica se o usuário existe
    if (!user) {
      return NextResponse.json(
        { error: 'Email ou senha incorretos' }, 
        { status: 401 }
      );
    }

    // Verifica se a senha está correta
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Email ou senha incorretos' }, 
        { status: 401 }
      );
    }

    // Cria um token JWT com informações do usuário (exceto a senha)
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        name: user.name,
        role: user.role
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // Define o token como cookie
    cookies().set({
      name: 'dailycopilot_token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      sameSite: 'strict'
    });

    // Retorna as informações do usuário (sem senha)
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    );
  }
} 