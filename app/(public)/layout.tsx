export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="public-layout">
      <header className="public-header">
        <a href="/" className="logo">Cremy Docs</a>
        <nav className="public-nav">
          <a href="/templates">Templates</a>
          <a href="/convert">Convert</a>
          <a href="/pricing">Pricing</a>
          <a href="/auth/login" className="btn-login">Login</a>
          <a href="/auth/register" className="btn-signup">Sign Up</a>
        </nav>
      </header>
      <main className="public-main">{children}</main>
      <footer className="public-footer">
        <p>&copy; 2024 Cremy Docs. All rights reserved.</p>
        <nav>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/contact">Contact</a>
        </nav>
      </footer>
    </div>
  );
}