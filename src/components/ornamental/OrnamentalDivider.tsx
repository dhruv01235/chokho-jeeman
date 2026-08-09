'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface OrnamentalDividerProps {
  className?: string;
  variant?: 'full' | 'short' | 'dot';
}

export default function OrnamentalDivider({ className = '', variant = 'full' }: OrnamentalDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  if (variant === 'dot') {
    return (
      <div ref={ref} className={`flex items-center justify-center gap-3 py-4 ${className}`}>
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-1.5 h-1.5 rounded-full bg-brass/60"
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-2 h-2 rounded-full bg-brass"
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-1.5 h-1.5 rounded-full bg-brass/60"
        />
      </div>
    );
  }

  const width = variant === 'short' ? 'max-w-xs' : 'max-w-lg';

  return (
    <div ref={ref} className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 400 24" className={`${width} w-full h-6`}>
        {/* Left line */}
        <motion.line
          x1="0" y1="12" x2="160" y2="12"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-brass/40"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.2, ease: 'easeInOut' }}
        />
        {/* Center diamond ornament */}
        <motion.polygon
          points="188,4 200,12 188,20 176,12"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          className="text-brass/60"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{ transformOrigin: '188px 12px' }}
        />
        <motion.circle
          cx="188" cy="12" r="2"
          className="fill-brass/50"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.9 }}
        />
        {/* Right line */}
        <motion.line
          x1="212" y1="12" x2="400" y2="12"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-brass/40"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.2, ease: 'easeInOut' }}
        />
        {/* Left small dot */}
        <motion.circle
          cx="168" cy="12" r="1.5"
          className="fill-brass/30"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.8 }}
        />
        {/* Right small dot */}
        <motion.circle
          cx="212" cy="12" r="1.5"
          className="fill-brass/30"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.8 }}
        />
      </svg>
    </div>
  );
}
