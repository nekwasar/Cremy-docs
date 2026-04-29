'use client';

import { useState } from 'react';
import { useUserStore } from '@/store/user-store';

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
  'Russian', 'Japanese', 'Chinese', 'Korean', 'Arabic', 'Hindi'
];

export default function TranslatePage() {
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Spanish');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const { credits, deductCredits } = useUserStore();

  const handleTranslate = async () => {
    if (!input.trim()) return;
    if (credits < 2) {
      alert('Not enough credits');
      return;
    }

    setIsTranslating(true);
    deductCredits(2);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, sourceLang, targetLang }),
      });

      const data = await response.json();

      if (data.success) {
        setOutput(data.data.translatedText);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div>
      <h1>Translate</h1>

      <div>
        <div>
          <label>From</label>
          <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <button onClick={() => {
          const temp = sourceLang;
          setSourceLang(targetLang);
          setTargetLang(temp);
        }}>Swap</button>

        <div>
          <label>To</label>
          <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to translate..."
         
        />

        <textarea
          value={output}
          readOnly
          placeholder="Translation will appear here..."
         
        />
      </div>

      <div>
        <button onClick={() => navigator.clipboard.writeText(output)} disabled={!output}>
          Copy
        </button>
        <button onClick={handleTranslate} disabled={!input.trim() || isTranslating}>
          {isTranslating ? 'Translating...' : 'Translate (2 credits)'}
        </button>
      </div>
    </div>
  );
}