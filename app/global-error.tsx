'use client';

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h1>Application Error</h1>
        <p>A critical error occurred. Your data has not been lost.</p>
        <p>Error details: {error.message}</p>
        <button onClick={reset}>Try Again</button>
      </body>
    </html>
  );
}