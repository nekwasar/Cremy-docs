'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGenerateStore } from '@/store/generate-store';
import { useSocket } from '@/hooks/useSocket';
import { useGeneration } from '@/hooks/useGeneration';
import { DocStructureSelector } from '../../_components/DocStructureSelector';
import { TemplatePreviewModal } from '../../_components/TemplatePreviewModal';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import i from '@/styles/components/Input.module.css';

export default function GeneratePage() {
  const {
    inputValue,
    selectedStructure,
    selectedTemplate,
    isGenerating,
    creditEstimate,
    generatedDocumentId,
    isStreaming,
    setInputValue,
    setStructure,
    setTemplate,
    clearInput,
  } = useGenerateStore();

  const { socket } = useSocket();
  const { generate, cancel } = useGeneration({ socket });
  const [showTemplates, setShowTemplates] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);

  const handleGenerate = () => {
    if (!inputValue.trim()) return;
    generate(inputValue, selectedStructure, selectedTemplate || undefined);
  };

  const handleUseTemplate = (templateId: string) => {
    setTemplate(templateId);
    setPreviewTemplate(null);
    setShowTemplates(false);
  };

  return (
    <div style={{maxWidth:'var(--container-lg)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <div style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)',marginBottom:'var(--space-6)'}}>
        <Link href="/">Home</Link>
        <span style={{margin:'0 var(--space-2)'}}>/</span>
        <span>Generate</span>
      </div>

      {generatedDocumentId ? (
        <div className={`${c.card} ${c.soft}`} style={{textAlign:'center',padding:'var(--space-10)'}}>
          <h2 style={{marginBottom:'var(--space-4)'}}>Document Generated</h2>
          <Link href={`/preview?doc=${generatedDocumentId}`} className={`${b.btn} ${b.soft}`}>View Document</Link>
        </div>
      ) : (
        <div className={`${c.card} ${c.soft}`} style={{padding:'var(--space-8)'}}>
          <textarea
            className={`${i.input} ${i.soft} ${i.textarea}`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe what you want to create..."
            disabled={isGenerating}
            style={{minHeight:'120px'}}
          />

          <div style={{marginTop:'var(--space-4)'}}>
            <DocStructureSelector value={selectedStructure} onChange={setStructure} />
          </div>

          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'var(--space-4)',flexWrap:'wrap',gap:'var(--space-3)'}}>
            <div style={{display:'flex',gap:'var(--space-3)'}}>
              <button
                type="button"
                className={`${b.btn} ${b.minimal}`}
                onClick={() => setShowTemplates(true)}
              >
                Explore Styles
              </button>
              <button
                type="button"
                className={`${b.btn} ${b.minimal}`}
                onClick={clearInput}
                disabled={!inputValue}
              >
                Clear
              </button>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'var(--space-4)'}}>
              <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-secondary)'}}>
                ~{creditEstimate} credits
              </span>
              {isGenerating ? (
                <button className={`${b.btn} ${b.soft}`} onClick={cancel}>Cancel</button>
              ) : (
                <button className={`${b.btn} ${b.soft}`} onClick={handleGenerate} disabled={!inputValue.trim()}>
                  Generate Document
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showTemplates && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => { setShowTemplates(false); setPreviewTemplate(null); }}
          onUseTemplate={handleUseTemplate}
        />
      )}
    </div>
  );
}
