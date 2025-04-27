import { BuildError } from '@/domain/entities/BuildError';

export interface BuildErrorRepository {
  create(buildError: BuildError): Promise<BuildError>;
  findById(id: string): Promise<BuildError | null>;
  findByProjectId(projectId: string): Promise<BuildError[]>;
  findByUserId(userId: string): Promise<BuildError[]>;
  findUnsolvedByProjectId(projectId: string): Promise<BuildError[]>;
  findUnsolvedByUserId(userId: string): Promise<BuildError[]>;
  findRecentByType(type: string, limit: number): Promise<BuildError[]>;
  update(buildError: BuildError): Promise<BuildError>;
  markAsSolved(id: string, solution?: string): Promise<BuildError>;
  delete(id: string): Promise<void>;
  getErrorCountByType(projectId?: string): Promise<Record<string, number>>;
} 