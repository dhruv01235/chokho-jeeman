'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { OrnamentalDivider, SectionReveal, JaaliOverlay } from '@/components/ornamental';

const EASE = [0.22, 1, 0.36, 1] as const;

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  aspect: string;
  imageUrl: string;
  imageAlt: string;
}

const STATIC_GALLERY_IMAGES: GalleryItem[] = [
  { id: '1', title: 'Maharaja Thali', description: 'Grand royal thali', category: 'food', aspect: 'tall', imageUrl: '/images/menu/thali-1.jpg', imageAlt: 'Maharaja Thali' },
  { id: '2', title: 'Thali Spread', description: 'Traditional spread', category: 'food', aspect: 'wide', imageUrl: '/images/menu/thali-3.jpg', imageAlt: 'Thali Spread' },
  { id: '3', title: 'Sada Thali', description: 'Wholesome sada thali', category: 'food', aspect: 'square', imageUrl: '/images/menu/thali-2.jpg', imageAlt: 'Sada Thali' },
  { id: '4', title: 'Dal Baati', description: 'Authentic dal baati', category: 'food', aspect: 'tall', imageUrl: '/images/menu/dal-baati.jpg', imageAlt: 'Dal Baati' },
  { id: '5', title: 'Ghee Thali', description: 'Rich ghee thali', category: 'food', aspect: 'square', imageUrl: '/images/menu/thali-4.jpg', imageAlt: 'Ghee Thali' },
  { id: '6', title: 'Paratha Selection', description: 'Stuffed parathas', category: 'food', aspect: 'wide', imageUrl: '/images/menu/paratha-1.jpg', imageAlt: 'Paratha Selection' },
  { id: '7', title: 'Kachori', description: 'Crispy kachori', category: 'food', aspect: 'square', imageUrl: '/images/menu/kachori.jpg', imageAlt: 'Kachori' },
  { id: '8', title: 'Lassi & Chaach', description: 'Refreshing beverages', category: 'food', aspect: 'tall', imageUrl: '/images/menu/lassi.jpg', imageAlt: 'Lassi & Chaach' },
];

const CATEGORIES = ['all', 'food'];

interface DbGalleryImage {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  imageAlt?: string;
  category?: string;
  sortOrder?: number;
  isPublished?: boolean;
}

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>(STATIC_GALLERY_IMAGES);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((item: DbGalleryImage, idx: number) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            category: item.category || 'food',
            aspect: idx % 3 === 0 ? 'tall' : idx % 4 === 0 ? 'wide' : 'square',
            imageUrl: item.imageUrl,
            imageAlt: item.imageAlt || item.title,
          }));
          setGalleryImages(formatted);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = activeCategory === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeCategory);

  return (
    <div className="relative min-h-screen">
      <JaaliOverlay opacity={0.015} />
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <SectionReveal>
          <div className="text-center mb-16">
            <p className="text-brass/50 uppercase tracking-[0.3em] text-xs mb-5 font-body">Visual Journey</p>
            <h1 className="text-4xl md:text-6xl font-serif text-ivory mb-4">Gallery</h1>
            <p className="text-ivory/40 max-w-xl mx-auto font-body text-lg text-balance">
              A glimpse into the world of Chokho Jeeman — our cuisines and flavors.
            </p>
            <OrnamentalDivider variant="short" className="mt-8" />
          </div>
        </SectionReveal>

        {/* Category filters */}
        <SectionReveal delay={0.1}>
          <div className="flex justify-center gap-3 mb-12 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-sm text-[11px] uppercase tracking-[0.2em] font-body transition-all duration-500 ${
                  activeCategory === cat
                    ? 'bg-brass/90 text-warm-black shadow-[0_2px_12px_rgba(181,144,60,0.25)]'
                    : 'bg-warm-mid/50 border border-brass/10 text-ivory/50 hover:bg-warm-mid hover:text-ivory/70 hover:border-brass/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </SectionReveal>

        {/* Gallery grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
          >
            {filtered.map((img, idx) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.04, duration: 0.5, ease: EASE }}
                onClick={() => setLightboxImage(img)}
                className={`relative group overflow-hidden rounded-lg cursor-pointer ${
                  img.aspect === 'tall' ? 'row-span-2' : img.aspect === 'wide' ? 'col-span-2' : ''
                }`}
              >
                <div className="w-full h-full min-h-[200px] relative">
                  <Image
                    src={img.imageUrl}
                    alt={img.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-warm-black/70 via-transparent to-warm-black/10 group-hover:from-warm-black/80 transition-all duration-500" />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-brass/50 font-body">{img.category}</span>
                    <h3 className="text-base font-serif text-ivory/90 mt-1">{img.title}</h3>
                  </div>
                </div>

                {/* Corner ornament on hover */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-5 h-5 border border-brass/30 rotate-45" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-warm-black/95 backdrop-blur-sm p-6"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="relative max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="rounded-xl border border-brass/10 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] bg-warm-dark">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={lightboxImage.imageUrl}
                    alt={lightboxImage.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-warm-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-serif text-ivory/90">{lightboxImage.title}</h3>
                    <p className="text-brass/50 text-sm uppercase tracking-[0.2em] mt-1 font-body">{lightboxImage.category}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-warm-dark border border-brass/20 flex items-center justify-center text-ivory/50 hover:text-ivory hover:border-brass/40 transition-all duration-300 text-lg shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
