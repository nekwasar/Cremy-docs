import { getMongoDb } from '@/lib/mongodb';

interface AIConfig {
  apiKey: string;
  endpoint: string;
  model: string;
  fallbackModel: string;
}

const DEFAULT_CONFIG: Partial<AIConfig> = {
  model: 'deepseek-chat',
  fallbackModel: 'deepseek-coder',
};

export async function getAIConfig(): Promise<AIConfig | null> {
  try {
    const db = await getMongoDb();
    
    const config = await db.collection('settings').findOne({ key: 'ai_config' });
    
    if (!config) {
      return null;
    }

    return {
      apiKey: config.apiKey || '',
      endpoint: config.endpoint || 'https://api.deepseek.com',
      model: config.model || DEFAULT_CONFIG.model!,
      fallbackModel: config.fallbackModel || DEFAULT_CONFIG.fallbackModel!,
    };
  } catch {
    return null;
  }
}

export async function validateAIConfig(config: AIConfig): Promise<boolean> {
  if (!config.apiKey) {
    return false;
  }

  if (!config.endpoint) {
    return false;
  }

  return true;
}

export function getDefaultModel(): string {
  return DEFAULT_CONFIG.model!;
}

export function getFallbackModel(): string {
  return DEFAULT_CONFIG.fallbackModel!;
}