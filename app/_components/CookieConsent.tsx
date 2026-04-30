'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('cookie_consent');
    if (!dismissed) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div>
      <p>We use cookies to improve your experience. By using Cremy Docs, you agree to our use of cookies.</p>
      <div>
        <button onClick={handleAccept}>Accept</button>
        <button onClick={handleDecline}>Decline</button>
        <Link href="/privacy">Learn more</Link>
      </div>
    </div>
  );
}