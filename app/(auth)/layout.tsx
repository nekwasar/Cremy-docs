export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <main>{children}</main>
      <p style={{textAlign:'center',fontSize:'var(--text-xs)',color:'var(--color-text-muted)',padding:'var(--space-4)'}}>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
    </div>
  );
}