'use client';

import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({ children, className = '', hover = false }: GlassCardProps) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-xl
        bg-gradient-to-br from-warm-mid/80 via-warm-dark/90 to-warm-mid/60
        backdrop-blur-xl
        border border-brass/10
        shadow-[0_4px_24px_rgba(0,0,0,0.3)]
        ${hover ? 'hover:border-brass/25 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500' : ''}
        ${className}
      `}
    >
      {/* Subtle top edge highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brass/15 to-transparent" />
      {children}
    </div>
  );
}
