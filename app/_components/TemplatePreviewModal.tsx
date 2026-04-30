'use client';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  isPremium: boolean;
  usageCount: number;
}

interface TemplatePreviewModalProps {
  template: Template | null;
  onClose: () => void;
  onUseTemplate: (templateId: string) => void;
}

export function TemplatePreviewModal({ template, onClose, onUseTemplate }: TemplatePreviewModalProps) {
  if (!template) return null;

  return (
    <div>
      <div>
        <h2>{template.name}</h2>
        <span>{template.category}</span>
        {template.isPremium && <span>Premium</span>}
        <p>{template.description}</p>
        <p>{template.usageCount} uses</p>
        <div>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="button" onClick={() => onUseTemplate(template.id)}>
            Use Template
          </button>
        </div>
      </div>
    </div>
  );
}