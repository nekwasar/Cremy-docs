'use client';

import { getVersions } from '@/lib/versions';
import { useState, useEffect } from 'react';

interface VersionHistoryProps {
  documentId: string;
  userId: string;
  onRestore: (versionId: string) => void;
}

export function VersionHistory({ documentId, userId, onRestore }: VersionHistoryProps) {
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (documentId) loadVersions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  const loadVersions = async () => {
    setLoading(true);
    const data = await getVersions(documentId, userId);
    setVersions(data);
    setLoading(false);
  };

  if (loading) return null;

  return (
    <div>
      <h3>Version History</h3>
      {versions.length === 0 ? (
        <p>No previous versions</p>
      ) : (
        <ul>
          {versions.map((version, index) => (
            <li key={version._id || index}>
              <span>Version {versions.length - index}</span>
              <span>{new Date(version.createdAt).toLocaleString()}</span>
              {version.wordCount && <span>{version.wordCount} words</span>}
              <button onClick={() => onRestore(version._id.toString())}>Restore</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}