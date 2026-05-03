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
    <div>
      <div>
        <Link href="/">Logo</Link>
        <CreditBalance />
        <Link href="/dashboard">Account</Link>
      </div>

      <div>
        <Link href="/">Home</Link>
        <span> / </span>
        <span>Generate</span>
      </div>

      <div>
        <ExploreStylesButton onClick={() => setShowTemplates(true)} />
      </div>

      {isGenerating && isStreaming ? (
        <div>
          <button onClick={cancel}>Cancel</button>
        </div>
      ) : generatedDocumentId ? (
        <div>
          <p>Document generated!</p>
          <Link href={`/preview?doc=${generatedDocumentId}`}>
            View Document
          </Link>
        </div>
      ) : (
        <div>
          <GenerateInputBox
            value={inputValue}
            onChange={setInputValue}
            disabled={isGenerating}
          />

          <DocStructureSelector
            value={selectedStructure}
            onChange={setStructure}
          />

          <AddImageButton
            imageCount={images.length}
            onImageAdd={addImage}
          />

          <div>
            <ClearInput
              hasContent={!!inputValue}
              hasDocument={!!generatedDocumentId}
              onClear={clearInput}
            />
          </div>

          <CreditEstimateDisplay
            credits={creditEstimate}
            isLoading={isGenerating}
          />
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