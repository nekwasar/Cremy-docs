import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div>
        <Link href="/">Cremy Docs</Link>
        <main>{children}</main>
        <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
      </div>
    </div>
  );
}