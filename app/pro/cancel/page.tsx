import Link from 'next/link';

export default function ProCancelPage() {
  return (
    <div>
      <h1>Subscription Cancelled</h1>
      <p>Your Pro subscription was not started.</p>
      <Link href="/pro">Try Again</Link>
    </div>
  );
}