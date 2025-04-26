import { Summary, Tag, Blocker, Suggestion } from '../entities/Summary';

export interface SummaryRepository {
  create(summary: Summary): Promise<Summary>;
  findById(id: string): Promise<Summary | null>;
  findByUserId(userId: string, limit?: number): Promise<Summary[]>;
  findByProjectId(projectId: string, limit?: number): Promise<Summary[]>;
  findByPeriod(params: {
    projectId?: string;
    userId?: string;
    startDate: Date;
    endDate: Date;
  }): Promise<Summary[]>;
  
  // Métodos para tags, blockers e suggestions
  createTag(tag: Tag): Promise<Tag>;
  findTagByName(name: string): Promise<Tag | null>;
  
  createBlocker(blocker: Blocker): Promise<Blocker>;
  findBlockerByName(name: string): Promise<Blocker | null>;
  
  createSuggestion(suggestion: Suggestion): Promise<Suggestion>;
  
  // Métodos de relação
  addTagToSummary(summaryId: string, tagId: string): Promise<void>;
  addBlockerToSummary(summaryId: string, blockerId: string): Promise<void>;
  addSuggestionToSummary(summaryId: string, suggestionId: string): Promise<void>;
} 