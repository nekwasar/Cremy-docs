'use client';

export function TranscriptionLoading() {
  return (
    <div>
      <p>Processing audio...</p>
      <p>Transcribing your recording. This may take a moment.</p>
      <div>
        <progress />
      </div>
    </div>
  );
}