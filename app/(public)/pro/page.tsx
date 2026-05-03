import { Metadata } from 'next';
import Link from 'next/link';
import s from '@/styles/pages/pro.module.css';
import b from '@/styles/components/Button.module.css';

export const metadata: Metadata = {
  title: 'Pro Plans',
  description: 'Upgrade to Cremy Docs Pro for unlimited documents, more credits, and premium features.',
};

export default function ProPage() {
  return (
    <div className={s.page}>
      <div className={s.header}>
        <h1 className={s.headerTitle}>Cremy Docs Pro</h1>
        <p className={s.headerSub}>Get unlimited documents and premium features</p>
      </div>

      <div className={s.plans}>
        <div className={s.planCard}>
          <h2 className={s.planName}>Free</h2>
          <p className={s.planPrice}>$0</p>
          <ul className={s.planFeatures}>
            <li className={s.planFeature}>5 credits/day</li>
            <li className={s.planFeature}>Basic templates</li>
            <li className={s.planFeature}>Standard formats</li>
          </ul>
          <Link href="/register" className={`${b.btn} ${b.soft}`}>Get Started Free</Link>
        </div>

        <div className={s.planCard}>
          <h2 className={s.planName}>Pro Monthly</h2>
          <p className={s.planPrice}>$14.99</p>
          <p className={s.planPeriod}>/month</p>
          <ul className={s.planFeatures}>
            <li className={s.planFeature}>200 credits/month</li>
            <li className={s.planFeature}>All templates</li>
            <li className={s.planFeature}>All formats (PDF, DOCX, TXT, MD)</li>
            <li className={s.planFeature}>Priority support</li>
            <li className={s.planFeature}>No watermarks</li>
            <li className={s.planFeature}>Unlimited documents</li>
          </ul>
          <Link href="/credits?plan=pro-monthly" className={`${b.btn} ${b.soft}`}>Get Pro Monthly</Link>
        </div>

        <div className={`${s.planCard} ${s.planHighlight}`} style={{ borderColor: 'var(--color-primary)' }}>
          <h2 className={s.planName}>Pro Yearly</h2>
          <p className={s.planPrice}>$119.99</p>
          <p className={s.planPeriod}>/year — Save 33%</p>
          <ul className={s.planFeatures}>
            <li className={s.planFeature}>2400 credits/year</li>
            <li className={s.planFeature}>All Pro Monthly features</li>
            <li className={s.planFeature}>2 months free</li>
          </ul>
          <Link href="/credits?plan=pro-yearly" className={`${b.btn} ${b.soft}`}>Get Pro Yearly</Link>
        </div>
      </div>
    </div>
  );
}
