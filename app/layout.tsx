import type { Metadata } from 'next';
import '@/styles/global.css';
import { Navbar } from './_components/Navbar';
import { ThemeProvider } from './_components/ThemeProvider';

export const metadata: Metadata = {
  title: 'Cremy Docs - AI-Powered Document Platform',
  description: 'Generate, convert, and edit documents with AI. Free credits available.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('cremy-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <Navbar />
          <main style={{paddingTop:'56px'}}>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
