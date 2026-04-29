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

  if (loading) return <div>Loading...</div>;
  if (!document) return <div>No document found</div>;

  return (
    <div>
      <div>
        <a href="/dashboard">← Back</a>
        <input
          type="text"
          defaultValue={document.title}
         
          disabled={!isEditing}
        />
        <div>
          <button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Save' : 'Edit'}
          </button>
          <button>Undo</button>
          <button>Redo</button>
          <button>Download ▾</button>
        </div>
      </div>

      <div>
        <div>
          {document.content}
        </div>
      </div>

      <div>
        <button>Start New Project</button>
      </div>
    </div>
  );
}