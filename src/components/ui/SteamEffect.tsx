'use client';

import { motion } from 'framer-motion';

export default function SteamEffect({ className = '' }: { className?: string }) {
  const particles = [
    { id: 0, delay: 0, x: -3, scale: 1 },
    { id: 1, delay: 0.5, x: 3, scale: 0.8 },
    { id: 2, delay: 1.0, x: -1, scale: 0.6 },
    { id: 3, delay: 1.5, x: 4, scale: 0.9 },
    { id: 4, delay: 2.0, x: -4, scale: 0.7 },
  ];

  return (
    <div className={`relative ${className}`}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bottom-0 rounded-full"
          style={{
            width: `${2 * p.scale}px`,
            height: `${12 * p.scale}px`,
            background: 'linear-gradient(to top, rgba(181,144,60,0.15), transparent)',
            filter: 'blur(1px)',
          }}
          initial={{ y: 0, x: p.x, opacity: 0 }}
          animate={{ y: -30, opacity: [0, 0.3, 0] }}
          transition={{
            duration: 2.5,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
