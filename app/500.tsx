'use client';

import Link from 'next/link';

export default function ServerErrorPage() {
  return (
    <div>
      <h1>Something Went Wrong</h1>
      <p>We encountered an unexpected error. Do not worry — it is not your fault, and your data is safe.</p>

      <div>
        <h2>What to do:</h2>
        <ul>
          <li>Reload the page — it often resolves the issue</li>
          <li>Wait a moment and try again — our systems may be recovering</li>
          <li>If the problem persists, our team has been notified</li>
        </ul>
      </div>

      <div>
        <button onClick={() => window.location.reload()}>
          Reload Page
        </button>
        <Link href="/">Go to Homepage</Link>
        <Link href="/contact">Contact Support</Link>
      </div>
    </div>
  );
}