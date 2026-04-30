'use client';

interface AutoSaveIndicatorProps {
  enabled: boolean;
  lastSaved?: string;
  storageType?: 'mongodb' | 'localstorage';
}

export function AutoSaveIndicator({ enabled, lastSaved, storageType }: AutoSaveIndicatorProps) {
  return (
    <div>
      {enabled ? (
        <div>
          <span>Auto-save: ON</span>
          {storageType && <span>({storageType === 'mongodb' ? 'Cloud' : 'Local'})</span>}
          {lastSaved && <span>Last saved: {new Date(lastSaved).toLocaleTimeString()}</span>}
        </div>
      ) : (
        <div>
          <span>Auto-save: OFF</span>
          <p>Enable auto-save to protect your work</p>
        </div>
      )}
    </div>
  );
}