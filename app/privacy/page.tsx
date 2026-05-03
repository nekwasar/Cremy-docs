import { generatePageMetadata } from '@/config/seo';
import c from '@/styles/components/Card.module.css';

export const metadata = generatePageMetadata({
  title: 'Privacy Policy',
  description: 'Cremy Docs privacy policy — how we collect, use, and protect your data.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <div style={{maxWidth:'var(--container-md)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-6)'}}>Privacy Policy</h1>

      <div className={`${c.card} ${c.soft}`}>
        <p style={{color:'var(--color-text-muted)',fontSize:'var(--text-sm)',marginBottom:'var(--space-6)'}}>Last updated: April 2026</p>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-3)'}}>Information We Collect</h2>
        <p>When you use Cremy Docs, we collect: email address (if you register), document content you upload or generate, usage data (pages visited, features used), and payment information (processed securely by our payment partners — we never store full card details).</p>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginTop:'var(--space-6)',marginBottom:'var(--space-3)'}}>How We Use Your Data</h2>
        <p>We use your data to: provide and improve our document services, process your payments and subscriptions, send important account notifications, and analyze usage to improve our platform.</p>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginTop:'var(--space-6)',marginBottom:'var(--space-3)'}}>Data Storage</h2>
        <p>Free users: document data stored locally in your browser (localStorage). Pro users: documents stored securely in our cloud database (MongoDB). You can delete your data at any time from your account settings.</p>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginTop:'var(--space-6)',marginBottom:'var(--space-3)'}}>Data Sharing</h2>
        <p>We do not sell your personal data. We share data only with: payment processors (to complete transactions), AI service providers (to process document generation requests), and when required by law.</p>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginTop:'var(--space-6)',marginBottom:'var(--space-3)'}}>Your Rights</h2>
        <p>You have the right to: access your data, delete your account and all associated data, export your documents, and opt out of marketing communications.</p>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginTop:'var(--space-6)',marginBottom:'var(--space-3)'}}>Contact</h2>
        <p>For privacy concerns, contact us at privacy@cremydocs.com.</p>
      </div>
    </div>
  );
}
