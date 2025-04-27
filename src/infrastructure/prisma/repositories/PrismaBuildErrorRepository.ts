import { PrismaClient } from '@prisma/client';
import { BuildError, ErrorType, ErrorSeverity } from '@/domain/entities/BuildError';
import { BuildErrorRepository } from '@/domain/repositories/BuildErrorRepository';

interface GroupByResult {
  type: string;
  _count: number;
}

export class PrismaBuildErrorRepository implements BuildErrorRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(buildError: BuildError): Promise<BuildError> {
    const data = buildError.toJSON();
    
    const created = await this.prisma.buildError.create({
      data: {
        id: data.id,
        message: data.message,
        stack: data.stack,
        type: data.type,
        severity: data.severity,
        file: data.file,
        line: data.line,
        column: data.column,
        projectId: data.projectId,
        userId: data.userId,
        solved: data.solved,
        solutionApplied: data.solutionApplied,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      }
    });
    
    return this.mapToDomain(created);
  }

  async findById(id: string): Promise<BuildError | null> {
    const buildError = await this.prisma.buildError.findUnique({
      where: { id }
    });
    
    return buildError ? this.mapToDomain(buildError) : null;
  }

  async findByProjectId(projectId: string): Promise<BuildError[]> {
    const buildErrors = await this.prisma.buildError.findMany({
      where: { projectId }
    });
    
    return buildErrors.map(this.mapToDomain);
  }

  async findByUserId(userId: string): Promise<BuildError[]> {
    const buildErrors = await this.prisma.buildError.findMany({
      where: { userId }
    });
    
    return buildErrors.map(this.mapToDomain);
  }

  async findUnsolvedByProjectId(projectId: string): Promise<BuildError[]> {
    const buildErrors = await this.prisma.buildError.findMany({
      where: { 
        projectId,
        solved: false
      }
    });
    
    return buildErrors.map(this.mapToDomain);
  }

  async findUnsolvedByUserId(userId: string): Promise<BuildError[]> {
    const buildErrors = await this.prisma.buildError.findMany({
      where: { 
        userId,
        solved: false
      }
    });
    
    return buildErrors.map(this.mapToDomain);
  }

  async findRecentByType(type: string, limit: number): Promise<BuildError[]> {
    const buildErrors = await this.prisma.buildError.findMany({
      where: { type },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
    
    return buildErrors.map(this.mapToDomain);
  }

  async update(buildError: BuildError): Promise<BuildError> {
    const data = buildError.toJSON();
    
    const updated = await this.prisma.buildError.update({
      where: { id: data.id },
      data: {
        message: data.message,
        stack: data.stack,
        type: data.type,
        severity: data.severity,
        file: data.file,
        line: data.line,
        column: data.column,
        solved: data.solved,
        solutionApplied: data.solutionApplied,
        updatedAt: data.updatedAt
      }
    });
    
    return this.mapToDomain(updated);
  }

  async markAsSolved(id: string, solution?: string): Promise<BuildError> {
    const updated = await this.prisma.buildError.update({
      where: { id },
      data: {
        solved: true,
        solutionApplied: solution,
        updatedAt: new Date()
      }
    });
    
    return this.mapToDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.buildError.delete({
      where: { id }
    });
  }

  async getErrorCountByType(projectId?: string): Promise<Record<string, number>> {
    const groupBy = await this.prisma.buildError.groupBy({
      by: ['type'],
      where: projectId ? { projectId } : undefined,
      _count: true
    });
    
    return groupBy.reduce((acc: Record<string, number>, item: GroupByResult) => {
      acc[item.type] = item._count;
      return acc;
    }, {} as Record<string, number>);
  }

  private mapToDomain(prismaError: any): BuildError {
    return new BuildError(
      prismaError.message,
      prismaError.type as ErrorType,
      prismaError.severity as ErrorSeverity,
      prismaError.projectId,
      prismaError.userId,
      prismaError.stack,
      prismaError.file,
      prismaError.line,
      prismaError.column,
      prismaError.id,
      prismaError.solved,
      prismaError.solutionApplied,
      prismaError.createdAt,
      prismaError.updatedAt
    );
  }
} 