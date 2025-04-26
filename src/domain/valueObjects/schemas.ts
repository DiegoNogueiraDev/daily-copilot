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