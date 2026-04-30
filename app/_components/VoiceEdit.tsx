'use client';

import { useState } from 'react';

interface VoiceEditProps {
  originalTranscription: string;
  onReprocess: (editedText: string) => void;
}

export function VoiceEdit({ originalTranscription, onReprocess }: VoiceEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(originalTranscription);

  const handleReprocess = () => {
    onReprocess(editedText);
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            rows={6}
          />
          <div>
            <button onClick={handleReprocess} type="button">Re-process with Corrections</button>
            <button onClick={() => {
              setEditedText(originalTranscription);
              setIsEditing(false);
            }} type="button">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsEditing(true)} type="button">
          Edit Transcription
        </button>
      )}
    </div>
  );
}