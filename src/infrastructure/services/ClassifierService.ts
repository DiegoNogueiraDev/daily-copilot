export interface ClassificationResult {
  tags: string[];
  blockers: string[];
  suggestions: string[];
}

// Interface para acessar o serviço OpenRouter
export interface ClassifierServicePort {
  classify(text: string): Promise<ClassificationResult>;
}

// Implementação simulada para fins de desenvolvimento
// No ambiente real, isso seria substituído por uma chamada ao OpenRouter com o modelo Llama-4
export class MockClassifierService implements ClassifierServicePort {
  async classify(text: string): Promise<ClassificationResult> {
    // Regras simples para classificação por palavras-chave
    const tags: string[] = [];
    const blockers: string[] = [];
    const suggestions: string[] = [];
    
    // Detectar tags
    if (text.toLowerCase().includes('código') || text.toLowerCase().includes('implementa')) tags.push('code');
    if (text.toLowerCase().includes('teste')) tags.push('tests');
    if (text.toLowerCase().includes('review')) tags.push('review');
    if (text.toLowerCase().includes('deploy') || text.toLowerCase().includes('ambiente')) tags.push('deploy');
    if (text.toLowerCase().includes('ci') || text.toLowerCase().includes('pipeline')) tags.push('ci');
    if (text.toLowerCase().includes('document')) tags.push('docs');
    
    // Garantir que há ao menos uma tag
    if (tags.length === 0) tags.push('code');
    
    // Detectar bloqueios
    if (text.toLowerCase().includes('dependência') || text.toLowerCase().includes('lib') || 
        text.toLowerCase().includes('biblioteca') || text.toLowerCase().includes('versão')) {
      blockers.push('dependency');
    }
    
    if (text.toLowerCase().includes('ambiente') || text.toLowerCase().includes('env') || 
        text.toLowerCase().includes('configuração')) {
      blockers.push('env');
    }
    
    if (text.toLowerCase().includes('requisito') || text.toLowerCase().includes('especificação') || 
        text.toLowerCase().includes('não está claro')) {
      blockers.push('spec');
    }
    
    if (text.toLowerCase().includes('acesso') || text.toLowerCase().includes('permissão') || 
        text.toLowerCase().includes('autenticação')) {
      blockers.push('access');
    }
    
    if (text.toLowerCase().includes('conflito') || text.toLowerCase().includes('merge')) {
      blockers.push('merge-conflict');
    }
    
    // Gerar sugestões baseadas nos bloqueios
    if (blockers.includes('dependency')) {
      suggestions.push('Atualizar para versão compatível ou buscar alternativa');
    }
    
    if (blockers.includes('env')) {
      suggestions.push('Verificar documentação de configuração do ambiente');
    }
    
    if (blockers.includes('spec')) {
      suggestions.push('Agendar reunião para esclarecer requisitos');
    }
    
    if (blockers.includes('access')) {
      suggestions.push('Solicitar acesso ao administrador do sistema');
    }
    
    if (blockers.includes('merge-conflict')) {
      suggestions.push('Resolva conflitos e rebase com a branch principal');
    }
    
    return { tags, blockers, suggestions };
  }
}

// Implementação real usando OpenRouter (a ser implementada)
export class OpenRouterClassifierService implements ClassifierServicePort {
  private apiKey: string;
  private endpoint: string;
  
  constructor(apiKey: string, endpoint: string = 'https://openrouter.ai/api/v1/chat/completions') {
    this.apiKey = apiKey;
    this.endpoint = endpoint;
  }
  
  async classify(text: string): Promise<ClassificationResult> {
    try {
      // Construir o prompt para o modelo
      const prompt = `
      Analise o seguinte resumo diário de atividade de um desenvolvedor e extraia:
      1. Tags de atividade (escolha entre: code, tests, review, deploy, ci, docs)
      2. Bloqueadores identificados (escolha entre: dependency, env, spec, access, merge-conflict)
      3. Sugestões de como resolver os bloqueios
      
      Formato de resposta deve ser um objeto JSON com as chaves: tags, blockers, suggestions
      
      Resumo: ${text}
      `;
      
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-maverick',
          messages: [
            { role: 'system', content: 'Você é um assistente especializado em classificar resumos diários de desenvolvedores.' },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' }
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error from OpenRouter: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      
      return {
        tags: result.tags || [],
        blockers: result.blockers || [],
        suggestions: result.suggestions || []
      };
    } catch (error) {
      console.error('Error classifying text with OpenRouter:', error);
      // Fallback para o classificador simulado em caso de erro
      const mockClassifier = new MockClassifierService();
      return mockClassifier.classify(text);
    }
  }
} 