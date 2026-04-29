'use client';

interface ButtonLoaderProps {
  loading: boolean;
  children: React.ReactNode;
  disabled?: boolean;
}

export function ButtonLoader({ loading, children, disabled }: ButtonLoaderProps) {
  if (loading) {
    return (
      <button disabled>
        <span>Loading...</span>
      </button>
    );
  }

  return <button disabled={disabled}>{children}</button>;
}