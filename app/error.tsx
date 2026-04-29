export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-page">
      <h2>Something went wrong</h2>
      <p>{error?.message || 'An error occurred'}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}