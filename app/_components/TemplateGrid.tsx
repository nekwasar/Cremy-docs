'use client';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  isPremium: boolean;
  usageCount: number;
}

interface TemplateGridProps {
  templates: Template[];
  onSelectTemplate: (template: Template) => void;
  isLoading?: boolean;
}

export function TemplateGrid({ templates, onSelectTemplate, isLoading = false }: TemplateGridProps) {
  if (isLoading) {
    return <p>Loading templates...</p>;
  }

  if (templates.length === 0) {
    return <p>No templates found.</p>;
  }

  return (
    <div>
      {templates.map((template) => (
        <div key={template.id} onClick={() => onSelectTemplate(template)}>
          <h3>{template.name}</h3>
          {template.isPremium && <span>Premium</span>}
          <p>{template.description}</p>
          <span>{template.usageCount} uses</span>
        </div>
      ))}
    </div>
  );
}