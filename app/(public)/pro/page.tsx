import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pro Plans',
  description: 'Upgrade to Cremy Docs Pro for unlimited documents, more credits, and premium features.',
};

export default function ProPage() {
  return (
    <div>
      <h1>Cremy Docs Pro</h1>
      <p>Get unlimited documents and premium features</p>

      <div>
        <div>
          <h2>Free</h2>
          <p>$0</p>
          <ul>
            <li>5 credits/day</li>
            <li>Basic templates</li>
            <li>Standard formats</li>
          </ul>
          <Link href="/auth/register">Get Started Free</Link>
        </div>

        <div>
          <h2>Pro Monthly</h2>
          <p>$14.99/month</p>
          <ul>
            <li>200 credits/month</li>
            <li>All templates</li>
            <li>All formats (PDF, DOCX, TXT, MD)</li>
            <li>Priority support</li>
            <li>No watermarks</li>
            <li>Unlimited documents</li>
          </ul>
          <Link href="/credits?plan=pro-monthly">Get Pro Monthly</Link>
        </div>

        <div>
          <h2>Pro Yearly</h2>
          <p>$119.99/year</p>
          <p>Save 33%</p>
          <ul>
            <li>2400 credits/year</li>
            <li>All Pro Monthly features</li>
            <li>2 months free</li>
          </ul>
          <Link href="/credits?plan=pro-yearly">Get Pro Yearly</Link>
        </div>
      </div>
    </div>
  );
}