'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
}

export default function AnimatedButton({
  children,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
  variant = 'primary',
}: AnimatedButtonProps) {
  const base =
    'relative px-8 py-3.5 font-serif text-sm uppercase tracking-[0.2em] rounded-sm overflow-hidden transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-gradient-to-r from-brass to-brass-light text-warm-black hover:from-brass-light hover:to-brass shadow-[0_2px_16px_rgba(181,144,60,0.2)] hover:shadow-[0_4px_24px_rgba(181,144,60,0.35)]',
    outline:
      'border border-brass/40 text-brass hover:bg-brass/5 hover:border-brass/60',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.015 }}
      whileTap={disabled ? {} : { scale: 0.985 }}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {/* Subtle shimmer overlay on hover */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
