import { NextRequest } from 'next/server';

/**
 * Extrai o token JWT de uma requisição Next.js
 * Procura primeiro no cookie auth_token, depois no header Authorization
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  // Verificar primeiro no cookie
  const tokenCookie = request.cookies.get('auth_token');
  
  if (tokenCookie?.value) {
    return tokenCookie.value;
  }
  
  // Verificar no header Authorization
  const authHeader = request.headers.get('Authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7); // Remove 'Bearer ' do início
  }
  
  return null;
} 