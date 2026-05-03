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
    <div onClick={onClose} style={{position:'fixed',inset:0,zIndex:100,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',background:'color-mix(in srgb, var(--color-page-bg) 40%, transparent)'}}>
      <div onClick={(e) => e.stopPropagation()} style={{background:'var(--color-modal-bg)',border:'1px solid var(--color-border)',borderRadius:'var(--radius-xl)',padding:'var(--space-8)',maxWidth:'440px',width:'100%',margin:'var(--space-4)'}}>
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