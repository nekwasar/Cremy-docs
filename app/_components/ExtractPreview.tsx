'use client';

import { useState } from 'react';

interface ExtractPreviewProps {
  extractedText: string;
  hasError: boolean;
  onCopy: () => void;
  onTryAgain: (corrections: string) => void;
}

export function ExtractPreview({
  extractedText,
  hasError,
  onCopy,
  onTryAgain,
}: ExtractPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [showCorrectionInput, setShowCorrectionInput] = useState(false);
  const [corrections, setCorrections] = useState('');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      onCopy();
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleTryAgain = () => {
    if (!showCorrectionInput) {
      setShowCorrectionInput(true);
      return;
    }
    if (corrections.trim()) {
      onTryAgain(corrections.trim());
      setCorrections('');
      setShowCorrectionInput(false);
    }
  };

  return (
    <div>
      <div>
        <h3>Extracted Text</h3>
        {hasError && (
          <p>Some text may not have been recognized correctly. Use Try Again to improve results.</p>
        )}
        <pre>{extractedText || 'No text extracted'}</pre>
      </div>

      <div>
        <button onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button onClick={handleTryAgain}>
          {showCorrectionInput ? 'Submit Corrections' : 'Try Again'}
        </button>
      </div>

      {showCorrectionInput && (
        <div>
          <p>What needs to be corrected? Describe the mistakes or text that was missed:</p>
          <textarea
            value={corrections}
            onChange={(e) => setCorrections(e.target.value)}
            placeholder="e.g. The word 'receipt' should be 'recipe', and '2023' should be '2024'..."
            rows={3}
          />
        </div>
      )}
    </div>
  );
}