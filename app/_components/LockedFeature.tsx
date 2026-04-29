'use client';

interface LockedFeatureProps {
  featureName: string;
  requiredCredits?: number;
  onUpgrade: () => void;
}

export function LockedFeature({ featureName, requiredCredits, onUpgrade }: LockedFeatureProps) {
  return (
    <div>
      <span>Pro</span>
      <div>
        <h4>{featureName}</h4>
        <p>This feature requires a Pro subscription{requiredCredits ? ` or ${requiredCredits} credits` : ''}.</p>
        <button onClick={onUpgrade}>Upgrade to Pro</button>
      </div>
    </div>
  );
}