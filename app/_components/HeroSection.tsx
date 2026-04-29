'use client';

import { ReactNode } from 'react';

export function HeroSection(): ReactNode {
  return (
    <div className="hero-section">
      <h1 className="hero-headline">Documents, done smoothly.</h1>
      <p className="hero-subheadline">
        Create, convert, translate, and more - all in one place.
      </p>
      <div className="hero-demo-placeholder">
        <span className="placeholder-text">Animated Demo Area</span>
      </div>
    </div>
  );
}