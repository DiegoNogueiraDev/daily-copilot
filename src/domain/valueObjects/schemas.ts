import { z } from 'zod';

// Schemas para validação de entradas
export const registerSummarySchema = z.object({
  userId: z.string().uuid(),
  projectId: z.string().uuid(),
  text: z.string().min(1, "O texto não pode ser vazio"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().transform(val => val || new Date().toISOString().split('T')[0])
});

export const listMetricsSchema = z.object({
  projectId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  period: z.enum(["day", "week", "month"])
}).refine(data => {
  // Pelo menos um dos campos projectId ou userId deve estar presente
  return data.projectId !== undefined || data.userId !== undefined;
}, {
  message: "Pelo menos um dos campos projectId ou userId deve ser fornecido",
  path: ["projectId"]
});

// Tipos gerados a partir dos schemas
export type RegisterSummaryInput = z.infer<typeof registerSummarySchema>;
export type ListMetricsInput = z.infer<typeof listMetricsSchema>;

// Schemas para outputs
export const tagSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string()
});

export const blockerSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string()
});

export const suggestionSchema = z.object({
  id: z.string().uuid().optional(),
  text: z.string()
});

export const summaryResponseSchema = z.object({
  summaryId: z.string().uuid(),
  tags: z.array(z.string()),
  blockers: z.array(z.string()),
  suggestions: z.array(z.string())
});

export const metricsResponseSchema = z.object({
  countsByBlocker: z.record(z.string(), z.number()),
  topBlockers: z.array(z.string()),
  velocityScore: z.number(),
  heatmap: z.array(z.array(z.any()))
});

// Tipos gerados a partir dos schemas de output
export type SummaryResponse = z.infer<typeof summaryResponseSchema>;
export type MetricsResponse = z.infer<typeof metricsResponseSchema>;

// Novos esquemas para MCP

// Esquema para processamento de erros de build
export const BuildErrorSchema = z.object({
  message: z.string(),
  type: z.enum(['build', 'test', 'lint', 'typecheck', 'runtime']),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
  stack: z.string().optional(),
  file: z.string().optional(),
  line: z.number().optional(),
  column: z.number().optional(),
});

export type BuildErrorInput = z.infer<typeof BuildErrorSchema>;

// Esquema para detecção de erros via output de terminal
export const ErrorDetectionSchema = z.object({
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
  buildOutput: z.string(),
  source: z.enum(['npm', 'jest', 'eslint', 'tsc', 'webpack', 'vite', 'next', 'other']),
});

export type ErrorDetectionInput = z.infer<typeof ErrorDetectionSchema>;

// Esquema para resposta da análise de erro
export const ErrorAnalysisSchema = z.object({
  errors: z.array(
    z.object({
      message: z.string(),
      type: z.enum(['build', 'test', 'lint', 'typecheck', 'runtime']),
      severity: z.enum(['critical', 'high', 'medium', 'low']),
      file: z.string().optional(),
      line: z.number().optional(),
      column: z.number().optional(),
    })
  ),
  suggestions: z.array(
    z.object({
      errorIndex: z.number(),
      solution: z.string(),
      codeSnippet: z.string().optional(),
    })
  ),
  summary: z.string(),
});

export type ErrorAnalysisResponse = z.infer<typeof ErrorAnalysisSchema>;

// Esquema para solução de erro
export const ApplySolutionSchema = z.object({
  errorId: z.string().uuid(),
  solution: z.string(),
  appliedBy: z.string().uuid(),
});

export type ApplySolutionInput = z.infer<typeof ApplySolutionSchema>;

// Esquema para métricas de erro
export const ErrorMetricsSchema = z.object({
  projectId: z.string().uuid().optional(),
  period: z.enum(['day', 'week', 'month']),
});

export type ErrorMetricsInput = z.infer<typeof ErrorMetricsSchema>;

export const ErrorMetricsResponseSchema = z.object({
  errorCountByType: z.record(z.string(), z.number()),
  errorCountByUser: z.record(z.string(), z.number()),
  averageTimeToFix: z.number(),
  mostCommonErrors: z.array(
    z.object({
      type: z.string(),
      count: z.number(),
      examples: z.array(z.string()),
    })
  ),
  recentSolutions: z.array(
    z.object({
      error: z.string(),
      solution: z.string(),
      appliedBy: z.string(),
      solvedAt: z.string(),
    })
  ),
});

export type ErrorMetricsResponse = z.infer<typeof ErrorMetricsResponseSchema>; 