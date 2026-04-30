'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LandingInputBox() {
  const [text, setText] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    if (text.trim()) {
      router.push(`/generate?prompt=${encodeURIComponent(text)}`);
    }
  };

  return (
    <div>
      <h2>Create Your Document</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe what document you want to create..."
        rows={4}
        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
      />
      <button onClick={handleSubmit} disabled={!text.trim()}>
        Create Document
      </button>
    </div>
  );
}