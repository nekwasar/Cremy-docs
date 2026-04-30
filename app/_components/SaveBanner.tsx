'use client';

import { useState } from 'react';

interface SaveBannerProps {
  onEnableStorage: () => void;
  onDismiss: () => void;
}

export function SaveBanner({ onEnableStorage, onDismiss }: SaveBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleNotInterested = () => {
    setDismissed(true);
    onDismiss();
  };

  const handleEnableStorage = () => {
    onEnableStorage();
  };

  const handleNeverShow = () => {
    localStorage.setItem('save_banner_dismissed', 'true');
    setDismissed(true);
    onDismiss();
  };

  return (
    <div>
      <p>Your document was downloaded successfully.</p>
      <p>Turn on storage to keep your documents saved online.</p>
      <div>
        <button onClick={handleEnableStorage}>Turn on Storage</button>
        <button onClick={handleNotInterested}>Not Interested</button>
        <button onClick={handleNeverShow}>Never show again</button>
      </div>
    </div>
  );
}