'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BillingPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/payments')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPayments(data.data.payments || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading payment history...</p>;

  return (
    <div>
      <h1>Payment History</h1>

      {payments.length === 0 ? (
        <p>No payment history.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Processor</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment: any) => (
              <tr key={payment.id}>
                <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                <td>{payment.type === 'credit_purchase' ? 'Credits' : 'Subscription'}</td>
                <td>${payment.amount} {payment.currency}</td>
                <td>{payment.processor}</td>
                <td>{payment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link href="/account/subscription">Back to Subscription</Link>
    </div>
  );
}