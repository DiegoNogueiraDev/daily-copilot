import { PrismaClient, UserRole } from '@/generated/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Interfaces
interface UserRegisterData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

interface UserLoginData {
  email: string;
  password: string;
}

interface UserPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
}

interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

// Serviço de autenticação
export class AuthService {
  private prisma: PrismaClient;
  private readonly jwtSecret: string;
  
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.jwtSecret = process.env.JWT_SECRET || 'secret_temporario_para_desenvolvimento';
  }
  
  // Registrar um novo usuário
  async register(data: UserRegisterData): Promise<UserPayload> {
    // Verificar se email já está em uso
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email }
    });
    
    if (existingUser) {
      throw new Error('Este email já está em uso');
    }
    
    // Criptografar senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    
    // Criar usuário
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || 'DEVELOPER'
      }
    });
    
    // Retornar dados do usuário (sem a senha)
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
  }
  
  // Login de usuário
  async login(data: UserLoginData): Promise<{ user: UserPayload, token: string }> {
    // Buscar usuário pelo email
    const user = await this.prisma.user.findUnique({
      where: { email: data.email }
    });
    
    // Verificar se usuário existe
    if (!user) {
      throw new Error('Credenciais inválidas');
    }
    
    // Verificar senha
    const passwordMatch = await bcrypt.compare(data.password, user.password);
    
    if (!passwordMatch) {
      throw new Error('Credenciais inválidas');
    }
    
    // Gerar token JWT
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });
    
    // Retornar dados do usuário e token
    return {
      user: {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    };
  }
  
  // Verificar token JWT
  verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as JwtPayload;
      return decoded;
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }
  
  // Gerar token JWT
  private generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '7d' });
  }
  
  // Buscar usuário pelo ID
  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    
    // Retornar dados do usuário (sem a senha)
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
  }
  
  // Atualizar papel de um usuário
  async updateUserRole(userId: string, role: UserRole) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { role }
    });
    
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
  }
} 