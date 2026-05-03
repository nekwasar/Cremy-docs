'use client';

import { useState } from 'react';

interface MailcraftAssistantProps {
  onGenerate: (content: string) => void;
}

export function MailcraftAssistant({ onGenerate }: MailcraftAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `Generate an HTML email template with the following requirements: ${prompt}. Include personalization tags like {name}, {email}, {company}. Return only the HTML.`,
          formatId: 'html',
        }),
      });

      const data = await res.json();
      if (data.success) {
        onGenerate(data.data.document?.content || '');
      }
    } catch {}

    setLoading(false);
  };

  return (
    <div>
      <h2>AI Email Generator</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the email you want to create... e.g. 'Welcome email for new users with a 20% discount offer'"
        rows={4}
      />
      <button onClick={handleGenerate} disabled={loading || !prompt.trim()}>
        Generate Email Template
      </button>
    </div>
  );
}