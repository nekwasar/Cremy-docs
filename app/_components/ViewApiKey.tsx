'use client';

interface ViewApiKeyProps {
  maskedKey: string;
  createdAt: string;
  lastUsed?: string;
}

export function ViewApiKey({ maskedKey, createdAt, lastUsed }: ViewApiKeyProps) {
  return (
    <div>
      <p>Key: {maskedKey}</p>
      <p>Created: {new Date(createdAt).toLocaleDateString()}</p>
      {lastUsed && <p>Last Used: {new Date(lastUsed).toLocaleString()}</p>}
      <button onClick={() => navigator.clipboard.writeText(maskedKey)}>
        Copy
      </button>
    </div>
  );
}