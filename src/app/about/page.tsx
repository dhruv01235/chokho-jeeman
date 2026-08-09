'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import GlassCard from "@/components/ui/GlassCard";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { OrnamentalDivider, SectionReveal, JaaliOverlay } from "@/components/ornamental";
import { RESTAURANT } from "@/lib/restaurant";

const EASE = [0.22, 1, 0.36, 1] as const;

const HIGHLIGHTS = [
  {
    icon: '📍',
    title: 'Location',
    lines: [RESTAURANT.address.street, RESTAURANT.address.area, `${RESTAURANT.address.city}, ${RESTAURANT.address.state}`],
    link: RESTAURANT.address.googleMaps,
    linkLabel: 'Get Directions',
  },
  {
    icon: '☎',
    title: 'Phone',
    lines: RESTAURANT.phones.map(p => p.display),
    link: RESTAURANT.phones[0].tel,
    linkLabel: 'Call Now',
  },
  {
    icon: '✉',
    title: 'Email',
    lines: [RESTAURANT.email],
    link: `mailto:${RESTAURANT.email}`,
    linkLabel: 'Email Us',
  },
  {
    icon: '🚚',
    title: 'Delivery',
    lines: RESTAURANT.delivery.display,
    link: null,
    linkLabel: null,
  },
  {
    icon: '💳',
    title: 'Payment',
    lines: [...RESTAURANT.payments],
    link: null,
    linkLabel: null,
  },
  {
    icon: '📱',
    title: 'Facebook',
    lines: [RESTAURANT.facebook.display],
    link: RESTAURANT.facebook.url,
    linkLabel: 'Follow Us',
  },
];

const FOOD_ITEMS = [
  { name: 'Maharaja Thali', image: '/images/menu/thali-1.jpg' },
  { name: 'Sada Thali', image: '/images/menu/thali-2.jpg' },
  { name: 'Dal Baati', image: '/images/menu/dal-baati.jpg' },
  { name: 'Maharani Thali', image: '/images/menu/thali-3.jpg' },
  { name: 'Ghee Thali', image: '/images/menu/thali-4.jpg' },
  { name: 'Traditional Breakfast', image: '/images/menu/kachori.jpg' },
  { name: 'Lassi & Chaach', image: '/images/menu/lassi.jpg' },
  { name: 'Takeaway Combos', image: '/images/menu/thali-5.jpg' },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <JaaliOverlay opacity={0.015} />

      {/* ═══════════ Cinematic Hero ═══════════ */}
      <section className="relative min-h-[55vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-warm-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(181,144,60,0.06)_0%,transparent_70%)]" />

        {/* Floating ornaments */}
        <div className="absolute top-20 left-[15%] w-40 h-40 rounded-full bg-brass/[0.03] blur-3xl float-gentle" />
        <div className="absolute bottom-20 right-[15%] w-56 h-56 rounded-full bg-maroon/[0.04] blur-3xl float-gentle" style={{ animationDelay: '3s' }} />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '120px' }}
            transition={{ delay: 0.3, duration: 1.5, ease: EASE }}
            className="h-px bg-gradient-to-r from-transparent via-brass/40 to-transparent mx-auto mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-brass/50 uppercase tracking-[0.4em] text-xs mb-6 font-body"
          >
            {RESTAURANT.tagline}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1, ease: EASE }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif text-ivory leading-[0.92] text-balance"
          >
            About {RESTAURANT.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-6 text-xl md:text-2xl text-ivory/70 font-body"
          >
            {RESTAURANT.fullHindiName}
          </motion.p>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '200px' }}
            transition={{ delay: 1.5, duration: 1.5, ease: EASE }}
            className="h-px bg-gradient-to-r from-transparent via-brass/25 to-transparent mt-8 mx-auto"
          />
        </div>
      </section>

      {/* ═══════════ Introduction ═══════════ */}
      <section className="py-20 px-6 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <SectionReveal>
            <GlassCard className="p-10 md:p-14 text-center">
              <p className="text-lg md:text-xl text-ivory/55 leading-relaxed font-body font-light text-balance">
                {RESTAURANT.description} We offer food options without onion and garlic.
                Our menu features traditional Rajasthani thalis, Dal Baati combos, traditional breakfast items, and more.
              </p>
            </GlassCard>
          </SectionReveal>
        </div>
      </section>

      <OrnamentalDivider className="py-2" />

      {/* ═══════════ Our Food ═══════════ */}
      <section className="py-20 px-6 relative">
        <div className="max-w-5xl mx-auto relative z-10">
          <SectionReveal>
            <div className="text-center mb-12">
              <p className="text-brass/50 uppercase tracking-[0.3em] text-xs mb-5 font-body">Culinary Offerings</p>
              <h2 className="text-3xl md:text-4xl font-serif text-ivory">Our Food</h2>
              <OrnamentalDivider variant="short" className="mt-6" />
            </div>
          </SectionReveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {FOOD_ITEMS.map((item, idx) => (
              <SectionReveal key={item.name} delay={idx * 0.08}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="relative group overflow-hidden rounded-lg cursor-pointer aspect-[4/3]"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-warm-black/80 via-warm-black/20 to-transparent group-hover:from-warm-black/90 transition-all duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-ivory/80 text-sm font-serif group-hover:text-ivory transition-colors duration-300">{item.name}</p>
                  </div>
                  {/* Corner ornament */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-4 h-4 border border-brass/30 rotate-45" />
                  </div>
                </motion.div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <OrnamentalDivider className="py-2" />

      {/* ═══════════ At a Glance ═══════════ */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-warm-dark/30 to-transparent" />
        <div className="max-w-6xl mx-auto relative z-10">
          <SectionReveal>
            <div className="text-center mb-14">
              <p className="text-brass/50 uppercase tracking-[0.3em] text-xs mb-5 font-body">Information</p>
              <h2 className="text-3xl md:text-4xl font-serif text-ivory">{RESTAURANT.name} at a Glance</h2>
              <OrnamentalDivider variant="short" className="mt-6" />
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {HIGHLIGHTS.map((h, idx) => (
              <SectionReveal key={h.title} delay={idx * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="relative group"
                >
                  <GlassCard hover className="p-7 h-full">
                    {/* Top accent line */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-full h-px bg-gradient-to-r from-transparent via-brass/40 to-transparent transition-all duration-700" />

                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{h.icon}</span>
                      <h3 className="text-base font-serif text-ivory/80 group-hover:text-ivory transition-colors duration-300">{h.title}</h3>
                    </div>

                    <div className="space-y-1 mb-4">
                      {h.lines.map((line, i) => (
                        <p key={i} className="text-ivory/70 text-sm font-body leading-relaxed">{line}</p>
                      ))}
                    </div>

                    {h.link && (
                      <a
                        href={h.link}
                        target={h.link.startsWith('http') ? '_blank' : undefined}
                        rel={h.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="inline-block text-[11px] uppercase tracking-[0.15em] text-brass/60 hover:text-brass font-body transition-colors duration-300"
                      >
                        {h.linkLabel} →
                      </a>
                    )}

                    {/* Payment tags */}
                    {h.title === 'Payment' && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {RESTAURANT.payments.map((p) => (
                          <span key={p} className="text-[10px] text-ivory/80 bg-warm-dark/70 px-2 py-0.5 rounded-sm border border-brass/10 font-body">
                            {p}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Brass shimmer on hover */}
                    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(181,144,60,0.03)_0%,transparent_70%)]" />
                  </GlassCard>
                </motion.div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <OrnamentalDivider className="py-2" />

      {/* ═══════════ Delivery & Takeaway ═══════════ */}
      <section className="py-20 px-6 relative">
        <div className="max-w-3xl mx-auto relative z-10">
          <SectionReveal>
            <GlassCard className="p-10 md:p-14 text-center">
              <p className="text-brass/50 uppercase tracking-[0.3em] text-xs mb-5 font-body">Take Away & Delivery</p>
              <h2 className="text-2xl md:text-3xl font-serif text-ivory mb-6">Delivery Timing</h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
                <div className="bg-warm-dark/50 border border-brass/10 rounded-lg px-8 py-5 hover:border-brass/20 transition-colors duration-300">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brass/50 font-body mb-2">Lunch</p>
                  <p className="text-ivory/70 font-serif text-lg">{RESTAURANT.delivery.lunch.start} – {RESTAURANT.delivery.lunch.end}</p>
                </div>
                <div className="bg-warm-dark/50 border border-brass/10 rounded-lg px-8 py-5 hover:border-brass/20 transition-colors duration-300">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brass/50 font-body mb-2">Dinner</p>
                  <p className="text-ivory/70 font-serif text-lg">{RESTAURANT.delivery.dinner.start} – {RESTAURANT.delivery.dinner.end}</p>
                </div>
              </div>
              <p className="text-ivory/70 text-sm font-body">
                Takeaway & delivery available at {RESTAURANT.address.city}
              </p>
            </GlassCard>
          </SectionReveal>
        </div>
      </section>

      <OrnamentalDivider className="py-2" />

      {/* ═══════════ Contact CTA ═══════════ */}
      <section className="py-20 px-6 relative">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <SectionReveal>
            <h2 className="text-3xl md:text-4xl font-serif text-ivory mb-4">
              Visit {RESTAURANT.name}
            </h2>
            <p className="text-ivory/75 font-body text-lg mb-10 text-balance">
              {RESTAURANT.address.street}, {RESTAURANT.address.area}, {RESTAURANT.address.city}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href={RESTAURANT.phones[0].tel}>
                <AnimatedButton>Call Now</AnimatedButton>
              </a>
              <a href={`mailto:${RESTAURANT.email}`}>
                <AnimatedButton variant="outline">Email Us</AnimatedButton>
              </a>
              <a href={RESTAURANT.address.googleMaps} target="_blank" rel="noopener noreferrer">
                <AnimatedButton variant="outline">Get Directions</AnimatedButton>
              </a>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ═══════════ Facebook CTA ═══════════ */}
      <section className="py-12 px-6 relative">
        <div className="max-w-xl mx-auto text-center relative z-10">
          <SectionReveal>
            <GlassCard className="p-8">
              <p className="text-ivory/70 font-body text-sm mb-4">Follow us on</p>
              <a
                href={RESTAURANT.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-brass hover:text-brass-light transition-colors duration-300"
              >
                <span className="text-2xl">📘</span>
                <span className="font-serif text-lg">{RESTAURANT.facebook.display}</span>
              </a>
            </GlassCard>
          </SectionReveal>
        </div>
      </section>

      {/* ═══════════ Rating ═══════════ */}
      <section className="py-12 px-6 relative">
        <div className="max-w-xl mx-auto text-center relative z-10">
          <SectionReveal>
            <GlassCard className="p-8">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full border border-brass/20 flex flex-col items-center justify-center hover:border-brass/35 transition-colors duration-500">
                    <span className="text-2xl font-serif text-brass">{RESTAURANT.rating.value}</span>
                    <span className="text-[9px] uppercase tracking-[0.15em] text-brass/50 font-body mt-0.5">/ 5</span>
                  </div>
                  <p className="text-[10px] text-ivory/70 mt-2 font-body">{RESTAURANT.rating.reviews.toLocaleString()} reviews</p>
                </div>
                <div className="text-left">
                  <p className="text-ivory/75 text-sm font-body leading-relaxed">
                    Rated {RESTAURANT.rating.value} out of 5 stars based on {RESTAURANT.rating.reviews.toLocaleString()} reviews.
                  </p>
                </div>
              </div>
            </GlassCard>
          </SectionReveal>
        </div>
      </section>

      <OrnamentalDivider className="mt-8" />
    </div>
  );
}
