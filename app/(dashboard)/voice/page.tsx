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
    <div>
      <div>
        <Link href="/">Logo</Link>
        <CreditBalance />
        <Link href="/dashboard">Account</Link>
      </div>

      <div>
        <Link href="/">Home</Link>
        <span> / </span>
        <span>Voice</span>
      </div>

      <h1>Voice to Document</h1>
      <LanguageNotice />

      <div>
        <button onClick={() => setInputMode('record')} disabled={inputMode === 'record'}>
          Record
        </button>
        <button onClick={() => setInputMode('upload')} disabled={inputMode === 'upload'}>
          Upload
        </button>
      </div>

      {recordingStatus === 'recording' && (
        <RecordingFeedback isRecording={true} duration={duration} />
      )}

      {recordingStatus === 'processing' && <TranscriptionLoading />}

      {error && (
        <div>
          <p>{error}</p>
          {recordingStatus !== 'processing' && (
            <button onClick={() => setError(null)}>Dismiss</button>
          )}
        </div>
      )}

      {!audioBlob && recordingStatus !== 'processing' && (
        <div>
          {inputMode === 'record' ? (
            <div>
              <RecordButton
                onRecordingComplete={handleRecordingComplete}
                onRecordingStart={handleRecordingStart}
                onRecordingCancel={handleRecordingCancel}
                disabled={recordingStatus === 'recording'}
              />
              <p>Hold button to record. Release to stop. Max 2 minutes.</p>
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
        <div>
          <AudioPlayback audioBlob={audioBlob} />
          <div>
            <button onClick={handleProcessRecording}>
              Convert to Document ({credits} credits available)
            </button>
            <RerecordButton onClick={handleReRecord} />
          </div>
        </div>
      )}

      {formattedText && (
        <div>
          <div>
            <h3>Formatted Document</h3>
            <pre>{formattedText}</pre>
          </div>

          {transcribedText && (
            <details>
              <summary>View Raw Transcription</summary>
              <pre>{transcribedText}</pre>
            </details>
          )}

          <VoiceEdit
            originalTranscription={transcribedText || ''}
            onReprocess={handleReprocess}
          />

          <div>
            <VoiceDownload documentId={documentId || undefined} formattedText={formattedText} />
            {documentId && (
              <Link href={`/preview?doc=${documentId}`}>Preview Document</Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}