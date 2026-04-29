type SectionStatus = 'pending' | 'filled';

interface SectionSkeleton {
  id: string;
  heading: {
    status: SectionStatus;
    content?: string;
  };
  content: {
    status: SectionStatus;
    content?: string;
  };
}

interface TitleSkeleton {
  status: SectionStatus;
  content?: string;
}

export interface DocumentSkeleton {
  title: TitleSkeleton;
  sections: SectionSkeleton[];
  progress: number;
}

export interface SkeletonProgress {
  title: number;
  sections: number;
  total: number;
}