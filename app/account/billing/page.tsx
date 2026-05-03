'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import b from '@/styles/components/Button.module.css';

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

  if (loading) return null;

  return (
    <div style={{ maxWidth: 'var(--container-lg)', margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
      <h1 style={{ marginBottom: 'var(--space-6)' }}>Payment History</h1>

      {payments.length === 0 ? (
        <p style={{ color: 'var(--color-text-secondary)' }}>No payment history.</p>
      ) : (
        <div style={{ overflowX: 'auto', marginBottom: 'var(--space-6)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left' }}>Date</th>
                <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left' }}>Type</th>
                <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left' }}>Amount</th>
                <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left' }}>Processor</th>
                <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment: any) => (
                <tr key={payment.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: 'var(--space-3) var(--space-4)' }}>{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)' }}>{payment.type === 'credit_purchase' ? 'Credits' : 'Subscription'}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)' }}>${payment.amount} {payment.currency}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)' }}>{payment.processor}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)' }}>{payment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Link href="/account/subscription" className={`${b.btn} ${b.raw}`}>
        Back to Subscription
      </Link>
    </div>
  );
}
