'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDocumentStore } from '@/store/document-store';

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const docId = searchParams.get('doc');
  const { document, loading, fetchDocument } = useDocumentStore();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (docId) {
      fetchDocument(docId);
    }
  }, [docId]);

  if (loading) return <div className="preview-loading">Loading...</div>;
  if (!document) return <div className="preview-empty">No document found</div>;

  return (
    <div className="preview-page">
      <div className="preview-header">
        <a href="/dashboard" className="btn-back">← Back</a>
        <input
          type="text"
          defaultValue={document.title}
          className="doc-title"
          disabled={!isEditing}
        />
        <div className="preview-toolbar">
          <button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Save' : 'Edit'}
          </button>
          <button>Undo</button>
          <button>Redo</button>
          <button className="btn-download">Download ▾</button>
        </div>
      </div>

      <div className="preview-content">
        <div className="document-preview">
          {document.content}
        </div>
      </div>

      <div className="preview-actions">
        <button className="btn-new">Start New Project</button>
      </div>
    </div>
  );
}