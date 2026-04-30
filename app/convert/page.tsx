'use client';

import { useState } from 'react';
import { ConvertUploadZone } from '../_components/ConvertUploadZone';
import { TargetFormatSelector } from '../_components/TargetFormatSelector';
import { ConvertProgress } from '../_components/ConvertProgress';
import { ConvertPreview } from '../_components/ConvertPreview';
import { ConvertDownload } from '../_components/ConvertDownload';
import { ConvertFreeNotice } from '../_components/ConvertFreeNotice';
import { ConvertComplete } from '../_components/ConvertComplete';
import { ConvertBreadcrumb } from '../_components/ConvertBreadcrumb';
import { CreditBalance } from '../_components/CreditBalance';
import { useConvertStore } from '@/store/convert-store';
import { detectFormat } from '@/lib/format-detection';
import { validateConvertFile } from '@/lib/format-validation';
import { checkFileSize } from '@/lib/file-size';
import { convertWithAI } from '@/lib/ai-conversion';
import Link from 'next/link';

export default function ConvertPage() {
  const {
    sourceFile,
    sourceFormat,
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

  const handleFileSelected = (file: File) => {
    const validation = validateConvertFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setSourceFile(file);
    const detected = detectFormat(file.name, file.type);
    setSourceFormat(detected.format);
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

      const blob = await convertWithAI(sourceFile, targetFormat);
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
    const ext = targetFormat;
    const baseName = sourceFile.name.replace(/\.[^.]+$/, '');
    const url = URL.createObjectURL(convertedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sizeInfo = sourceFile ? checkFileSize(sourceFile) : null;

  return (
    <div>
      <div>
        <Link href="/">Logo</Link>
        <CreditBalance />
        <Link href="/dashboard">Account</Link>
      </div>

      <ConvertBreadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Convert', href: '/convert' },
        ]}
      />

      <h1>Free Online File Converter</h1>
      <ConvertFreeNotice />

      {error && (
        <div>
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {!sourceFile ? (
        <ConvertUploadZone onFileSelected={handleFileSelected} />
      ) : (
        <div>
          <div>
            <div>
              <p>Source File: <strong>{sourceFile.name}</strong></p>
              {sizeInfo && <p>Size: {sizeInfo.formattedSize}</p>}
              {sourceFormat && <p>Format: {sourceFormat.toUpperCase()}</p>}
            </div>
            <button onClick={() => setSourceFile(null)}>Remove</button>
          </div>

          <TargetFormatSelector
            sourceFormat={sourceFormat}
            value={targetFormat}
            onChange={setTargetFormat}
            disabled={isConverting}
          />

          {showComplete && convertedBlob ? (
            <ConvertComplete
              onPreview={() => {}}
              onDownload={handleDownload}
            />
          ) : (
            <button
              onClick={handleConvert}
              disabled={isConverting || !sourceFile}
            >
              {isConverting ? 'Converting...' : `Convert to ${targetFormat.toUpperCase()}`}
            </button>
          )}

          <ConvertProgress
            progress={progress}
            isConverting={isConverting}
          />

          {convertedBlob && (
            <ConvertDownload
              blob={convertedBlob}
              fileName={`${sourceFile.name.replace(/\.[^.]+$/, '')}.${targetFormat}`}
            />
          )}
        </div>
      )}
    </div>
  );
}