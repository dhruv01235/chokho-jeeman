'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/story', label: 'Story' },
  { href: '/menu', label: 'Menu' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/reservation', label: 'Reservation' },
  { href: '/queue', label: 'Queue' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`border-b transition-all duration-700 ${
          scrolled
            ? 'glass-premium border-brass/15 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 border border-brass/50 rotate-45 flex items-center justify-center group-hover:border-brass/80 group-hover:shadow-[0_0_20px_rgba(181,144,60,0.2)] transition-all duration-500">
                <span className="text-brass font-serif text-sm -rotate-45 font-semibold">CJ</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-serif text-ivory tracking-[0.15em] leading-tight">
                CHOKHO JEEMAN
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-brass/75 leading-tight font-body font-medium">
                मारवाड़ी जैन भोजनालय
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 text-[12px] uppercase tracking-[0.15em] transition-colors duration-300 group font-medium ${
                    isActive ? 'text-ivory font-semibold' : 'text-ivory/70 hover:text-ivory'
                  }`}
                >
                  {link.label}
                  {/* Active underline */}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-brass transition-all duration-500 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
            <div className="w-px h-4 bg-brass/25 mx-2" />
            <Link
              href="/admin"
              className={`px-3.5 py-2 text-[12px] uppercase tracking-[0.15em] transition-colors duration-300 font-medium ${
                pathname === '/admin' ? 'text-brass font-semibold' : 'text-brass/70 hover:text-brass'
              }`}
            >
              Admin
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex flex-col gap-[5px] p-2 -mr-2"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="block w-6 h-px bg-ivory origin-center"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
              className="block w-6 h-px bg-ivory origin-center"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="block w-6 h-px bg-ivory origin-center"
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden glass-premium border-b border-brass/15 overflow-hidden"
          >
            <nav className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-0.5">
              {NAV_LINKS.map((link, i) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block py-3 px-4 text-sm uppercase tracking-[0.15em] rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'text-ivory bg-brass/10 border-l-2 border-brass font-semibold'
                          : 'text-ivory/75 hover:text-ivory hover:bg-brass/5'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              <div className="h-px bg-brass/15 my-2" />
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.04, duration: 0.3 }}
              >
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 px-4 text-sm uppercase tracking-[0.15em] text-brass hover:text-brass-light rounded-lg transition-all duration-300 font-medium"
                >
                  Admin Dashboard
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
