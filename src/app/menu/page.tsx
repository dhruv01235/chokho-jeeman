'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OrnamentalDivider, SectionReveal, JaaliOverlay } from '@/components/ornamental';
import FoodIllustration from '@/components/food/FoodIllustration';
import {
  ALL_MENU_ITEMS,
  MENU_SECTIONS,
  FILTER_CATEGORIES,
  type FilterCategory,
  type MenuItem,
  type MenuSection,
} from '@/data/menu-data';

const EASE = [0.22, 1, 0.36, 1] as const;

function SectionHeader({ title, subtitle, timing, rules }: { title: string; subtitle: string; timing?: string; rules?: string[] }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brass/20 to-transparent" />
        <span className="text-[10px] uppercase tracking-[0.25em] text-brass/50 font-body">{subtitle}</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brass/20 to-transparent" />
      </div>
      <h2 className="text-2xl md:text-3xl font-serif text-ivory text-center">{title}</h2>
      {timing && (
        <p className="text-center text-brass/60 text-sm font-body mt-2">{timing}</p>
      )}
      {rules && rules.length > 0 && (
        <div className="mt-4 max-w-2xl mx-auto space-y-2">
          {rules.map((rule, i) => (
            <p key={i} className="text-ivory/35 text-xs leading-relaxed font-body text-center italic">
              {rule}
            </p>
          ))}
        </div>
      )}
      <OrnamentalDivider variant="short" className="mt-6" />
    </div>
  );
}

function MenuItemCard({ item }: { item: MenuItem }) {
  const [expanded, setExpanded] = useState(false);
  const hasIncluded = item.includedItems && item.includedItems.length > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="group"
    >
      <div className="relative bg-gradient-to-br from-warm-mid/70 via-warm-dark/60 to-warm-mid/70 backdrop-blur-sm border border-brass/8 rounded-lg overflow-hidden hover:border-brass/20 hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)] transition-all duration-500">
        {/* Top accent line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-full h-px bg-gradient-to-r from-transparent via-brass/40 to-transparent transition-all duration-700 z-10" />

        {/* Image — consistent aspect ratio */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <FoodIllustration
            type={item.imageType}
            imageUrl={item.imageUrl}
            imageAlt={item.imageAlt}
            className="w-full h-full group-hover:scale-[1.03] transition-transform duration-700"
          />
          {/* Hover darkening */}
          <div className="absolute inset-0 bg-warm-black/0 group-hover:bg-warm-black/10 transition-colors duration-500" />
          {/* Signature badge */}
          {item.isSignature && (
            <div className="absolute top-3 left-3 bg-brass/90 text-warm-black text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-sm font-body font-semibold z-10 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
              Signature
            </div>
          )}
          {/* Weekend badge */}
          {item.availability === 'weekend-only' && (
            <div className="absolute top-3 right-3 bg-maroon/80 text-ivory/90 text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-sm font-body z-10 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
              Weekend Only
            </div>
          )}
          {/* Takeaway badge */}
          {item.context === 'takeaway' && (
            <div className="absolute bottom-3 right-3 bg-warm-black/70 text-ivory/70 text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-sm font-body backdrop-blur-sm z-10">
              Takeaway
            </div>
          )}
          {/* Price overlay */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="bg-warm-black/70 backdrop-blur-sm text-brass font-serif text-xl px-3 py-1 rounded-sm border border-brass/20 shadow-[0_2px_10px_rgba(0,0,0,0.4)]">
              ₹{item.price}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <div className="mb-3">
            <h3 className="text-lg font-serif text-ivory/90 group-hover:text-ivory transition-colors duration-300">
              {item.name}
            </h3>
            <p className="text-ivory/30 text-sm font-body mt-0.5">{item.hindiName}</p>
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-ivory/40 text-sm leading-relaxed font-body mt-2">{item.description}</p>
          )}

          {/* Included items preview */}
          {hasIncluded && (
            <div className="mt-3">
              <p className="text-ivory/30 text-xs font-body">
                {item.includedItems!.slice(0, 4).join(' · ')}
                {item.includedItems!.length > 4 && ` · +${item.includedItems!.length - 4} more`}
              </p>
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 text-brass/60 hover:text-brass text-[11px] uppercase tracking-[0.15em] font-body transition-colors duration-300 flex items-center gap-1.5"
              >
                <span>{expanded ? "What's Included ↑" : "What's Included ↓"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Expanded included items */}
        <AnimatePresence>
          {expanded && hasIncluded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-5 pt-2 border-t border-brass/5">
                <div className="flex flex-wrap gap-2">
                  {item.includedItems!.map((inc, i) => (
                    <span
                      key={i}
                      className="text-xs font-body text-ivory/40 bg-warm-dark/50 px-2.5 py-1 rounded-sm border border-brass/5"
                    >
                      {inc}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function PackingSectionHeader() {
  return (
    <div className="mb-6 bg-warm-dark/40 rounded-lg border border-brass/8 p-5">
      <p className="text-[10px] uppercase tracking-[0.25em] text-brass/50 font-body mb-1">Takeaway & Delivery</p>
      <p className="text-ivory/50 text-sm font-body">चोखो जीमण (मारवाड़ी जैन भोजनालय)</p>
      <p className="text-ivory/35 text-xs font-body mt-1">1/48, राजामण्डी स्टेशन रोड, देहली गेट, आगरा</p>
      <p className="text-brass/60 text-xs font-body mt-1">11:00 AM – 3:30 PM · 7:00 PM – 10:30 PM</p>
    </div>
  );
}

interface DbMenuItem {
  id: string;
  name?: string;
  hindiName?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  imageAlt?: string;
}

export default function MenuPage() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [filterBarStuck, setFilterBarStuck] = useState(false);
  const [dbItems, setDbItems] = useState<DbMenuItem[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDbItems(data);
      })
      .catch(() => {});
  }, []);

  const dbMap = new Map(dbItems.map((db: DbMenuItem) => [db.id, db]));
  const mergedItems = ALL_MENU_ITEMS.map((item) => {
    const dbItem = dbMap.get(item.id);
    if (dbItem) {
      return {
        ...item,
        imageUrl: dbItem.imageUrl ?? item.imageUrl,
        imageAlt: dbItem.imageAlt ?? item.imageAlt,
        price: dbItem.price ? Number(dbItem.price) : item.price,
        name: dbItem.name || item.name,
        hindiName: dbItem.hindiName || item.hindiName,
        description: dbItem.description || item.description,
      };
    }
    return item;
  });

  function getItemsForSection(sectionId: MenuSection): MenuItem[] {
    return mergedItems.filter(item => item.section === sectionId);
  }

  function filterByCategory(items: MenuItem[], category: FilterCategory): MenuItem[] {
    if (category === 'all') return items;
    if (category === 'takeaway') return items.filter(i => i.context === 'takeaway');
    return items.filter(i => i.category === category);
  }

  useEffect(() => {
    const el = filterRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setFilterBarStuck(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const visibleSections = MENU_SECTIONS.filter(section => {
    const items = getItemsForSection(section.id);
    const filtered = filterByCategory(items, activeFilter);
    return filtered.length > 0;
  });

  return (
    <div className="relative min-h-screen">
      <JaaliOverlay opacity={0.015} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-20 relative z-10">
        {/* Header */}
        <SectionReveal>
          <div className="text-center mb-10">
            <p className="text-brass/50 uppercase tracking-[0.3em] text-xs mb-5 font-body">Pure Vegetarian</p>
            <h1 className="text-4xl md:text-6xl font-serif text-ivory mb-3">Menu</h1>
            <p className="text-ivory/40 font-body text-lg max-w-xl mx-auto text-balance">
              Marwari & Jain food · No onion & garlic options · Traditional Rajasthani thalis
            </p>
            <OrnamentalDivider variant="short" className="mt-8" />
          </div>
        </SectionReveal>

        {/* Filter bar — sentinel + sticky clone */}
        <div ref={filterRef} className="mb-8">
          <SectionReveal delay={0.1}>
            <div className="flex justify-center sm:justify-center gap-2 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
              {FILTER_CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveFilter(cat.key)}
                  className={`px-5 py-2 rounded-sm text-[11px] uppercase tracking-[0.2em] font-body transition-all duration-500 whitespace-nowrap shrink-0 ${
                    activeFilter === cat.key
                      ? 'bg-brass/90 text-warm-black shadow-[0_2px_12px_rgba(181,144,60,0.25)]'
                      : 'bg-warm-mid/50 border border-brass/10 text-ivory/50 hover:bg-warm-mid hover:text-ivory/70 hover:border-brass/20'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </SectionReveal>
        </div>

        {/* Sticky filter bar clone */}
        <AnimatePresence>
          {filterBarStuck && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="fixed top-20 left-0 right-0 z-40 glass-premium border-b border-brass/10 py-3 px-4"
            >
              <div className="max-w-6xl mx-auto flex justify-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
                {FILTER_CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveFilter(cat.key)}
                    className={`px-5 py-2 rounded-sm text-[11px] uppercase tracking-[0.2em] font-body transition-all duration-500 ${
                      activeFilter === cat.key
                        ? 'bg-brass/90 text-warm-black shadow-[0_2px_12px_rgba(181,144,60,0.25)]'
                        : 'bg-warm-mid/50 border border-brass/10 text-ivory/50 hover:bg-warm-mid hover:text-ivory/70 hover:border-brass/20'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Menu sections */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-16"
          >
            {visibleSections.map((section) => {
              const items = getItemsForSection(section.id);
              const filtered = filterByCategory(items, activeFilter);
              if (filtered.length === 0) return null;

              const isPackingSection = section.context === 'takeaway' && (section.id === 'packing-thali' || section.id === 'packing-combo');
              const isAdditional = section.id === 'additional-packing-1' || section.id === 'additional-packing-2';

              return (
                <section key={section.id}>
                  {isPackingSection && <PackingSectionHeader />}
                  <SectionHeader
                    title={section.title}
                    subtitle={section.subtitle}
                    timing={section.timing}
                    rules={section.rules}
                  />

                  {isAdditional ? (
                    /* Additional packing: two-column price list */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {filtered.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between bg-warm-mid/40 border border-brass/5 rounded-sm px-5 py-3.5 hover:border-brass/15 hover:bg-warm-mid/60 transition-all duration-300"
                        >
                          <div>
                            <span className="text-ivory/70 text-sm font-body">{item.hindiName}</span>
                            <span className="text-ivory/30 text-xs font-body ml-2">{item.name}</span>
                          </div>
                          <span className="text-brass font-serif text-base shrink-0 ml-4">₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Regular items: cards */
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      {filtered.map((item) => (
                        <MenuItemCard key={item.id} item={item} />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Footer note */}
        <div className="mt-16 text-center">
          <OrnamentalDivider variant="dot" className="mb-6" />
          <p className="text-ivory/25 text-xs font-body">
            Prices are inclusive of all taxes. Menu items and prices are subject to change.
          </p>
          <p className="text-ivory/20 text-xs font-body mt-1">
            Pure vegetarian · Marwari & Jain food · No onion & garlic options available
          </p>
        </div>
      </div>
    </div>
  );
}
