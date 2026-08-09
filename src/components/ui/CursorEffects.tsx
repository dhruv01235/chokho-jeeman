'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CursorEffects() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };
    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [visible]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[99] hidden lg:block">
      {/* Outer ring */}
      <motion.div
        className="w-8 h-8 rounded-full border border-brass/20"
        animate={{
          x: position.x - 16,
          y: position.y - 16,
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, mass: 0.5 }}
      />
      {/* Center dot */}
      <motion.div
        className="absolute w-1 h-1 rounded-full bg-brass/50"
        animate={{
          x: position.x - 2,
          y: position.y - 2,
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 800, damping: 30 }}
      />
    </div>
  );
}
