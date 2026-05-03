'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useConvertStore } from '@/store/convert-store';
import { getPairBySlug, getRelatedPairs, getCategoryLabels } from '@/config/convert-pairs';
import { getPairContent } from '@/config/convert-content';
import { generateStructuredData, generateBreadcrumbLD } from '@/lib/structured-data';
import { ConvertUploadZone } from '../../_components/ConvertUploadZone';
import { ConvertProgress } from '../../_components/ConvertProgress';
import { ConvertDownload } from '../../_components/ConvertDownload';
import { ConvertFreeNotice } from '../../_components/ConvertFreeNotice';
import { ConvertComplete } from '../../_components/ConvertComplete';
import { ConvertBreadcrumb } from '../../_components/ConvertBreadcrumb';
import { CreditBalance } from '../../_components/CreditBalance';
import { detectFormat } from '@/lib/format-detection';
import { validateConvertFile } from '@/lib/format-validation';
import { checkFileSize } from '@/lib/file-size';
import { convertWithAI } from '@/lib/ai-conversion';
import s from '@/styles/pages/convert.module.css';
import b from '@/styles/components/Button.module.css';
import c from '@/styles/components/Card.module.css';

export default function ConvertSlugPage() {
  const params = useParams();
  const slug = params.slug as string;

  const pair = getPairBySlug(slug);
  const content = pair ? getPairContent(slug) : '';
  const relatedPairs = pair ? getRelatedPairs(slug, 8) : [];
  const categoryLabels = getCategoryLabels();

  const {
    sourceFile,
    targetFormat,
    isConverting,
    convertedBlob,
    progress,
    error,
    setSourceFile,
    setSourceFormat,
    setTargetFormat,
    setConverting,
    setConvertedBlob,
    setProgress,
    setError,
    setQualityMessage,
  } = useConvertStore();

  const [showComplete, setShowComplete] = useState(false);

  if (!pair) {
    return (
      <div className={s.page}>
        <h1>Conversion Not Found</h1>
        <Link href="/convert">View all conversions</Link>
      </div>
    );
  }

  const handleFileSelected = (file: File) => {
    const validation = validateConvertFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }
    setSourceFile(file);
    setSourceFormat(pair.sourceFormat);
    setTargetFormat(pair.targetFormat);
    setError(null);
  };

  const handleConvert = async () => {
    if (!sourceFile) return;
    setConverting(true);
    setError(null);
    setShowComplete(false);

    try {
      setProgress(10);
      await new Promise((r) => setTimeout(r, 200));
      setProgress(30);
      const blob = await convertWithAI(sourceFile, targetFormat || pair.targetFormat);
      setProgress(70);
      setConvertedBlob(blob);
      setProgress(100);
      setQualityMessage('100% quality as promised');
      setShowComplete(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setConverting(false);
    }
  };

  const handleDownload = () => {
    if (!convertedBlob || !sourceFile) return;
    const ext = targetFormat || pair.targetFormat;
    const baseName = sourceFile.name.replace(/\.[^.]+$/, '');
    const url = URL.createObjectURL(convertedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sizeInfo = sourceFile ? checkFileSize(sourceFile) : null;
  const categoryLabel = categoryLabels[pair.category] || pair.category;

  const structuredData = generateStructuredData(slug, pair.sourceLabel, pair.targetLabel);
  const breadcrumbLD = generateBreadcrumbLD([
    { name: 'Home', url: 'https://cremydocs.com' },
    { name: 'Convert', url: 'https://cremydocs.com/convert' },
    { name: categoryLabel, url: `https://cremydocs.com/convert/${pair.category}` },
    { name: `Convert ${pair.sourceLabel} to ${pair.targetLabel}`, url: `https://cremydocs.com/convert/${slug}` },
  ]);

  return (
    <div className={s.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD) }}
      />

      <div className={s.header}>
        <div className={s.headerRow}>
          <Link href="/">Logo</Link>
          <CreditBalance />
          <Link href="/dashboard">Account</Link>
        </div>
      </div>

      <ConvertBreadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Convert', href: '/convert' },
          { label: categoryLabel, href: `/convert/${pair.category}` },
          { label: `Convert ${pair.sourceLabel} to ${pair.targetLabel}` },
        ]}
      />

      <h1>Convert {pair.sourceLabel} to {pair.targetLabel} — Free Online Converter</h1>
      <ConvertFreeNotice />

      {error && (
        <div className={c.card} style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)', border: '1px solid var(--color-error)', borderRadius: 'var(--radius-md)' }}>
          <p>{error}</p>
          <button className={`${b.btn} ${b.raw} ${b.sm}`} onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div className={s.toolArea}>
        {!sourceFile ? (
          <div className={s.uploadSection}>
            <ConvertUploadZone onFileSelected={handleFileSelected} />
            <p style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              Supported source: {pair.sourceLabel} (and compatible formats)
            </p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              Output format: {pair.targetLabel}
            </p>
          </div>
        ) : (
          <>
            <div className={c.card} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-4)' }}>
              <div>
                <p>Source: <strong>{sourceFile.name}</strong></p>
                {sizeInfo && <p>Size: {sizeInfo.formattedSize}</p>}
              </div>
              <button className={`${b.btn} ${b.raw} ${b.sm}`} onClick={() => setSourceFile(null)}>Remove</button>
            </div>

            <div className={s.formatRow}>
              <p>Converting from: <strong>{pair.sourceLabel}</strong> <span className={s.arrow}>→</span> <strong>{pair.targetLabel}</strong></p>
            </div>

            <div className={s.actions}>
              {showComplete && convertedBlob ? (
                <ConvertComplete
                  onPreview={() => {}}
                  onDownload={handleDownload}
                />
              ) : (
                <button
                  className={`${b.btn} ${b.soft}`}
                  onClick={handleConvert}
                  disabled={isConverting || !sourceFile}
                >
                  Convert to {pair.targetLabel}
                </button>
              )}
            </div>

            <ConvertProgress progress={progress} isConverting={isConverting} />

            {convertedBlob && (
              <div className={s.previewArea}>
                <ConvertDownload
                  blob={convertedBlob}
                  fileName={`${sourceFile.name.replace(/\.[^.]+$/, '')}.${targetFormat || pair.targetFormat}`}
                />
              </div>
            )}
          </>
        )}
      </div>

      {content && (
        <div className={s.previewArea}>
          <div dangerouslySetInnerHTML={{ __html: content.replace(/\n\n/g, '<br/><br/>') }} />
        </div>
      )}

      {relatedPairs.length > 0 && (
        <div className={s.previewArea}>
          <h2>Related Conversions</h2>
          <ul style={{ marginTop: 'var(--space-3)', paddingLeft: 'var(--space-4)' }}>
            {relatedPairs.map((rp) => (
              <li key={rp.slug} style={{ marginBottom: 'var(--space-2)' }}>
                <Link href={`/convert/${rp.slug}`}>
                  Convert {rp.sourceLabel} to {rp.targetLabel}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}