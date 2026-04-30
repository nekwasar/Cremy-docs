'use client';

interface SectionPlaceholder {
  id: string;
  heading: string;
  status: 'pending' | 'filled';
}

interface DocumentSkeletonProps {
  title?: string;
  sections: SectionPlaceholder[];
  progress: number;
}

export function DocumentSkeleton({ title, sections, progress }: DocumentSkeletonProps) {
  return (
    <div>
      <div>
        {title ? (
          <h2>{title}</h2>
        ) : (
          <div>
            <p>Generating title...</p>
          </div>
        )}
      </div>

      <div>
        {sections.map((section) => (
          <div key={section.id}>
            {section.status === 'filled' ? (
              <h3>{section.heading}</h3>
            ) : (
              <div>
                <p>Generating section...</p>
              </div>
            )}
            {section.status === 'pending' && (
              <div>
                <p>Pending...</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <progress value={progress} max={100}>
        {progress}%
      </progress>
    </div>
  );
}