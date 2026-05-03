'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGenerateStore } from '@/store/generate-store';
import { useSocket } from '@/hooks/useSocket';
import { useGeneration } from '@/hooks/useGeneration';
import { GenerateInputBox } from '../../_components/GenerateInputBox';
import { CreditEstimateDisplay } from '../../_components/CreditEstimateDisplay';
import { DocStructureSelector } from '../../_components/DocStructureSelector';
import { ExploreStylesButton } from '../../_components/ExploreStylesButton';
import { AddImageButton } from '../../_components/AddImageButton';
import { ClearInput } from '../../_components/ClearInput';
import { TemplatePreviewModal } from '../../_components/TemplatePreviewModal';
import { CreditBalance } from '../../_components/CreditBalance';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';

export default function GeneratePage() {
  const {
    inputValue,
    selectedStructure,
    selectedTemplate,
    images,
    isGenerating,
    creditEstimate,
    generatedDocumentId,
    isStreaming,
    streamedContent,
    setInputValue,
    setStructure,
    setTemplate,
    addImage,
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
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'var(--space-4)'}}>
        <Link href="/">Logo</Link>
        <CreditBalance />
        <Link href="/dashboard">Account</Link>
      </div>

      <div>
        <Link href="/" style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)'}}>Home</Link>
        <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)',margin:'0 var(--space-2)'}}>/</span>
        <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)'}}>Generate</span>
      </div>

      <div style={{marginBottom:'var(--space-4)'}}>
        <ExploreStylesButton onClick={() => setShowTemplates(true)} />
      </div>

      {isGenerating && isStreaming ? (
        <div className={c.soft}>
          <button className={b.soft} onClick={cancel}>Cancel</button>
        </div>
      ) : generatedDocumentId ? (
        <div className={c.soft}>
          <p>Document generated!</p>
          <Link href={`/preview?doc=${generatedDocumentId}`} className={b.soft}>
            View Document
          </Link>
        </div>
      ) : (
        <div className={c.soft}>
          <GenerateInputBox
            value={inputValue}
            onChange={setInputValue}
            disabled={isGenerating}
          />

          <div style={{marginTop:'var(--space-4)'}}>
            <DocStructureSelector
              value={selectedStructure}
              onChange={setStructure}
            />
          </div>

          <div style={{marginTop:'var(--space-4)'}}>
            <AddImageButton
              imageCount={images.length}
              onImageAdd={addImage}
            />
          </div>

          <div style={{marginTop:'var(--space-4)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <ClearInput
              hasContent={!!inputValue}
              hasDocument={!!generatedDocumentId}
              onClear={clearInput}
            />

            <CreditEstimateDisplay
              credits={creditEstimate}
              isLoading={isGenerating}
            />
          </div>
        </div>
      )}

      {showTemplates && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setShowTemplates(false)}
          onUseTemplate={handleUseTemplate}
        />
      )}
    </div>
  );
}
