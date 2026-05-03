'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUserStore } from '@/store/user-store';
import { useDashboardStore } from '@/store/dashboard-store';
import { getUserDocuments, deleteDocumentPermanently, bulkDeleteDocuments, getDocumentCounts } from '@/lib/document-manage';
import { getUserFolders } from '@/lib/folder-manage';
import { getActivityLog, isLoggingEnabled, setLoggingEnabled, logActivity } from '@/lib/activity-log';
import { FreeDashboard } from '../../_components/FreeDashboard';
import { DocumentFilterBar } from '../../_components/DocumentFilterBar';
import { FolderManager } from '../../_components/FolderManager';
import { VersionHistory } from '../../_components/VersionHistory';
import { AnalyticsWidget } from '../../_components/AnalyticsWidget';
import { ActivityTimeline } from '../../_components/ActivityTimeline';
import { TemplateFavorites } from '../../_components/TemplateFavorites';
import { AutoSaveIndicator } from '../../_components/AutoSaveIndicator';
import { BulkActions } from '../../_components/BulkActions';
import { CreditBalance } from '../../_components/CreditBalance';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import i from '@/styles/components/Input.module.css';

export default function DashboardPage() {
  const { user, credits } = useUserStore();
  const {
    documents,
    folders,
    selectedDocument,
    selectedFolder,
    isLoading,
    searchQuery,
    sortBy,
    filterFormat,
    activityLoggingEnabled,
    analyticsData,
    setDocuments,
    setFolders,
    setSelectedDocument,
    setSelectedFolder,
    setLoading,
    setSearchQuery,
    setSortBy,
    setFilterFormat,
    setActivityLogging,
    setAnalyticsData,
    removeDocument,
  } = useDashboardStore();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const isPro = user?.role === 'pro';

  useEffect(() => {
    if (!user) return;
    loadDashboard();
    logActivity('dashboard_view', 'Visited dashboard');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadDashboard = async () => {
    setLoading(true);
    const userId = user?.id || '';

    const { documents: docs } = await getUserDocuments(userId, {
      sort: sortBy,
      format: filterFormat || undefined,
      search: searchQuery || undefined,
      folderId: selectedFolder !== null ? selectedFolder : undefined,
    });

    setDocuments(docs);

    if (isPro) {
      const proFolders = await getUserFolders(userId);
      setFolders(proFolders);

      const counts = await getDocumentCounts(userId);
      setAnalyticsData({
        documentsThisMonth: counts.thisMonth,
        creditsUsedThisMonth: 0,
        mostUsedFormats: Object.entries(counts.byFormat).map(([format, count]) => ({
          format,
          count,
        })),
      });
    }

    const activityLog = getActivityLog();
    setAnalyticsData({ activityTimeline: activityLog });

    setLoading(false);
  };

  useEffect(() => {
    if (user) loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, sortBy, filterFormat, selectedFolder]);

  const handleDelete = async (docId: string) => {
    if (isPro) {
      await deleteDocumentPermanently(docId, user?.id || '');
    }
    removeDocument(docId);
    logActivity('document_delete', `Deleted document`);
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (isPro) await bulkDeleteDocuments(ids, user?.id || '');
    ids.forEach((id) => removeDocument(id));
    setSelectedIds(new Set());
    logActivity('bulk_delete', `Deleted ${ids.length} documents`);
  };

  const handleExportAll = async () => {
    for (const doc of documents) {
      const res = await fetch(`/api/documents/${doc.id}/download?format=txt`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${doc.title || 'document'}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
    logActivity('export_all', `Exported ${documents.length} documents`);
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  if (isLoading) return null;

  if (!isPro) {
    return (
      <div style={{maxWidth:'var(--container-lg)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
        <div>
          <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)'}}>Home</span>
          <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)',margin:'0 var(--space-2)'}}>/</span>
          <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)'}}>Dashboard</span>
        </div>
        <h1>Dashboard</h1>

        <div className={c.soft} style={{marginBottom:'var(--space-4)'}}>
          <CreditBalance />
        </div>

        <FreeDashboard
          credits={credits}
          activityLog={analyticsData.activityTimeline}
        />

        <div className={c.soft}>
          <h2 className={c.header}>Recent Documents</h2>
          {documents.length === 0 ? (
            <p>No documents yet. <Link href="/generate">Create one</Link></p>
          ) : (
            <ul>
              {documents.map((doc: any) => (
                <li key={doc._id || doc.id}>
                  <Link href={`/preview?doc=${doc._id || doc.id}`}>
                    {doc.title || 'Untitled'}
                  </Link>
                  <span style={{marginLeft:'var(--space-4)',color:'var(--color-text-muted)',fontSize:'var(--text-sm)'}}>
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{maxWidth:'var(--container-lg)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <div>
        <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)'}}>Home</span>
        <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)',margin:'0 var(--space-2)'}}>/</span>
        <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)'}}>Dashboard</span>
      </div>
      <h1>Pro Dashboard</h1>

      <div className={c.soft} style={{marginBottom:'var(--space-4)'}}>
        <CreditBalance />
      </div>

      <div className={c.soft} style={{marginBottom:'var(--space-4)'}}>
        <AutoSaveIndicator
          enabled={true}
          storageType="mongodb"
        />
      </div>

      <div className={c.soft} style={{marginBottom:'var(--space-4)'}}>
        <label className={i.label}>
          <input
            type="checkbox"
            checked={activityLoggingEnabled}
            onChange={(e) => setActivityLogging(e.target.checked)}
          />
          {' '}Enable Activity Logging
        </label>
      </div>

      <div style={{marginBottom:'var(--space-4)'}}>
        <AnalyticsWidget
          documentsThisMonth={analyticsData.documentsThisMonth}
          creditsUsedThisMonth={analyticsData.creditsUsedThisMonth}
          mostUsedFormats={analyticsData.mostUsedFormats}
        />
      </div>

      <div className={c.soft} style={{marginBottom:'var(--space-4)'}}>
        <ActivityTimeline timeline={analyticsData.activityTimeline} />
      </div>

      <div className={c.soft} style={{marginBottom:'var(--space-4)'}}>
        <FolderManager />
      </div>

      <div className={c.soft} style={{marginBottom:'var(--space-4)'}}>
        <BulkActions
          selectedIds={Array.from(selectedIds)}
          onDeleteSelected={handleBulkDelete}
          onExportAll={handleExportAll}
          onSelectAll={() => setSelectedIds(new Set(documents.map((d: any) => d._id || d.id)))}
          onDeselectAll={() => setSelectedIds(new Set())}
          totalDocuments={documents.length}
        />
      </div>

      <div className={c.soft} style={{marginBottom:'var(--space-4)'}}>
        <DocumentFilterBar
          onSearch={setSearchQuery}
          onSort={setSortBy}
          onFilter={setFilterFormat}
        />
      </div>

      <div className={c.soft} style={{marginBottom:'var(--space-4)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'var(--space-4)'}}>
          <h2 className={c.header}>Documents ({documents.length})</h2>
          <Link href="/generate" className={b.editorial}>Create New</Link>
        </div>

        {documents.length === 0 ? (
          <p>No documents found.</p>
        ) : (
          <ul style={{listStyle:'none',padding:0,margin:0}}>
            {documents.map((doc: any) => (
              <li key={doc._id || doc.id} style={{padding:'var(--space-3) 0',borderBottom:'1px solid var(--color-border)'}}>
                <div style={{display:'flex',alignItems:'center',gap:'var(--space-3)'}}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(doc._id || doc.id)}
                    onChange={() => toggleSelect(doc._id || doc.id)}
                  />
                  <Link href={`/preview?doc=${doc._id || doc.id}`}>
                    <strong>{doc.title || 'Untitled'}</strong>
                  </Link>
                  <span style={{color:'var(--color-text-muted)',fontSize:'var(--text-sm)'}}>
                    {doc.format || 'txt'}
                  </span>
                  <span style={{color:'var(--color-text-muted)',fontSize:'var(--text-sm)'}}>
                    {doc.wordCount || 0} words
                  </span>
                  <span style={{color:'var(--color-text-muted)',fontSize:'var(--text-sm)'}}>
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </span>
                  <div style={{marginLeft:'auto',display:'flex',gap:'var(--space-2)'}}>
                    <button className={b.minimal} onClick={() => setSelectedDocument(doc)}>Details</button>
                    <button className={b.minimal} onClick={() => handleDelete(doc._id || doc.id)}>Delete</button>
                    <Link href={`/generate?regenerate=${doc._id || doc.id}`} className={b.minimal}>
                      Regenerate
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedDocument && (
        <div className={c.soft} style={{marginBottom:'var(--space-4)'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'var(--space-3)'}}>
            <h2 className={c.header}>{selectedDocument.title}</h2>
            <div style={{display:'flex',gap:'var(--space-2)'}}>
              <button className={b.minimal} onClick={() => setSelectedDocument(null)}>Close</button>
              <button className={b.minimal} onClick={() => setShowVersionHistory(!showVersionHistory)}>
                {showVersionHistory ? 'Hide' : 'Show'} Version History
              </button>
            </div>
          </div>
          {showVersionHistory && (
            <VersionHistory
              documentId={(selectedDocument as any)._id || selectedDocument.id}
              userId={user?.id || ''}
              onRestore={async (versionId) => {
                await fetch(`/api/documents/${(selectedDocument as any)._id || selectedDocument.id}/versions`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ versionId }),
                });
                loadDashboard();
                setShowVersionHistory(false);
              }}
            />
          )}
        </div>
      )}

      <div className={c.soft}>
        <h2 className={c.header}>Quick Actions</h2>
        <div style={{display:'flex',gap:'var(--space-3)',flexWrap:'wrap'}}>
          <Link href="/generate" className={b.soft}>Generate Document</Link>
          <Link href="/convert" className={b.minimal}>Convert File</Link>
          <Link href="/templates" className={b.minimal}>Browse Templates</Link>
          <Link href="/settings" className={b.minimal}>Settings</Link>
        </div>
      </div>
    </div>
  );
}
