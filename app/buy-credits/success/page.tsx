'use client';

import Link from 'next/link';
import { useUserStore } from '@/store/user-store';

export default function BuyCreditsSuccessPage() {
  const { credits } = useUserStore();

  return (
    <div>
      <h1>Purchase Successful!</h1>
      <p>Your credits have been added to your account.</p>
      <p>New balance: {credits} credits</p>
      <div>
        <Link href="/generate">Generate a Document</Link>
        <Link href="/dashboard">Go to Dashboard</Link>
      </div>
    </div>
  );
}