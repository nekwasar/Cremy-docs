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
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';

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
      <div style={{ maxWidth: 'var(--container-lg)', margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
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
    <div style={{ maxWidth: 'var(--container-lg)', margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
      <Link href="/format" style={{ display: 'inline-block', marginBottom: 'var(--space-4)' }}>
        ← All Formats
      </Link>

      <div className={c.card} style={{ padding: 0, marginBottom: 'var(--space-6)' }}>
        <FormatPreview
          previewUrl={format.previewUrl}
          formatName={format.name}
        />
      </div>

      <div style={{ marginBottom: 'var(--space-6)' }}>
        <FormatName name={format.name} category={format.category} />
        <FormatDescription description={format.description} />
        <FormatCreditCost creditCost={format.creditCost} />
      </div>

      {isGenerating ? (
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <button className={`${b.btn} ${b.raw}`} onClick={cancel}>Cancel</button>
        </div>
      ) : generatedDocumentId ? (
        <div className={c.card} style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <p>Document generated!</p>
          <Link href={`/preview?doc=${generatedDocumentId}`} className={`${b.btn} ${b.soft}`} style={{ marginTop: 'var(--space-3)' }}>
            View Document
          </Link>
        </div>
      ) : (
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <GenerateInputBox
            value={inputValue}
            onChange={setInputValue}
            disabled={isGenerating}
          />

          <CreditEstimateDisplay
            credits={creditEstimate}
            isLoading={isGenerating}
          />

          <div style={{ marginTop: 'var(--space-3)' }}>
            <ClearInput
              hasContent={!!inputValue}
              hasDocument={false}
              onClear={() => setInputValue('')}
            />
          </div>
        </div>
      )}

      <div style={{ marginBottom: 'var(--space-6)' }}>
        <UseThisFormatButton formatId={formatId} />
      </div>

      {error && (
        <div className={c.card} style={{ padding: 'var(--space-4)', border: '1px solid var(--color-error)' }}>
          <p>Error: {error}</p>
          <button className={`${b.btn} ${b.raw} ${b.sm}`} onClick={() => useFormatStore.getState().setError(null)} style={{ marginTop: 'var(--space-2)' }}>
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
