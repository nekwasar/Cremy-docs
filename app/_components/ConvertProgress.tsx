'use client';

interface ConvertProgressProps {
  progress: number;
  isConverting: boolean;
  step?: string;
}

export function ConvertProgress({ progress, isConverting, step }: ConvertProgressProps) {
  if (!isConverting && progress === 0) return null;

  return (
    <div>
      <div>
        <progress value={progress} max={100}>{progress}%</progress>
        <span>{progress}%</span>
      </div>
      {step && <p>{step}</p>}
      {isConverting && (
        <div>
          {progress < 30 && <p>Analyzing file...</p>}
          {progress >= 30 && progress < 70 && <p>Converting content...</p>}
        </div>
      )}
    </div>
  );
}