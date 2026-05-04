'use client';

import { useState } from 'react';
import { Select } from './Select';
import { useDashboardStore } from '@/store/dashboard-store';
import { createFolder, deleteFolder, moveToFolder } from '@/lib/folder-manage';

export function FolderManager() {
  const { folders, documents, addFolder, removeFolder, moveDocument } = useDashboardStore();
  const [newFolderName, setNewFolderName] = useState('');
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    const folder = await createFolder('user-id', newFolderName.trim());
    if (folder) { addFolder(folder); setNewFolderName(''); }
  };
  const handleDeleteFolder = async (folderId: string) => { await deleteFolder(folderId, 'user-id'); removeFolder(folderId); };
  const handleMoveToFolder = async (docId: string, folderId: string | null) => { await moveToFolder(docId, folderId, 'user-id'); moveDocument(docId, folderId); };
  const docsInFolder = (folderId: string) => documents.filter(d => d.folderId === folderId);
  const uncategorizedDocs = documents.filter(d => !d.folderId);

  const folderOpts = folders.map(f => ({ value: f.id, label: f.name }));

  return (
    <div>
      <h3>Folders</h3>
      <div style={{display:'flex',gap:'var(--space-2)',marginBottom:'var(--space-3)'}}>
        <input type="text" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} placeholder="New folder name" />
        <button onClick={handleCreateFolder}>Create</button>
      </div>
      <ul>
        <li>
          <span onClick={() => setExpandedFolder('uncategorized')}>Uncategorized ({uncategorizedDocs.length})</span>
          {expandedFolder === 'uncategorized' && uncategorizedDocs.map(doc => (
            <li key={doc.id}>{doc.title} <Select options={folderOpts} value={doc.folderId || ''} onChange={v => handleMoveToFolder(doc.id, v || null)} placeholder="No Folder" /></li>
          ))}
        </li>
        {folders.map(folder => (
          <li key={folder.id}>
            <span onClick={() => setExpandedFolder(folder.id)}>{folder.name} ({folder.documentCount})</span>
            <button onClick={() => handleDeleteFolder(folder.id)}>Delete</button>
            {expandedFolder === folder.id && docsInFolder(folder.id).map(doc => (
              <li key={doc.id}>{doc.title} <Select options={folderOpts} value={doc.folderId || ''} onChange={v => handleMoveToFolder(doc.id, v || null)} placeholder="No Folder" /></li>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}
