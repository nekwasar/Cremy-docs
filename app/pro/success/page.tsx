import Link from 'next/link';

export default function ProSuccessPage() {
  return (
    <div>
      <h1>Welcome to Pro!</h1>
      <p>Your Pro subscription is now active.</p>
      <p>You now have access to:</p>
      <ul>
        <li>Pro credits every month</li>
        <li>Unlimited cloud storage</li>
        <li>Version history</li>
        <li>Priority support</li>
      </ul>
      <div>
        <Link href="/generate">Start Creating</Link>
        <Link href="/dashboard">Go to Dashboard</Link>
      </div>
    </div>
  );
}