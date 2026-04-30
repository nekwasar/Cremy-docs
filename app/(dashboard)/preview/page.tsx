'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSocket } from '@/hooks/useSocket';
import { usePreviewStore } from '@/store/preview-store';
import { useUndoStore } from '@/store/undo-store';
import { useToolIndicatorStore } from '@/store/tool-indicator-store';
import { useKeyboardUndo } from '@/hooks/useKeyboardUndo';
import { useAIEdit } from '@/hooks/useAIEdit';
import { DocumentRenderer } from '../../_components/DocumentRenderer';
import { PreviewToolbar } from '../../_components/PreviewToolbar';
import { AIEditInput } from '../../_components/AIEditInput';
import { UndoToast } from '../../_components/UndoToast';
import { ToolVisualIndicators } from '../../_components/ToolVisualIndicators';
import { CreditBalance } from '../../_components/CreditBalance';
import { useGenerateStore } from '@/store/generate-store';

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const docId = searchParams.get('doc');

  const {
    document,
    isLoading,
    currentMode,
    error,
    setDocument,
    setLoading,
    setMode,
    setError,
    reset,
  } = usePreviewStore();

  const [fullEditMode, setFullEditMode] = useState(false);
  const [editContent, setEditContent] = useState('');

  const { socket } = useSocket();

  useKeyboardUndo();

  const { executeEdit } = useAIEdit({
    socket,
    documentId: docId || '',
  });

  const loadDocument = useCallback(async () => {
    if (!docId) {
      setDocument(null);
      return;
    }

    setLoading(true);

    const sessionData = typeof window !== 'undefined'
      ? sessionStorage.getItem(`doc_${docId}`)
      : null;

    if (sessionData) {
      try {
        const doc = JSON.parse(sessionData);
        setDocument(doc);
        setEditContent(doc.content || '');
        return;
      } catch {}
    }

    try {
      const response = await fetch(`/api/documents/${docId}`);
      const data = await response.json();
      if (data.success) {
        setDocument(data.data.document);
        setEditContent(data.data.document.content || '');
      } else {
        setError('Document not found');
      }
    } catch {
      setError('Failed to load document');
    }
  }, [docId, setDocument, setLoading, setError]);

  useEffect(() => {
    loadDocument();
    useToolIndicatorStore.getState().setActiveTool('generate');
    return () => reset();
  }, [docId, loadDocument, reset]);

  const handleDownload = (format: string) => {
    if (!docId) return;

    fetch(`/api/documents/${docId}/download?format=${format}`)
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `document.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(console.error);
  };

  const handleRegenerate = () => {
    if (!socket?.connected) return;
    const { originalInput, selectedStructure, selectedTemplate } =
      useGenerateStore.getState();

    if (originalInput) {
      socket.emit('generate', {
        text: originalInput,
        formatId: selectedStructure || 'auto',
        templateId: selectedTemplate,
      });
    }
  };

  const handleAIEdit = async (instruction: string, targetElementId?: string) => {
    const doc = usePreviewStore.getState().document;

    useUndoStore.getState().addAction({
      elementId: targetElementId || 'document',
      before: editContent,
      after: '',
      creditCost: 1,
      toolType: 'edit',
    });

    await executeEdit(instruction, targetElementId);

    if (docId) {
      loadDocument();
    }
  };

  if (isLoading) {
    return (
      <div>
        <Link href="/generate">← Back</Link>
        <p>Loading document...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Link href="/generate">← Back</Link>
        <h1>Error</h1>
        <p>{error}</p>
        <Link href="/generate">Return to Generate</Link>
      </div>
    );
  }

  if (!document) {
    return (
      <div>
        <Link href="/generate">← Back</Link>
        <h1>No Document Found</h1>
        <p>The document could not be found. It may have been deleted or you may not have access.</p>
        <Link href="/generate">Create New Document</Link>
      </div>
    );
  }

  return (
    <div>
      <div>
        <Link href="/">Logo</Link>
        <CreditBalance />
        <Link href="/dashboard">Account</Link>
      </div>

      <div>
        <Link href="/">Home</Link>
        <span> / </span>
        <Link href="/generate">Generate</Link>
        <span> / </span>
        <span>Preview</span>
      </div>

      <ToolVisualIndicators
        activeTool={useToolIndicatorStore.getState().activeTool}
        toolStatus="complete"
      />

      <PreviewToolbar
        isFullEdit={fullEditMode}
        canUndo={useUndoStore.getState().history.length > 0}
        canRedo={false}
        onToggleEdit={() => setFullEditMode(!fullEditMode)}
        onUndo={() => useUndoStore.getState().undo()}
        onRedo={() => {}}
        onDownload={handleDownload}
        onRegenerate={handleRegenerate}
      />

      <div>
        <DocumentRenderer
          content={editContent}
          editable={true}
          fullEditMode={fullEditMode}
          onContentChange={setEditContent}
        />
      </div>

      <div>
        <AIEditInput onSubmit={handleAIEdit} isLoading={false} />
      </div>

      {docId && (
        <div>
          <p>Edit in preview page - any unexpected output can be edited here.</p>
        </div>
      )}

      <UndoToast />
    </div>
  );
}