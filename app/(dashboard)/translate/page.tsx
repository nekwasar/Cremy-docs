'use client';

import { useState } from 'react';
import { useUserStore } from '@/store/user-store';
import { getSupportedLanguages } from '@/lib/multi-language';
import { estimateTranslationCost } from '@/lib/translation-cost';
import { TranslatePreview } from '../../_components/TranslatePreview';
import { CreditBalance } from '../../_components/CreditBalance';

export default function TranslatePage() {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { credits } = useUserStore();

  const languages = getSupportedLanguages();
  const creditEstimate = estimateTranslationCost(input);

  const handleTranslate = async () => {
    if (!input.trim()) return;
    if (creditEstimate.creditCost > credits) {
      alert('Not enough credits');
      return;
    }

    setIsTranslating(true);
    setShowPreview(false);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: input,
          targetLang,
          sourceLang,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOutput(data.data.translatedText);
        setDocumentId(data.data.documentId || null);
        setShowPreview(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translated.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h1>Translate</h1>
      <CreditBalance />

      <div>
        <div>
          <label>From</label>
          <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>

        <button onClick={() => {
          const temp = sourceLang;
          setSourceLang(targetLang);
          setTargetLang(temp);
        }} type="button">Swap</button>

        <div>
          <label>To</label>
          <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>
      </div>

      {showPreview && output ? (
        <TranslatePreview
          beforeContent={input}
          afterContent={output}
          sourceLang={languages.find((l) => l.code === sourceLang)?.name}
          targetLang={languages.find((l) => l.code === targetLang)?.name}
          documentId={documentId || undefined}
          onDownload={handleDownload}
        />
      ) : (
        <div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to translate..."
            rows={6}
          />
          <textarea
            value={output}
            readOnly
            placeholder="Translation will appear here..."
            rows={6}
          />
        </div>
      )}

      <div>
        <p>Estimated: ~{creditEstimate.creditCost} credits ({creditEstimate.wordCount} words)</p>
        <button onClick={() => navigator.clipboard.writeText(output)} disabled={!output}>
          Copy
        </button>
        <button onClick={handleTranslate} disabled={!input.trim() || isTranslating}>
          {isTranslating ? 'Translating...' : 'Translate'}
        </button>
      </div>
    </div>
  );
}