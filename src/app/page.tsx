'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import LuxuryIntro from '@/components/animations/LuxuryIntro';
import Parallax from '@/components/animations/Parallax';
import SteamEffect from '@/components/ui/SteamEffect';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { OrnamentalDivider, SectionReveal, JaaliOverlay } from '@/components/ornamental';
import Link from 'next/link';

const EASE = [0.22, 1, 0.36, 1] as const;

const HERO_FEATURES = [
  { title: 'Rajasthani Thalis', desc: 'Maharaja, Sada, Ghee & Maharani Thalis' },
  { title: 'Pure Vegetarian', desc: 'Marwari & Jain food, no onion & garlic' },
  { title: 'Authentic Flavors', desc: 'Dal Baati, Traditional Combos, Lassi & Chaach' },
];

const SPECIALS = [
  { name: 'Maharaja Thali', hindi: 'महाराजा थाली', price: '₹310', tag: 'Signature', note: 'Dine-In', image: '/images/menu/thali-1.jpg' },
  { name: 'Dal Baati Combo', hindi: 'दाल बाटी कॉम्बो', price: '₹99', tag: 'Traditional', note: 'Dine-In', image: '/images/menu/dal-baati.jpg' },
  { name: 'Sada Thali', hindi: 'सादा थाली', price: '₹220', tag: 'Popular', note: 'Dine-In', image: '/images/menu/thali-2.jpg' },
];

const HERO_IMAGES = [
  '/images/menu/thali-3.jpg',
  '/images/menu/dal-baati.jpg',
  '/images/menu/lassi.jpg',
];

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);
  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);

  return (
    <>
      <LuxuryIntro onComplete={handleIntroComplete} />
      <AnimatePresence>
        {introComplete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>

            {/* ═══════════ Hero Section ═══════════ */}
            <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
              {/* Background layers */}
              <div className="absolute inset-0 bg-warm-black" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(181,144,60,0.05)_0%,transparent_60%)]" />
              <JaaliOverlay opacity={0.025} />

              {/* Floating food image accents (blurred, decorative) */}
              <div className="absolute top-24 left-[5%] w-72 h-72 rounded-full overflow-hidden opacity-[0.06] blur-sm float-gentle pointer-events-none">
                <Image src={HERO_IMAGES[0]} alt="" fill className="object-cover" sizes="288px" />
              </div>
              <div className="absolute bottom-24 right-[5%] w-80 h-80 rounded-full overflow-hidden opacity-[0.05] blur-sm float-gentle pointer-events-none" style={{ animationDelay: '2s' }}>
                <Image src={HERO_IMAGES[1]} alt="" fill className="object-cover" sizes="320px" />
              </div>
              <div className="absolute top-1/2 right-[20%] w-48 h-48 rounded-full overflow-hidden opacity-[0.04] blur-sm float-gentle pointer-events-none" style={{ animationDelay: '4s' }}>
                <Image src={HERO_IMAGES[2]} alt="" fill className="object-cover" sizes="192px" />
              </div>

              {/* Floating orbs */}
              <div className="absolute top-32 left-[10%] w-48 h-48 rounded-full bg-brass/[0.03] blur-3xl float-gentle" />
              <div className="absolute bottom-32 right-[10%] w-64 h-64 rounded-full bg-maroon/[0.04] blur-3xl float-gentle" style={{ animationDelay: '2s' }} />

              {/* Content */}
              <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                {/* Top ornamental line */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '160px' }}
                  transition={{ delay: 0.3, duration: 1.5, ease: EASE }}
                  className="h-px bg-gradient-to-r from-transparent via-brass/40 to-transparent mx-auto mb-10"
                />

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-brass/60 uppercase tracking-[0.4em] text-[11px] mb-8 font-body"
                >
                  Authentic Rajasthani Restaurant in Agra
                </motion.p>

                {/* Main heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 1, ease: EASE }}
                  className="text-5xl md:text-6xl lg:text-7xl font-serif text-ivory leading-[0.95] tracking-[0.02em]"
                >
                  Chokho Jeeman
                </motion.h1>

                {/* Hindi name */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.8 }}
                  className="mt-4 text-xl md:text-2xl text-brass/30 font-body tracking-wide"
                >
                  चोखो जीमण
                </motion.p>

                {/* Decorative line under heading */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '240px' }}
                  transition={{ delay: 1.2, duration: 1.5, ease: EASE }}
                  className="h-px bg-gradient-to-r from-transparent via-brass/30 to-transparent mt-8 mx-auto"
                />

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                  className="mt-8 text-lg md:text-xl text-ivory/55 max-w-2xl mx-auto leading-relaxed font-body font-light text-balance"
                >
                  Experience authentic vegetarian Rajasthani, Marwari, and Jain food.
                  Featuring traditional thalis, Dal Baati style dishes, lassi, chaach, and onion-free options.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, duration: 0.8 }}
                  className="mt-12 flex gap-5 justify-center flex-wrap"
                >
                  <Link href="/reservation">
                    <AnimatedButton>Reserve a Table</AnimatedButton>
                  </Link>
                  <Link href="/menu">
                    <AnimatedButton variant="outline">Explore Menu</AnimatedButton>
                  </Link>
                </motion.div>

                {/* Bottom ornamental dots */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2, duration: 0.6 }}
                  className="flex items-center justify-center gap-2 mt-16"
                >
                  <div className="w-1 h-1 rounded-full bg-brass/20" />
                  <div className="w-1 h-1 rounded-full bg-brass/30" />
                  <div className="w-1.5 h-1.5 rounded-full bg-brass/40" />
                  <div className="w-1 h-1 rounded-full bg-brass/30" />
                  <div className="w-1 h-1 rounded-full bg-brass/20" />
                </motion.div>
              </div>
            </section>

            {/* ═══════════ Features Section ═══════════ */}
            <section className="py-28 px-6 relative">
              <JaaliOverlay opacity={0.015} />
              <div className="max-w-6xl mx-auto relative z-10">
                <SectionReveal>
                  <div className="text-center mb-16">
                    <p className="text-brass/50 uppercase tracking-[0.3em] text-xs mb-5 font-body">The Experience</p>
                    <h2 className="text-3xl md:text-5xl font-serif text-ivory">A Royal Affair</h2>
                    <OrnamentalDivider variant="short" className="mt-6" />
                  </div>
                </SectionReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {HERO_FEATURES.map((feat, idx) => (
                    <SectionReveal key={feat.title} delay={idx * 0.15}>
                      <GlassCard hover className="p-10 text-center h-full group">
                        <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-brass/5 border border-brass/15 flex items-center justify-center group-hover:border-brass/30 group-hover:bg-brass/8 transition-all duration-500">
                          <SteamEffect className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-serif text-ivory/90 mb-3 tracking-wide">{feat.title}</h3>
                        <p className="text-ivory/40 text-sm leading-relaxed font-body">{feat.desc}</p>
                      </GlassCard>
                    </SectionReveal>
                  ))}
                </div>
              </div>
            </section>

            <OrnamentalDivider className="py-2" />

            {/* ═══════════ Specials Section ═══════════ */}
            <section className="py-28 px-6 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-warm-dark/50 to-transparent" />
              <div className="max-w-5xl mx-auto relative z-10">
                <SectionReveal>
                  <div className="text-center mb-16">
                    <p className="text-brass/50 uppercase tracking-[0.3em] text-xs mb-5 font-body">Today&apos;s Highlights</p>
                    <h2 className="text-3xl md:text-5xl font-serif text-ivory">Specials</h2>
                    <OrnamentalDivider variant="short" className="mt-6" />
                  </div>
                </SectionReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {SPECIALS.map((item, idx) => (
                    <SectionReveal key={item.name} delay={idx * 0.12}>
                      <motion.div
                        whileHover={{ y: -6 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="relative group"
                      >
                        <GlassCard hover className="overflow-hidden">
                          {/* Food image */}
                          <div className="relative h-44 overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-warm-dark/90 via-warm-dark/20 to-transparent" />
                            {/* Price badge */}
                            <div className="absolute bottom-3 left-3 z-10">
                              <span className="bg-warm-black/60 backdrop-blur-sm text-brass font-serif text-lg px-3 py-1 rounded-sm border border-brass/20">
                                {item.price}
                              </span>
                            </div>
                          </div>

                          <div className="p-6">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] uppercase tracking-[0.2em] text-brass/60 bg-brass/5 px-3 py-1.5 rounded-sm border border-brass/10">
                                {item.tag}
                              </span>
                            </div>
                            <h3 className="text-xl font-serif text-ivory/90 group-hover:text-ivory transition-colors duration-300">
                              {item.name}
                            </h3>
                            <p className="text-ivory/30 text-sm font-body mt-1">{item.hindi}</p>
                            <p className="text-ivory/25 text-[10px] uppercase tracking-[0.15em] font-body mt-1">{item.note}</p>
                            <div className="mt-4 h-px w-8 bg-brass/20 group-hover:w-16 transition-all duration-700" />
                          </div>
                        </GlassCard>
                      </motion.div>
                    </SectionReveal>
                  ))}
                </div>
              </div>
            </section>

            {/* ═══════════ CTA Section ═══════════ */}
            <section className="py-28 px-6 relative">
              <JaaliOverlay opacity={0.01} />
              <div className="max-w-3xl mx-auto text-center relative z-10">
                <Parallax offset={25}>
                  <SectionReveal>
                    <GlassCard className="p-12 md:p-16">
                      <h2 className="text-3xl md:text-5xl font-serif text-ivory mb-4 text-balance">
                        Begin Your Journey
                      </h2>
                      <OrnamentalDivider variant="dot" className="mb-8" />
                      <p className="text-ivory/40 text-lg mb-10 font-body font-light max-w-lg mx-auto">
                        Join the waitlist or reserve your table for an authentic Rajasthani dining experience.
                      </p>
                      <div className="flex gap-5 justify-center flex-wrap">
                        <Link href="/reservation">
                          <AnimatedButton>Book Now</AnimatedButton>
                        </Link>
                        <Link href="/queue">
                          <AnimatedButton variant="outline">Join Queue</AnimatedButton>
                        </Link>
                      </div>
                    </GlassCard>
                  </SectionReveal>
                </Parallax>
              </div>
            </section>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
