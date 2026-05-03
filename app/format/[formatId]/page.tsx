'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSocket } from '@/hooks/useSocket';
import { useFormatGeneration } from '@/hooks/useFormatGeneration';
import { useFormatStore } from '@/store/format-store';
import { getFormatById } from '@/config/formats';
import { FormatPreview } from '../../_components/FormatPreview';
import { FormatName } from '../../_components/FormatName';
import { FormatDescription } from '../../_components/FormatDescription';
import { FormatCreditCost } from '../../_components/FormatCreditCost';
import { UseThisFormatButton } from '../../_components/UseThisFormatButton';
import { GenerateInputBox } from '../../_components/GenerateInputBox';
import { CreditEstimateDisplay } from '../../_components/CreditEstimateDisplay';
import { ClearInput } from '../../_components/ClearInput';

export default function FormatPage() {
  const params = useParams();
  const formatId = params.formatId as string;

  const {
    inputValue,
    creditEstimate,
    isGenerating,
    generatedDocumentId,
    error,
    setInputValue,
  } = useFormatStore();

  const { socket } = useSocket();
  const { generate, cancel } = useFormatGeneration({ socket });

  const format = getFormatById(formatId);

  useEffect(() => {
    useFormatStore.getState().setFormatId(formatId);
    return () => {
      useFormatStore.getState().reset();
    };
  }, [formatId]);

  if (!format) {
    return (
      <div>
        <h1>Format Not Found</h1>
        <Link href="/format">View all formats</Link>
      </div>
    );
  }

  const handleGenerate = () => {
    if (!inputValue.trim()) return;
    generate(inputValue, formatId);
  };

  return (
    <div>
      <Link href="/format">← All Formats</Link>

      <FormatPreview
        previewUrl={format.previewUrl}
        formatName={format.name}
      />

      <FormatName name={format.name} category={format.category} />
      <FormatDescription description={format.description} />
      <FormatCreditCost creditCost={format.creditCost} />

      {isGenerating ? (
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

          <CreditEstimateDisplay
            credits={creditEstimate}
            isLoading={isGenerating}
          />

          <div>
            <ClearInput
              hasContent={!!inputValue}
              hasDocument={false}
              onClear={() => setInputValue('')}
            />
          </div>
        </div>
      )}

      <UseThisFormatButton formatId={formatId} />

      {error && (
        <div>
          <p>Error: {error}</p>
          <button onClick={() => useFormatStore.getState().setError(null)}>
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}