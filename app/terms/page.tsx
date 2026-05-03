import { generatePageMetadata } from '@/config/seo';
import c from '@/styles/components/Card.module.css';

export const metadata = generatePageMetadata({
  title: 'Terms of Service',
  description: 'Cremy Docs terms of service — rules and guidelines for using our document platform.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <div style={{maxWidth:'var(--container-md)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-6)'}}>Terms of Service</h1>

      <div className={`${c.card} ${c.soft}`}>
        <p style={{color:'var(--color-text-muted)',fontSize:'var(--text-sm)',marginBottom:'var(--space-6)'}}>Last updated: April 2026</p>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-3)'}}>Acceptance of Terms</h2>
        <p>By accessing or using Cremy Docs, you agree to these Terms of Service. If you do not agree, do not use our services.</p>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginTop:'var(--space-6)',marginBottom:'var(--space-3)'}}>Use of Service</h2>
        <p>You may use Cremy Docs to: create, convert, translate, and edit documents, store documents (if registered), and access all free tools without registration.</p>
        <p style={{marginTop:'var(--space-3)'}}>You may not: use the service for illegal purposes, attempt to circumvent credit systems or payment requirements, upload malicious files, or abuse the AI generation system.</p>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginTop:'var(--space-6)',marginBottom:'var(--space-3)'}}>Account Terms</h2>
        <p>You are responsible for maintaining the security of your account. You must provide accurate information when registering. Free accounts have storage limitations as described in our documentation.</p>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginTop:'var(--space-6)',marginBottom:'var(--space-3)'}}>Payment Terms</h2>
        <p>Paid features (credit packs, Pro subscriptions) are processed through our payment partners. Refunds are handled according to our refund policy. Pro subscriptions auto-renew until cancelled.</p>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginTop:'var(--space-6)',marginBottom:'var(--space-3)'}}>Intellectual Property</h2>
        <p>You retain ownership of all documents you create using Cremy Docs. We claim no ownership over your content.</p>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginTop:'var(--space-6)',marginBottom:'var(--space-3)'}}>Limitation of Liability</h2>
        <p>Cremy Docs is provided as-is. We strive for high quality but do not guarantee that AI-generated content will be error-free or suitable for all purposes.</p>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginTop:'var(--space-6)',marginBottom:'var(--space-3)'}}>Changes to Terms</h2>
        <p>We may update these terms. Continued use after changes constitutes acceptance.</p>
      </div>
    </div>
  );
}
