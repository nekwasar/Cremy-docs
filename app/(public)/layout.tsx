export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header>
        <a href="/">Cremy Docs</a>
        <nav>
          <a href="/templates">Templates</a>
          <a href="/convert">Convert</a>
          <a href="/pricing">Pricing</a>
          <a href="/auth/login">Login</a>
          <a href="/auth/register">Sign Up</a>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
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