import { Footer } from '../_components/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{display:'flex',flexDirection:'column',minHeight:'100vh'}}>
      {children}
      <Footer />
    </div>
  );
}