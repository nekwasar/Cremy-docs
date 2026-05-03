'use client';

import { useState } from 'react';
import { useUserStore } from '@/store/user-store';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import i from '@/styles/components/Input.module.css';

const STYLES = ['Business', 'Academic', 'Legal', 'Creative', 'Personal'];

export default function ChangeStylePage() {
  const [content, setContent] = useState('');
  const [style, setStyle] = useState('Business');
  const [isChanging, setIsChanging] = useState(false);
  const { credits, deductCredits } = useUserStore();

  const handleChange = async () => {
    if (!content.trim() || credits < 1) {
      alert('Not enough credits');
      return;
    }

    setIsChanging(true);
    deductCredits(1);

    try {
      const response = await fetch('/api/style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, style }),
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = `/preview?doc=${data.data.documentId}`;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div style={{maxWidth:'var(--container-lg)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <h1>Change Document Style</h1>

      <div className={c.soft}>
        <div className={i.group}>
          <label className={i.label}>Style</label>
          <select className={i.soft} value={style} onChange={(e) => setStyle(e.target.value)}>
            {STYLES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className={i.group}>
          <label className={i.label}>Content</label>
          <textarea
            className={`${i.soft} ${i.textarea}`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste content here..."
          />
        </div>

        <button className={b.soft} onClick={handleChange} disabled={!content.trim() || isChanging}>
          Apply Style (1 credit)
        </button>
      </div>
    </div>
  );
}
