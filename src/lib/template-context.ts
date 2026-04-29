import { getMongoDb } from '@/lib/mongodb';

interface TemplateStructure {
  id: string;
  name: string;
  sections: Array<{
    heading: string;
    description: string;
  }>;
}

export async function getTemplateContext(templateId: string): Promise<TemplateStructure | null> {
  try {
    const db = await getMongoDb();
    
    const template = await db.collection('templates').findOne({ _id: templateId });
    
    if (!template) {
      return null;
    }

    return {
      id: template._id.toString(),
      name: template.name,
      sections: template.sections || [],
    };
  } catch {
    return null;
  }
}

export function templateToContext(template: TemplateStructure): string {
  let context = `Template: ${template.name}\n\n`;
  
  context += 'Structure:\n';
  template.sections.forEach((section, index) => {
    context += `${index + 1}. ${section.heading}: ${section.description}\n`;
  });

  return context;
}