'use client';

import { Suspense, ComponentType } from 'react';

interface SuspenseWrapperProps {
  children: React.ReactNode;
}

export function SuspenseWrapper({ children }: SuspenseWrapperProps) {
  return <Suspense fallback={null}>{children}</Suspense>;
}

export function withSuspense<P extends object>(Component: ComponentType<P>): ComponentType<P> {
  return function SuspenseHOC(props: P) {
    return (
      <Suspense fallback={null}>
        <Component {...props} />
      </Suspense>
    );
  };
}
