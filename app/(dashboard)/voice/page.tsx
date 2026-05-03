'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useVoiceStore } from '@/store/voice-store';
import { useUserStore } from '@/store/user-store';
import { RecordButton } from '../../_components/RecordButton';
import { RecordingFeedback } from '../../_components/RecordingFeedback';
import { AudioPlayback } from '../../_components/AudioPlayback';
import { AudioUploader } from '../../_components/AudioUploader';
import { RerecordButton } from '../../_components/RerecordButton';
import { TranscriptionLoading } from '../../_components/TranscriptionLoading';
import { VoiceDownload } from '../../_components/VoiceDownload';
import { VoiceEdit } from '../../_components/VoiceEdit';
import { LanguageNotice } from '../../_components/LanguageNotice';
import { CreditBalance } from '../../_components/CreditBalance';
import { convertAudioToText, convertAudioFileToText } from '@/lib/audio-to-text';
import { handleTranscriptionError } from '@/lib/transcription-errors';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';

export default function VoicePage() {
  const {
    recordingStatus,
    audioBlob,
    transcribedText,
    formattedText,
    duration,
    documentId,
    error,
    inputMode,
    setStatus,
    setAudioBlob,
    setTranscribedText,
    setFormattedText,
    setDuration,
    setDocumentId,
    setError,
    setInputMode,
    reset,
  } = useVoiceStore();

  const { credits } = useUserStore();
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
      reset();
    };
  }, [reset]);

  const handleRecordingStart = useCallback(() => {
    setStatus('recording');
    setDuration(0);

    durationTimerRef.current = setInterval(() => {
      setDuration((prev: number) => {
        if (prev >= 119) {
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  }, [setStatus, setDuration]);

  const handleRecordingComplete = useCallback(
    (blob: Blob) => {
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
      setAudioBlob(blob);
      setStatus('idle');
    },
    [setAudioBlob, setStatus]
  );

  const handleRecordingCancel = useCallback(() => {
    if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    setStatus('idle');
  }, [setStatus]);

  const handleReRecord = useCallback(() => {
    setAudioBlob(null);
    setTranscribedText(null);
    setFormattedText(null);
    setDocumentId(null);
    setDuration(0);
    setError(null);
  }, [setAudioBlob, setTranscribedText, setFormattedText, setDocumentId, setDuration, setError]);

  const handleFileUpload = useCallback(
    async (file: File) => {
      setStatus('processing');
      setError(null);
      setAudioBlob(new Blob([file], { type: file.type }));

      try {
        const result = await convertAudioFileToText(file);
        if (result.success) {
          setTranscribedText(result.transcribedText || null);
          setFormattedText(result.formattedText || null);
        } else {
          setError(result.error || 'Failed');
        }
      } catch (err) {
        setError(handleTranscriptionError(err).message);
      } finally {
        setStatus('idle');
      }
    },
    [setStatus, setError, setAudioBlob, setTranscribedText, setFormattedText]
  );

  const handleProcessRecording = useCallback(async () => {
    if (!audioBlob) return;

    setStatus('processing');
    setError(null);

    try {
      const result = await convertAudioToText(audioBlob);
      if (result.success) {
        setTranscribedText(result.transcribedText || null);
        setFormattedText(result.formattedText || null);
      } else {
        setError(result.error || 'Transcription failed');
      }
    } catch (err) {
      setError(handleTranscriptionError(err).message);
    } finally {
      setStatus('idle');
    }
  }, [audioBlob, setStatus, setError, setTranscribedText, setFormattedText]);

  const handleReprocess = useCallback(
    async (editedText: string) => {
      setStatus('processing');
      setError(null);

      const { formatTranscript } = await import('@/lib/transcript-formatter');
      const formatted = formatTranscript(editedText);
      setTranscribedText(editedText);
      setFormattedText(formatted);
      setStatus('idle');
    },
    [setStatus, setError, setTranscribedText, setFormattedText]
  );

  return (
    <div style={{maxWidth:'var(--container-lg)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'var(--space-4)'}}>
        <Link href="/">Logo</Link>
        <CreditBalance />
        <Link href="/dashboard">Account</Link>
      </div>

      <div style={{marginBottom:'var(--space-2)'}}>
        <Link href="/" style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)'}}>Home</Link>
        <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)',margin:'0 var(--space-2)'}}>/</span>
        <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)'}}>Voice</span>
      </div>

      <h1>Voice to Document</h1>
      <LanguageNotice />

      <div className={c.soft}>
        <div style={{display:'flex',gap:'var(--space-3)',marginBottom:'var(--space-4)'}}>
          <button
            className={b.soft}
            onClick={() => setInputMode('record')}
            disabled={inputMode === 'record'}
          >
            Record
          </button>
          <button
            className={b.minimal}
            onClick={() => setInputMode('upload')}
            disabled={inputMode === 'upload'}
          >
            Upload
          </button>
        </div>

        {recordingStatus === 'recording' && (
          <RecordingFeedback isRecording={true} duration={duration} />
        )}

        {recordingStatus === 'processing' && null}

        {error && (
          <div style={{marginBottom:'var(--space-4)',padding:'var(--space-3)',background:'var(--color-error-muted)',borderRadius:'var(--radius-sm)'}}>
            <p style={{color:'var(--color-error)',margin:0}}>{error}</p>
            {recordingStatus !== 'processing' && (
              <button className={b.minimal} onClick={() => setError(null)} style={{marginTop:'var(--space-2)'}}>
                Dismiss
              </button>
            )}
          </div>
        )}

        {!audioBlob && recordingStatus !== 'processing' && (
          <div>
            {inputMode === 'record' ? (
              <div style={{textAlign:'center',padding:'var(--space-6) 0'}}>
                <RecordButton
                  onRecordingComplete={handleRecordingComplete}
                  onRecordingStart={handleRecordingStart}
                  onRecordingCancel={handleRecordingCancel}
                  disabled={recordingStatus === 'recording'}
                />
                <p style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)',marginTop:'var(--space-3)'}}>
                  Hold button to record. Release to stop. Max 2 minutes.
                </p>
              </div>
            ) : (
              <AudioUploader
                onFileSelected={handleFileUpload}
                onError={(msg) => setError(msg)}
                disabled={false}
              />
            )}
          </div>
        )}

        {audioBlob && !transcribedText && recordingStatus === 'idle' && (
          <div style={{textAlign:'center',padding:'var(--space-4) 0'}}>
            <AudioPlayback audioBlob={audioBlob} />
            <div style={{display:'flex',gap:'var(--space-3)',justifyContent:'center',marginTop:'var(--space-4)'}}>
              <button className={b.soft} onClick={handleProcessRecording}>
                Convert to Document ({credits} credits available)
              </button>
              <RerecordButton onClick={handleReRecord} />
            </div>
          </div>
        )}

        {formattedText && (
          <div>
            <div className={c.soft} style={{marginBottom:'var(--space-4)'}}>
              <h3 className={c.header}>Formatted Document</h3>
              <pre style={{whiteSpace:'pre-wrap',fontSize:'var(--text-sm)',color:'var(--color-text)'}}>
                {formattedText}
              </pre>
            </div>

            {transcribedText && (
              <details style={{marginBottom:'var(--space-4)'}}>
                <summary style={{cursor:'pointer',fontSize:'var(--text-sm)',color:'var(--color-text-muted)'}}>
                  View Raw Transcription
                </summary>
                <pre style={{whiteSpace:'pre-wrap',fontSize:'var(--text-sm)',marginTop:'var(--space-2)'}}>
                  {transcribedText}
                </pre>
              </details>
            )}

            <div style={{marginBottom:'var(--space-4)'}}>
              <VoiceEdit
                originalTranscription={transcribedText || ''}
                onReprocess={handleReprocess}
              />
            </div>

            <div style={{display:'flex',gap:'var(--space-3)',alignItems:'center'}}>
              <VoiceDownload documentId={documentId || undefined} formattedText={formattedText} />
              {documentId && (
                <Link href={`/preview?doc=${documentId}`} className={b.minimal}>
                  Preview Document
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
