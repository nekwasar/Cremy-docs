export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <a href="/" className="logo">Cremy Docs</a>
          <nav className="header-nav">
            <a href="/auth/login">Login</a>
            <a href="/auth/register">Sign Up</a>
          </nav>
        </header>
        <main className="main-content">{children}</main>
      </body>
    </html>
  );
}