'use client';

interface MaintenanceModeProps {
  enabled: boolean;
  onToggle: () => void;
  message: string;
  onMessageChange: (msg: string) => void;
}

export function MaintenanceMode({ enabled, onToggle, message, onMessageChange }: MaintenanceModeProps) {
  return (
    <div>
      <label>
        <input type="checkbox" checked={enabled} onChange={onToggle} />
        Enable Maintenance Mode
      </label>
      {enabled && (
        <div>
          <label>Maintenance Message:</label>
          <textarea value={message} onChange={(e) => onMessageChange(e.target.value)} rows={3} />
        </div>
      )}
    </div>
  );
}