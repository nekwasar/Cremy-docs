import Link from 'next/link';

export default function BuyCreditsCancelPage() {
  return (
    <div>
      <h1>Purchase Cancelled</h1>
      <p>Your payment was not completed.</p>
      <div>
        <Link href="/buy-credits">Try Again</Link>
        <Link href="/">Go Home</Link>
      </div>
    </div>
  );
}