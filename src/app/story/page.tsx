'use client';
import { motion } from 'framer-motion';
import GlassCard from "@/components/ui/GlassCard";
import { OrnamentalDivider, SectionReveal, JaaliOverlay } from "@/components/ornamental";

const EASE = [0.22, 1, 0.36, 1] as const;

const STORY_CARDS = [
  {
    title: 'Traditional Thalis',
    description: 'Authentic vegetarian thalis including Maharaja Thali, Sada Thali, and Ghee Thali, plus takeaway combos and traditional breakfast items, crafted with care.',
  },
  {
    title: 'Pure & Wholesome',
    description: 'Pure vegetarian preparations with Marwari and Jain food options, including dishes without onion and garlic, served with lassi and chaach.',
  },
];

export default function StoryPage() {
  return (
    <div className="relative min-h-screen">
      <JaaliOverlay opacity={0.015} />
      <div className="max-w-5xl mx-auto px-6 py-20 relative z-10">
        <SectionReveal>
          <div className="text-center mb-16">
            <p className="text-brass/50 uppercase tracking-[0.3em] text-xs mb-5 font-body">Rajasthan</p>
            <h1 className="text-4xl md:text-6xl font-serif text-ivory mb-4">Our Heritage</h1>
            <p className="text-ivory/35 font-body text-lg max-w-xl mx-auto mt-4 text-balance">
              The culinary traditions of Rajasthan, brought to Agra with authenticity and care.
            </p>
            <OrnamentalDivider variant="short" className="mt-8" />
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <GlassCard className="p-10 md:p-14 mb-10">
            <p className="text-lg md:text-xl text-ivory/60 leading-relaxed font-body font-light text-center text-balance">
              Located in Agra, Chokho Jeeman is dedicated to serving authentic vegetarian Rajasthani, Marwari, and Jain food. We bring the genuine flavors and culinary traditions of Rajasthan to our patrons.
            </p>
          </GlassCard>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {STORY_CARDS.map((card, idx) => (
            <SectionReveal key={card.title} delay={0.2 + idx * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="relative group"
              >
                <GlassCard hover className="p-8 h-full">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-full h-px bg-gradient-to-r from-transparent via-brass/40 to-transparent transition-all duration-700" />
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-full bg-brass/5 border border-brass/15 flex items-center justify-center group-hover:border-brass/25 transition-colors duration-500">
                      <div className="w-2 h-2 rounded-full bg-brass/40" />
                    </div>
                    <h3 className="text-lg font-serif text-ivory/80 group-hover:text-ivory transition-colors duration-300">{card.title}</h3>
                  </div>
                  <p className="text-ivory/40 text-sm leading-relaxed font-body">
                    {card.description}
                  </p>
                </GlassCard>
              </motion.div>
            </SectionReveal>
          ))}
        </div>

        <OrnamentalDivider className="mt-16" />
      </div>
    </div>
  );
}
