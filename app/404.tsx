import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist or has been moved.</p>

      <div>
        <h2>What might have happened?</h2>
        <ul>
          <li>The URL may be mistyped</li>
          <li>The page may have been moved or deleted</li>
          <li>A bookmark may be outdated</li>
        </ul>
      </div>

      <div>
        <h2>Try these instead:</h2>
        <ul>
          <li><Link href="/">Homepage</Link></li>
          <li><Link href="/generate">Generate a Document</Link></li>
          <li><Link href="/convert">Convert a File</Link></li>
          <li><Link href="/templates">Browse Templates</Link></li>
          <li><Link href="/blog">Read Our Blog</Link></li>
          <li><Link href="/contact">Contact Support</Link></li>
        </ul>
      </div>
    </div>
  );
}