'use client';

import { ReactNode } from 'react';

interface JharokhaFrameProps {
  children: ReactNode;
  className?: string;
}

export default function JharokhaFrame({ children, className = '' }: JharokhaFrameProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Top arch ornament */}
      <svg
        viewBox="0 0 400 40"
        className="w-full h-8 text-brass/30"
        preserveAspectRatio="none"
      >
        <path
          d="M0,40 Q50,40 80,25 Q120,5 200,0 Q280,5 320,25 Q350,40 400,40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M60,40 Q90,40 110,28 Q145,12 200,8 Q255,12 290,28 Q310,40 340,40"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.5"
        />
        {/* Center finial */}
        <circle cx="200" cy="4" r="3" fill="currentColor" opacity="0.6" />
        <line x1="200" y1="7" x2="200" y2="16" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      </svg>

      {/* Content area with side borders */}
      <div className="relative border-x border-brass/10">
        {/* Left ornamental line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brass/20 to-transparent" />
        {/* Right ornamental line */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brass/20 to-transparent" />
        {children}
      </div>

      {/* Bottom border ornament */}
      <div className="h-px bg-gradient-to-r from-transparent via-brass/20 to-transparent" />
    </div>
  );
}
