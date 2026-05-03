'use client';

import { useState } from 'react';
import { useUserStore } from '@/store/user-store';
import { getSupportedLanguages } from '@/lib/multi-language';
import { estimateTranslationCost } from '@/lib/translation-cost';
import { TranslatePreview } from '../../_components/TranslatePreview';
import { CreditBalance } from '../../_components/CreditBalance';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import i from '@/styles/components/Input.module.css';

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
    <div style={{maxWidth:'var(--container-lg)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'var(--space-4)'}}>
        <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)'}}>Tools / Translate</span>
        <CreditBalance />
      </div>
      <h1>Translate</h1>

      <div className={c.soft}>
        <div style={{display:'flex',alignItems:'flex-end',gap:'var(--space-4)',marginBottom:'var(--space-4)'}}>
          <div style={{flex:1}}>
            <label className={i.label}>From</label>
            <select
              className={i.soft}
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>

          <button
            className={b.minimal}
            onClick={() => {
              const temp = sourceLang;
              setSourceLang(targetLang);
              setTargetLang(temp);
            }}
            type="button"
          >
            Swap
          </button>

          <div style={{flex:1}}>
            <label className={i.label}>To</label>
            <select
              className={i.soft}
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
            >
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
            <div className={i.group}>
              <textarea
                className={`${i.soft} ${i.textarea}`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to translate..."
                rows={6}
              />
            </div>
            <div className={i.group}>
              <textarea
                className={`${i.soft} ${i.textarea}`}
                value={output}
                readOnly
                placeholder="Translation will appear here..."
                rows={6}
              />
            </div>
          </div>
        )}

        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'var(--space-4)'}}>
          <p style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)',margin:0}}>
            Estimated: ~{creditEstimate.creditCost} credits ({creditEstimate.wordCount} words)
          </p>
          <div style={{display:'flex',gap:'var(--space-3)'}}>
            <button
              className={b.minimal}
              onClick={() => navigator.clipboard.writeText(output)}
              disabled={!output}
            >
              Copy
            </button>
            <button
              className={b.soft}
              onClick={handleTranslate}
              disabled={!input.trim() || isTranslating}
            >
              {isTranslating ? null : 'Translate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
