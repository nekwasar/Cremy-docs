'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUserStore } from '@/store/user-store';

export function SignUpPrompt() {
  const { credits, isAnonymous } = useUserStore();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (isAnonymous && credits < 3) {
      setShowPrompt(true);
    }
  }, [isAnonymous, credits]);

  if (!showPrompt) return null;

  return (
    <div className="signup-prompt">
      <div className="prompt-content">
        <h3>Create a free account</h3>
        <p>You have {credits} credits remaining. Sign up to get 10 more free credits and save your documents!</p>
        
        <div className="prompt-actions">
          <Link href="/auth/register" className="btn-signup">
            Sign Up Free
          </Link>
          <button onClick={() => setShowPrompt(false)} className="btn-later">
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}