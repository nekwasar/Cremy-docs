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

  if (isLoading) return <p>Loading dashboard...</p>;

  if (!isPro) {
    return (
      <div>
        <h1>Dashboard</h1>
        <CreditBalance />
        <FreeDashboard
          credits={credits}
          activityLog={analyticsData.activityTimeline}
        />
        <div>
          <h2>Recent Documents</h2>
          {documents.length === 0 ? (
            <p>No documents yet. <Link href="/generate">Create one</Link></p>
          ) : (
            <ul>
              {documents.map((doc: any) => (
                <li key={doc._id || doc.id}>
                  <Link href={`/preview?doc=${doc._id || doc.id}`}>
                    {doc.title || 'Untitled'}
                  </Link>
                  <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Pro Dashboard</h1>
      <CreditBalance />

      <AutoSaveIndicator
        enabled={true}
        storageType="mongodb"
      />

      <div>
        <label>
          <input
            type="checkbox"
            checked={activityLoggingEnabled}
            onChange={(e) => setActivityLogging(e.target.checked)}
          />
          Enable Activity Logging
        </label>
      </div>

      <AnalyticsWidget
        documentsThisMonth={analyticsData.documentsThisMonth}
        creditsUsedThisMonth={analyticsData.creditsUsedThisMonth}
        mostUsedFormats={analyticsData.mostUsedFormats}
      />

      <ActivityTimeline timeline={analyticsData.activityTimeline} />

      <FolderManager />

      <BulkActions
        selectedIds={Array.from(selectedIds)}
        onDeleteSelected={handleBulkDelete}
        onExportAll={handleExportAll}
        onSelectAll={() => setSelectedIds(new Set(documents.map((d: any) => d._id || d.id)))}
        onDeselectAll={() => setSelectedIds(new Set())}
        totalDocuments={documents.length}
      />

      <DocumentFilterBar
        onSearch={setSearchQuery}
        onSort={setSortBy}
        onFilter={setFilterFormat}
      />

      <div>
        <h2>Documents ({documents.length})</h2>
        <Link href="/generate">Create New</Link>

        {documents.length === 0 ? (
          <p>No documents found.</p>
        ) : (
          <ul>
            {documents.map((doc: any) => (
              <li key={doc._id || doc.id}>
                <input
                  type="checkbox"
                  checked={selectedIds.has(doc._id || doc.id)}
                  onChange={() => toggleSelect(doc._id || doc.id)}
                />
                <Link href={`/preview?doc=${doc._id || doc.id}`}>
                  <strong>{doc.title || 'Untitled'}</strong>
                </Link>
                <span>{doc.format || 'txt'}</span>
                <span>{doc.wordCount || 0} words</span>
                <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                <div>
                  <button onClick={() => setSelectedDocument(doc)}>Details</button>
                  <button onClick={() => handleDelete(doc._id || doc.id)}>Delete</button>
                  <Link href={`/generate?regenerate=${doc._id || doc.id}`}>
                    Regenerate
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedDocument && (
        <div>
          <h2>{selectedDocument.title}</h2>
          <button onClick={() => setSelectedDocument(null)}>Close</button>
          <button onClick={() => setShowVersionHistory(!showVersionHistory)}>
            {showVersionHistory ? 'Hide' : 'Show'} Version History
          </button>
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

      <div>
        <h2>Quick Actions</h2>
        <div>
          <Link href="/generate">Generate Document</Link>
          <Link href="/convert">Convert File</Link>
          <Link href="/templates">Browse Templates</Link>
          <Link href="/settings">Settings</Link>
        </div>
      </div>
    </div>
  );
}