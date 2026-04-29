'use client';

import { useState, useRef } from 'react';
import { useUserStore } from '@/store/user-store';

export default function VoicePage() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const { credits, deductCredits } = useUserStore();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(blob));
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Microphone access denied:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const handleConvert = async () => {
    if (!audioUrl || credits < 3) {
      alert('Not enough credits');
      return;
    }

    setIsProcessing(true);
    deductCredits(3);

    try {
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioUrl }),
      });

      const data = await response.json();

      if (data.success) {
        setTranscript(data.data.transcript);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="voice-page">
      <h1>Voice to Document</h1>

      <div className="recorder">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={isRecording ? 'recording' : ''}
        >
          {isRecording ? 'Stop' : 'Start Recording'}
        </button>

        {audioUrl && (
          <audio src={audioUrl} controls />
        )}
      </div>

      {transcript && (
        <div className="transcript">
          <h3>Transcript</h3>
          <p>{transcript}</p>
        </div>
      )}

      <button
        onClick={handleConvert}
        disabled={!audioUrl || isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Convert to Document (3 credits)'}
      </button>
    </div>
  );
}