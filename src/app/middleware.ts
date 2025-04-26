import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_temporario_para_desenvolvimento';

// Rotas que não precisam de autenticação
const publicRoutes = [
  '/login',
  '/register',
  '/landing',
  '/api/auth/login',
  '/api/auth/register',
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Verificar se é uma rota pública
  if (publicRoutes.includes(path) || path.startsWith('/_next') || path.startsWith('/favicon')) {
    return NextResponse.next();
  }
  
  // Verificar token no cookie
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    // Redirecionar para o login se não houver token
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  try {
    // Verificar validade do token
    jwt.verify(token, JWT_SECRET);
    
    // Token válido, prosseguir
    return NextResponse.next();
  } catch (error) {
    // Token inválido, redirecionar para login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Configurar middleware para todas as rotas exceto as públicas
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes that don't require auth (login, register)
     * 2. Static files like images, fonts, etc.
     * 3. Browser-specific files
     * 4. Landing page
     */
    '/((?!_next/static|_next/image|favicon|api/auth/login|api/auth/register|landing).*)',
  ],
}; 