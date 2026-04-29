'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/user-store';

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { credits, deductCredits, user } = useUserStore();

  const estimateCredits = (text: string) => {
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 100));
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (estimateCredits(prompt) > credits) {
      alert('Not enough credits');
      return;
    }

    setIsGenerating(true);
    try {
      deductCredits(estimateCredits(prompt));

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = `/preview?doc=${data.data.documentId}`;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const creditEstimate = estimateCredits(prompt);

  return (
    <div className="generate-page">
      <div className="generate-header">
        <h1>Generate Document</h1>
        <div className="credit-display">
          <span>💰</span>
          <span>{credits} credits</span>
        </div>
      </div>

      <div className="generate-content">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the document you want to generate..."
          className="generate-input"
        />

        <div className="generate-actions">
          <div className="credit-estimate">
            Estimated: ~{creditEstimate} credits
          </div>
          <button
            onClick={() => setPrompt('')}
            className="btn-clear"
            disabled={!prompt}
          >
            Clear
          </button>
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="btn-generate"
          >
            {isGenerating ? 'Generating...' : 'Generate Document'}
          </button>
        </div>
      </div>

      <div className="generate-templates">
        <button className="btn-templates">Explore Styles</button>
      </div>
    </div>
  );
}