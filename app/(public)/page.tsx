import Link from 'next/link';
import { HeroSection } from '../_components/HeroSection';
import { QuickActions } from '../_components/QuickActions';
import { FeaturesSection } from '../_components/FeaturesSection';
import { ThemeSwitcher } from '../_components/ThemeSwitcher';
import s from '@/styles/pages/home.module.css';
import b from '@/styles/components/Button.module.css';

export default function HomePage() {
  return (
    <div className={s.page}>
      <div className={s.hero}>
        <h1 className={s.heroTitle}>Documents, done smoothly.</h1>
        <p className={s.heroDesc}>Create, convert, translate, and more — all in one place.</p>
        <div className={s.heroActions}>
          <Link href="/generate" className={`${b.btn} ${b.soft}`}>Start Generating</Link>
          <Link href="/templates" className={`${b.btn} ${b.soft}`}>Browse Templates</Link>
      <ThemeSwitcher />
    </div>
      </div>
      <div className={s.toolsSection}>
        <QuickActions />
      </div>
      <div className={s.featuresSection}>
        <FeaturesSection />
      </div>
      <div className={s.ctaSection}>
        <h2 style={{marginBottom:'var(--space-3)'}}>Get Started Free</h2>
        <p style={{fontSize:'var(--text-base)',color:'var(--color-text-secondary)',marginBottom:'var(--space-6)'}}>Sign up for free credits and start creating documents</p>
        <Link href="/register" className={`${b.btn} ${b.soft}`}>Create Account</Link>
      </div>
    </div>
  );
}