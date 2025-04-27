import { BuildError } from '@/domain/entities/BuildError';
import { BuildErrorRepository } from '@/domain/repositories/BuildErrorRepository';
import { MCPServicePort } from '@/infrastructure/services/MCPService';
import { ErrorDetectionInput, ErrorAnalysisResponse } from '@/domain/valueObjects/schemas';

export class AnalyzeErrorsUseCase {
  constructor(
    private buildErrorRepository: BuildErrorRepository,
    private mcpService: MCPServicePort
  ) {}

  async execute(input: ErrorDetectionInput): Promise<ErrorAnalysisResponse> {
    // Analisar erros usando o serviço MCP
    const analysisResult = await this.mcpService.analyzeErrors(input);
    
    // Persistir erros detectados
    const savedErrors: BuildError[] = [];
    
    for (let i = 0; i < analysisResult.errors.length; i++) {
      const error = analysisResult.errors[i];
      
      // Buscar sugestão correspondente
      const suggestion = analysisResult.suggestions.find(s => s.errorIndex === i);
      
      const buildError = new BuildError(
        error.message,
        error.type,
        error.severity,
        input.projectId,
        input.userId,
        undefined, // stack
        error.file,
        error.line,
        error.column
      );
      
      // Salvar erro no repositório
      const savedError = await this.buildErrorRepository.create(buildError);
      savedErrors.push(savedError);
    }
    
    // Enriquecer a resposta com IDs
    const enhancedResponse: ErrorAnalysisResponse = {
      ...analysisResult,
      errors: analysisResult.errors.map((error, index) => ({
        ...error,
        id: savedErrors[index]?.id
      }))
    };
    
    return enhancedResponse;
  }
} 