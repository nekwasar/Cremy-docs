import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cremy Docs - Documents, Done Smoothly',
  description: 'AI-powered document platform. Generate, convert, translate, and more.',
};

/**
 * Homepage
 * 
 * This is the main landing page.
 * Currently serves as a simple test page to verify the app runs.
 * Will be expanded with full UI in later milestones.
 */
export default function Home() {
  return (
    <main>
      <h1>Cremy Docs</h1>
      <p>Documents, done smoothly.</p>
      <p>API Health: <a href="/api/health">/api/health</a></p>
    </main>
  );
}