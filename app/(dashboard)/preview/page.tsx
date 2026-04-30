'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDocumentStore } from '@/store/document-store';
import { DocumentToolbar } from '../../_components/DocumentToolbar';
import { DownloadButton } from '../../_components/DownloadButton';
import { SaveBanner } from '../../_components/SaveBanner';

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const docId = searchParams.get('doc');
  const { document, loading, fetchDocument } = useDocumentStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveBanner, setShowSaveBanner] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  useEffect(() => {
    if (docId) {
      fetchDocument(docId);
    }
  }, [docId, fetchDocument]);

  const handleDownload = () => {
    setHasDownloaded(true);
    setShowSaveBanner(true);
  };

  if (loading) return <div>Loading...</div>;
  if (!document) return <div>No document found</div>;

  return (
    <div>
      <DocumentToolbar
        documentTitle={document.title}
        onUndo={() => {}}
        onRedo={() => {}}
        onBack={() => window.history.back()}
        onDownload={() => handleDownload()}
        canUndo={false}
        canRedo={false}
      />

      <div>
        {isEditing ? (
          <textarea defaultValue={document.content} />
        ) : (
          <div>{document.content}</div>
        )}
      </div>

      <div>
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Save' : 'Edit'}
        </button>
        <DownloadButton documentId={document.id} />
        <Link href="/generate">
          <button>Start New Project</button>
        </Link>
      </div>

      {showSaveBanner && (
        <SaveBanner
          onEnableStorage={() => {
            window.location.href = '/settings';
          }}
          onDismiss={() => setShowSaveBanner(false)}
        />
      )}
    </div>
  );
}