'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function LuxuryIntro({ onComplete }: { onComplete: () => void }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onComplete();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-warm-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
          {/* Jaali pattern background */}
          <div className="absolute inset-0 mandana-dots opacity-30" />

          {/* Radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(181,144,60,0.06)_0%,transparent_60%)]" />

          <div className="text-center relative z-10">
            {/* Ornamental top line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '120px' }}
              transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="h-px bg-gradient-to-r from-transparent via-brass/50 to-transparent mx-auto mb-10"
            />

            {/* Diamond ornament */}
            <motion.div
              initial={{ scale: 0, rotate: 45 }}
              animate={{ scale: 1, rotate: 45 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="w-12 h-12 border border-brass/40 mx-auto mb-10 flex items-center justify-center"
            >
              <div className="w-4 h-4 bg-brass/20 -rotate-45" />
            </motion.div>

            {/* Restaurant name */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-7xl font-serif text-ivory tracking-[0.08em]"
            >
              CHOKHO JEEMAN
            </motion.h1>

            {/* Ornamental bottom line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '200px' }}
              transition={{ delay: 1.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="h-px bg-gradient-to-r from-transparent via-brass/40 to-transparent mt-6 mx-auto"
            />

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="mt-6 text-brass/60 uppercase tracking-[0.35em] text-xs font-body"
            >
              Authentic Rajasthani Food
            </motion.p>

            {/* Bottom dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.6 }}
              className="flex items-center justify-center gap-2 mt-8"
            >
              <div className="w-1 h-1 rounded-full bg-brass/30" />
              <div className="w-1.5 h-1.5 rounded-full bg-brass/50" />
              <div className="w-1 h-1 rounded-full bg-brass/30" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
