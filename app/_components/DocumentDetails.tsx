'use client';

interface DocumentDetailsProps {
  document: {
    id: string;
    title: string;
    content: string;
    format: string;
    wordCount: number;
    createdAt: string;
    updatedAt: string;
  };
  onClose: () => void;
}

export function DocumentDetails({ document, onClose }: DocumentDetailsProps) {
  return (
    <div>
      <button onClick={onClose}>Close</button>
      <h2>{document.title || 'Untitled'}</h2>
      <div>
        <p>Format: {document.format}</p>
        <p>Words: {document.wordCount}</p>
        <p>Created: {new Date(document.createdAt).toLocaleString()}</p>
        <p>Updated: {new Date(document.updatedAt).toLocaleString()}</p>
      </div>
      <div>
        <h3>Preview</h3>
        <pre>{document.content?.slice(0, 500)}{(document.content?.length || 0) > 500 ? '...' : ''}</pre>
      </div>
    </div>
  );
}