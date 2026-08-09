'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { OrnamentalDivider, SectionReveal, JaaliOverlay } from '@/components/ornamental';
import { RESTAURANT } from '@/lib/restaurant';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen">
      <JaaliOverlay opacity={0.015} />
      <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <SectionReveal>
          <div className="text-center mb-16">
            <p className="text-brass/70 uppercase tracking-[0.3em] text-xs mb-5 font-body font-semibold">Get in Touch</p>
            <h1 className="text-4xl md:text-6xl font-serif text-ivory mb-4">Contact Us</h1>
            <p className="text-ivory/75 font-body text-lg font-medium">{RESTAURANT.fullHindiName}</p>
            <OrnamentalDivider variant="short" className="mt-8" />
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Info cards */}
          <div className="space-y-5">
            {/* Contact */}
            <SectionReveal delay={0.1}>
              <GlassCard className="p-7">
                <h3 className="text-sm font-serif text-brass/80 mb-4 uppercase tracking-[0.15em] font-semibold">Contact Us</h3>
                <div className="space-y-3 text-sm font-body">
                  {RESTAURANT.phones.map((phone) => (
                    <a key={phone.number} href={phone.tel} className="flex items-center gap-2 text-ivory/80 hover:text-brass transition-colors duration-300 font-medium">
                      <span className="text-brass/70">☎</span> {phone.display}
                    </a>
                  ))}
                  <a href={`mailto:${RESTAURANT.email}`} className="flex items-center gap-2 text-ivory/80 hover:text-brass transition-colors duration-300 pt-1 font-medium">
                    <span className="text-brass/70">✉</span> {RESTAURANT.email}
                  </a>
                </div>
              </GlassCard>
            </SectionReveal>

            {/* Visit Us */}
            <SectionReveal delay={0.15}>
              <GlassCard className="p-7">
                <h3 className="text-sm font-serif text-brass/80 mb-4 uppercase tracking-[0.15em] font-semibold">Visit Us</h3>
                <div className="text-ivory/80 text-sm space-y-1 font-body">
                  <p>{RESTAURANT.address.street}</p>
                  <p>{RESTAURANT.address.area}</p>
                  <p>{RESTAURANT.address.city}, {RESTAURANT.address.state}</p>
                </div>
                <a
                  href={RESTAURANT.address.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-[11px] uppercase tracking-[0.15em] text-brass hover:text-brass-light font-body font-semibold transition-colors duration-300"
                >
                  Get Directions →
                </a>
              </GlassCard>
            </SectionReveal>

            {/* Delivery */}
            <SectionReveal delay={0.2}>
              <GlassCard className="p-7">
                <h3 className="text-sm font-serif text-brass/80 mb-4 uppercase tracking-[0.15em] font-semibold">🚚 Delivery</h3>
                <div className="text-ivory/80 text-sm space-y-1 font-body">
                  {RESTAURANT.delivery.display.map((t) => (
                    <p key={t}>{t}</p>
                  ))}
                </div>
              </GlassCard>
            </SectionReveal>

            {/* Payment */}
            <SectionReveal delay={0.25}>
              <GlassCard className="p-7">
                <h3 className="text-sm font-serif text-brass/80 mb-4 uppercase tracking-[0.15em] font-semibold">💳 Payment Options</h3>
                <div className="flex flex-wrap gap-2">
                  {RESTAURANT.payments.map((p) => (
                    <span key={p} className="text-xs text-ivory/85 bg-warm-dark/70 px-3 py-1.5 rounded-sm border border-brass/15 font-body">
                      {p}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </SectionReveal>

            {/* Social */}
            <SectionReveal delay={0.3}>
              <GlassCard className="p-7">
                <h3 className="text-sm font-serif text-brass/80 mb-4 uppercase tracking-[0.15em] font-semibold">Social</h3>
                <a
                  href={RESTAURANT.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-ivory/80 hover:text-brass text-sm font-body font-medium transition-colors duration-300"
                >
                  <span>📘</span> {RESTAURANT.facebook.display}
                </a>
              </GlassCard>
            </SectionReveal>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <SectionReveal delay={0.15}>
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: EASE }}>
                  <GlassCard className="p-14 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                      className="w-16 h-16 mx-auto mb-6 rounded-full bg-brass/10 border border-brass/20 flex items-center justify-center text-brass text-2xl"
                    >
                      ✓
                    </motion.div>
                    <h2 className="text-2xl font-serif text-ivory/90 mb-3">Message Sent</h2>
                    <p className="text-ivory/70 font-body">Thank you for reaching out. We will get back to you soon.</p>
                  </GlassCard>
                </motion.div>
              ) : (
                <GlassCard className="p-10">
                  <h3 className="text-lg font-serif text-ivory mb-8">Send a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <input
                        type="text"
                        placeholder="Your Name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-sm bg-warm-dark/80 border border-brass/15 text-ivory placeholder-ivory/40 focus:outline-none focus:border-brass/50 focus:shadow-[0_0_0_3px_rgba(181,144,60,0.1)] transition-all duration-300 font-body text-sm"
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-sm bg-warm-dark/80 border border-brass/15 text-ivory placeholder-ivory/40 focus:outline-none focus:border-brass/50 focus:shadow-[0_0_0_3px_rgba(181,144,60,0.1)] transition-all duration-300 font-body text-sm"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-sm bg-warm-dark/80 border border-brass/15 text-ivory placeholder-ivory/40 focus:outline-none focus:border-brass/50 focus:shadow-[0_0_0_3px_rgba(181,144,60,0.1)] transition-all duration-300 font-body text-sm"
                    />
                    <textarea
                      placeholder="Your Message"
                      rows={6}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-sm bg-warm-dark/80 border border-brass/15 text-ivory placeholder-ivory/40 focus:outline-none focus:border-brass/50 focus:shadow-[0_0_0_3px_rgba(181,144,60,0.1)] transition-all duration-300 resize-none font-body text-sm"
                    />
                    <AnimatedButton type="submit" className="w-full">Send Message</AnimatedButton>
                  </form>
                </GlassCard>
              )}
            </SectionReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
