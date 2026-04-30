'use client';

import { useState } from 'react';

interface MailcraftEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
}

export function MailcraftEditor({ initialContent, onSave }: MailcraftEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(content);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h2>Template Editor</h2>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={15}
      />
      <div>
        <button onClick={handleSave}>Save Template</button>
        {saved && <span>Saved!</span>}
      </div>
      <div>
        <h3>Personalization Tags</h3>
        <p>Use these tags in your template:</p>
        <ul>
          <li>{'{name}'} — Recipient name</li>
          <li>{'{email}'} — Recipient email</li>
          <li>{'{company}'} — Company name</li>
          <li>{'{date}'} — Current date</li>
          <li>{'{unsubscribe_link}'} — Unsubscribe URL</li>
        </ul>
      </div>
    </div>
  );
}