'use client';

import { Component, ReactNode } from 'react';
import Link from 'next/link';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string;
}

export class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: '' };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({ errorInfo: errorInfo?.componentStack || '' });

    try {
      fetch('/api/analytics/error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'global_error',
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo?.componentStack,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
    } catch {}
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: '' });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div>
          <h1>Something went wrong</h1>
          <p>An unexpected error occurred. Don&apos;t worry — your data is safe.</p>
          <div>
            <p>Error: {this.state.error?.message || 'Unknown error'}</p>
          </div>
          <div>
            <button onClick={this.handleRetry}>Try Again</button>
            <Link href="/">Go Home</Link>
            <Link href="/contact">Contact Support</Link>
          </div>
          <div>
            <button onClick={() => window.location.reload()}>
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
