'use client';

import { Suspense, ComponentType } from 'react';

interface SuspenseWrapperProps {
  children: React.ReactNode;
}

export function SuspenseWrapper({ children }: SuspenseWrapperProps) {
  return <Suspense fallback={<p>Loading...</p>}>{children}</Suspense>;
}

export function withSuspense<P extends object>(Component: ComponentType<P>): ComponentType<P> {
  return function SuspenseHOC(props: P) {
    return (
      <Suspense fallback={<p>Loading...</p>}>
        <Component {...props} />
      </Suspense>
    );
  };
}
