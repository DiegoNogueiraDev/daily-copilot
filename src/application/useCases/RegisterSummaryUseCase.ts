import { v4 as uuidv4 } from 'uuid';
import { Summary, Tag, Blocker, Suggestion } from '@/domain/entities/Summary';
import { SummaryRepository } from '@/domain/repositories/SummaryRepository';
import { ClassifierServicePort } from '@/infrastructure/services/ClassifierService';
import { RegisterSummaryInput, SummaryResponse } from '@/domain/valueObjects/schemas';

export class RegisterSummaryUseCase {
  constructor(
    private summaryRepository: SummaryRepository,
    private classifierService: ClassifierServicePort
  ) {}

  async execute(input: RegisterSummaryInput): Promise<SummaryResponse> {
    // Normalizar data
    const normalizedDate = input.date ? new Date(input.date) : new Date();
    
    // Criar entidade Summary inicial
    const summary = new Summary(
      input.text,
      input.userId,
      input.projectId,
      normalizedDate
    );
    
    // Classificar o texto para extrair tags, blockers e sugestões
    const classificationResult = await this.classifierService.classify(input.text);
    
    // Criar e associar tags, blockers e sugestões
    const tagIds: string[] = [];
    const blockerIds: string[] = [];
    const suggestionIds: string[] = [];
    
    // Processar tags
    for (const tagName of classificationResult.tags) {
      let tag = await this.summaryRepository.findTagByName(tagName);
      
      if (!tag) {
        tag = await this.summaryRepository.createTag({ name: tagName });
      }
      
      tagIds.push(tag.id!);
      summary.addTag(tag);
    }
    
    // Processar blockers
    for (const blockerName of classificationResult.blockers) {
      let blocker = await this.summaryRepository.findBlockerByName(blockerName);
      
      if (!blocker) {
        blocker = await this.summaryRepository.createBlocker({ name: blockerName });
      }
      
      blockerIds.push(blocker.id!);
      summary.addBlocker(blocker);
    }
    
    // Processar sugestões
    for (const suggestionText of classificationResult.suggestions) {
      const suggestion = await this.summaryRepository.createSuggestion({ 
        id: uuidv4(),
        text: suggestionText 
      });
      
      suggestionIds.push(suggestion.id!);
      summary.addSuggestion(suggestion);
    }
    
    // Persistir o resumo
    const createdSummary = await this.summaryRepository.create(summary);
    
    // Criar as relações com tags, blockers e sugestões
    for (const tagId of tagIds) {
      await this.summaryRepository.addTagToSummary(createdSummary.id, tagId);
    }
    
    for (const blockerId of blockerIds) {
      await this.summaryRepository.addBlockerToSummary(createdSummary.id, blockerId);
    }
    
    for (const suggestionId of suggestionIds) {
      await this.summaryRepository.addSuggestionToSummary(createdSummary.id, suggestionId);
    }
    
    // Retornar resposta formatada
    return {
      summaryId: createdSummary.id,
      tags: classificationResult.tags,
      blockers: classificationResult.blockers,
      suggestions: classificationResult.suggestions
    };
  }
} 