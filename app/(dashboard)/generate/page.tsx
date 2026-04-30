'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGenerateStore } from '@/store/generate-store';
import { useSocket } from '@/hooks/useSocket';
import { useGeneration } from '@/hooks/useGeneration';
import { GenerateInputBox } from '@/app/_components/GenerateInputBox';
import { CreditEstimateDisplay } from '@/app/_components/CreditEstimateDisplay';
import { DocStructureSelector } from '@/app/_components/DocStructureSelector';
import { ExploreStylesButton } from '@/app/_components/ExploreStylesButton';
import { AddImageButton } from '@/app/_components/AddImageButton';
import { ClearInput } from '@/app/_components/ClearInput';
import { GenerateButton } from '@/app/_components/GenerateButton';
import { DocumentSkeleton } from '@/app/_components/DocumentSkeleton';
import { TemplatePreviewModal } from '@/app/_components/TemplatePreviewModal';
import { CreditBalance } from '@/app/_components/CreditBalance';

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
          <DocumentSkeleton
            title={streamedContent ? 'Generating...' : undefined}
            sections={[]}
            progress={streamedContent ? 50 : 10}
          />
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
            <GenerateButton
              onClick={handleGenerate}
              state={
                isGenerating
                  ? 'loading'
                  : !inputValue.trim()
                  ? 'disabled'
                  : 'idle'
              }
              creditEstimate={creditEstimate}
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