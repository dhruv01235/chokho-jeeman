'use client';
import { useState } from 'react';
import Image from 'next/image';
import type { ImageType } from '@/data/menu-data';
import { resolveMenuItemImage } from '@/data/menu-data';

interface FoodIllustrationProps {
  type: ImageType;
  imageUrl?: string;
  imageAlt?: string;
  className?: string;
}

const COLORS = {
  brass: '#b5903c',
  brassLight: '#d4b06a',
  brassDim: '#8a6d2e',
  maroon: '#6b1d1d',
  maroonDeep: '#4a1212',
  terracotta: '#c2703e',
  terracottaMuted: '#a85d33',
  sandstone: '#c4a77d',
  sandstoneLight: '#dbc5a4',
  ivory: '#f5f0e8',
  walnut: '#2c1810',
  walnutDeep: '#1a0e08',
  warmDark: '#1a120c',
  warmMid: '#2a1f16',
};

function ThaliBase({ bowls, decorative }: { bowls: number; decorative?: boolean }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="100" cy="110" rx="85" ry="80" fill={COLORS.walnutDeep} opacity="0.4" />
      <circle cx="100" cy="105" r="82" fill={COLORS.sandstone} opacity="0.15" />
      <circle cx="100" cy="105" r="80" stroke={COLORS.brass} strokeWidth="1.5" opacity="0.5" />
      <circle cx="100" cy="105" r="72" stroke={COLORS.brassDim} strokeWidth="0.5" opacity="0.3" />
      {decorative && (
        <>
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 15 * Math.PI) / 180;
            const x1 = 100 + 76 * Math.cos(angle);
            const y1 = 105 + 76 * Math.sin(angle);
            const x2 = 100 + 80 * Math.cos(angle);
            const y2 = 105 + 80 * Math.sin(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLORS.brass} strokeWidth="0.5" opacity="0.4" />;
          })}
        </>
      )}
      {Array.from({ length: bowls }).map((_, i) => {
        const angle = (i * (360 / bowls) * Math.PI) / 180 - Math.PI / 2;
        const radius = bowls <= 5 ? 38 : bowls <= 8 ? 42 : 46;
        const cx = 100 + radius * Math.cos(angle);
        const cy = 105 + radius * Math.sin(angle);
        const bowlColors = [COLORS.terracotta, COLORS.maroon, COLORS.sandstone, COLORS.brassDim, COLORS.terracottaMuted, COLORS.maroonDeep, COLORS.sandstoneLight, COLORS.brass, COLORS.terracotta, COLORS.maroon, COLORS.sandstone, COLORS.brassDim];
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r="14" fill={bowlColors[i % bowlColors.length]} opacity="0.25" />
            <circle cx={cx} cy={cy} r="13" stroke={COLORS.brass} strokeWidth="0.7" opacity="0.4" />
            <circle cx={cx} cy={cy} r="9" fill={bowlColors[i % bowlColors.length]} opacity="0.15" />
          </g>
        );
      })}
      <circle cx="100" cy="105" r="16" fill={COLORS.terracotta} opacity="0.2" />
      <circle cx="100" cy="105" r="15" stroke={COLORS.brass} strokeWidth="0.8" opacity="0.5" />
      <circle cx="100" cy="105" r="10" fill={COLORS.terracotta} opacity="0.12" />
      <ellipse cx="100" cy="103" rx="7" ry="4" fill={COLORS.sandstoneLight} opacity="0.2" />
    </svg>
  );
}

function DalBaatiIllustration() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="70" cy="120" rx="42" ry="38" fill={COLORS.walnutDeep} opacity="0.3" />
      <circle cx="70" cy="115" r="40" fill={COLORS.terracotta} opacity="0.15" />
      <circle cx="70" cy="115" r="38" stroke={COLORS.brass} strokeWidth="1" opacity="0.4" />
      <ellipse cx="70" cy="113" rx="30" ry="26" fill={COLORS.terracotta} opacity="0.1" />
      <ellipse cx="70" cy="112" rx="28" ry="22" fill={COLORS.terracottaMuted} opacity="0.2" />
      <circle cx="140" cy="100" r="18" fill={COLORS.sandstone} opacity="0.2" />
      <circle cx="140" cy="100" r="17" stroke={COLORS.brass} strokeWidth="0.8" opacity="0.4" />
      <path d="M128 96 Q140 88 152 96" stroke={COLORS.brassDim} strokeWidth="0.5" opacity="0.3" fill="none" />
      <circle cx="140" cy="108" r="14" fill={COLORS.sandstone} opacity="0.15" />
      <circle cx="140" cy="108" r="13" stroke={COLORS.brass} strokeWidth="0.6" opacity="0.3" />
      <ellipse cx="145" cy="140" rx="16" ry="10" fill={COLORS.sandstoneLight} opacity="0.15" />
      <ellipse cx="145" cy="139" rx="14" ry="8" stroke={COLORS.brass} strokeWidth="0.6" opacity="0.3" fill="none" />
      <circle cx="70" cy="115" r="1.5" fill={COLORS.brass} opacity="0.3" />
      <circle cx="65" cy="118" r="1" fill={COLORS.brass} opacity="0.2" />
      <circle cx="75" cy="112" r="1" fill={COLORS.brass} opacity="0.2" />
    </svg>
  );
}

function ParathaIllustration() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="100" cy="105" r="70" fill={COLORS.sandstone} opacity="0.1" />
      <circle cx="100" cy="105" r="68" stroke={COLORS.brass} strokeWidth="0.8" opacity="0.3" />
      <circle cx="100" cy="100" r="50" fill={COLORS.sandstone} opacity="0.15" />
      <circle cx="100" cy="100" r="48" stroke={COLORS.brassDim} strokeWidth="0.6" opacity="0.3" />
      <circle cx="100" cy="100" r="38" stroke={COLORS.brassDim} strokeWidth="0.4" opacity="0.2" />
      <circle cx="100" cy="100" r="28" stroke={COLORS.brassDim} strokeWidth="0.3" opacity="0.15" />
      <path d="M65 85 Q100 75 135 85" stroke={COLORS.brassDim} strokeWidth="0.4" opacity="0.2" fill="none" />
      <path d="M60 100 Q100 90 140 100" stroke={COLORS.brassDim} strokeWidth="0.4" opacity="0.2" fill="none" />
      <path d="M65 115 Q100 105 135 115" stroke={COLORS.brassDim} strokeWidth="0.4" opacity="0.2" fill="none" />
      <circle cx="85" cy="90" r="4" fill={COLORS.brass} opacity="0.12" />
      <circle cx="115" cy="95" r="3" fill={COLORS.brass} opacity="0.1" />
      <circle cx="100" cy="110" r="5" fill={COLORS.brass} opacity="0.08" />
      <circle cx="155" cy="135" r="18" fill={COLORS.terracotta} opacity="0.12" />
      <circle cx="155" cy="135" r="16" stroke={COLORS.brass} strokeWidth="0.5" opacity="0.25" />
    </svg>
  );
}

function RotiIllustration() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="100" cy="120" rx="55" ry="50" fill={COLORS.sandstone} opacity="0.1" />
      <ellipse cx="100" cy="115" rx="52" ry="47" stroke={COLORS.brass} strokeWidth="0.6" opacity="0.25" fill="none" />
      <ellipse cx="100" cy="110" rx="48" ry="43" fill={COLORS.sandstone} opacity="0.12" />
      <ellipse cx="100" cy="110" rx="46" ry="41" stroke={COLORS.brassDim} strokeWidth="0.5" opacity="0.2" fill="none" />
      <ellipse cx="100" cy="105" rx="44" ry="39" fill={COLORS.sandstone} opacity="0.15" />
      <ellipse cx="100" cy="105" rx="42" ry="37" stroke={COLORS.brass} strokeWidth="0.5" opacity="0.3" fill="none" />
      <circle cx="88" cy="100" r="3" fill={COLORS.terracotta} opacity="0.08" />
      <circle cx="112" cy="105" r="4" fill={COLORS.terracotta} opacity="0.06" />
      <circle cx="95" cy="112" r="2.5" fill={COLORS.terracotta} opacity="0.07" />
    </svg>
  );
}

function BowlIllustration({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="100" cy="125" rx="55" ry="12" fill={COLORS.walnutDeep} opacity="0.25" />
      <path d="M45 100 Q45 140 100 145 Q155 140 155 100 Z" fill={color} opacity="0.15" />
      <path d="M45 100 Q45 140 100 145 Q155 140 155 100" stroke={COLORS.brass} strokeWidth="1" opacity="0.4" fill="none" />
      <ellipse cx="100" cy="100" rx="55" ry="18" fill={color} opacity="0.12" />
      <ellipse cx="100" cy="100" rx="55" ry="18" stroke={COLORS.brass} strokeWidth="0.8" opacity="0.35" fill="none" />
      <ellipse cx="100" cy="98" rx="45" ry="14" fill={color} opacity="0.1" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const cx = 100 + 52 * Math.cos(angle);
        const cy = 100 + 16 * Math.sin(angle);
        return <circle key={i} cx={cx} cy={cy} r="0.8" fill={COLORS.brass} opacity="0.25" />;
      })}
    </svg>
  );
}

function TikkarIllustration() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="100" cy="105" r="65" fill={COLORS.sandstone} opacity="0.08" />
      <circle cx="100" cy="105" r="63" stroke={COLORS.brass} strokeWidth="0.6" opacity="0.2" fill="none" />
      <path d="M100 65 L130 105 L100 145 L70 105 Z" fill={COLORS.sandstone} opacity="0.15" />
      <path d="M100 65 L130 105 L100 145 L70 105 Z" stroke={COLORS.brass} strokeWidth="0.8" opacity="0.3" fill="none" />
      <path d="M100 78 L120 105 L100 132 L80 105 Z" stroke={COLORS.brassDim} strokeWidth="0.4" opacity="0.2" fill="none" />
      <circle cx="100" cy="95" r="1.5" fill={COLORS.brass} opacity="0.15" />
      <circle cx="92" cy="105" r="1" fill={COLORS.brass} opacity="0.12" />
      <circle cx="108" cy="105" r="1" fill={COLORS.brass} opacity="0.12" />
    </svg>
  );
}

function MiniThaliIllustration() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="100" cy="105" r="65" fill={COLORS.sandstone} opacity="0.12" />
      <circle cx="100" cy="105" r="63" stroke={COLORS.brass} strokeWidth="1" opacity="0.4" />
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i * 60 * Math.PI) / 180 - Math.PI / 2;
        const cx = 100 + 35 * Math.cos(angle);
        const cy = 105 + 35 * Math.sin(angle);
        const bowlColors = [COLORS.terracotta, COLORS.maroon, COLORS.sandstone, COLORS.brassDim, COLORS.terracottaMuted, COLORS.maroonDeep];
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r="12" fill={bowlColors[i]} opacity="0.2" />
            <circle cx={cx} cy={cy} r="11" stroke={COLORS.brass} strokeWidth="0.6" opacity="0.3" />
          </g>
        );
      })}
      <circle cx="100" cy="105" r="14" fill={COLORS.sandstoneLight} opacity="0.15" />
      <circle cx="100" cy="105" r="13" stroke={COLORS.brass} strokeWidth="0.5" opacity="0.25" fill="none" />
      <ellipse cx="155" cy="120" rx="18" ry="8" fill={COLORS.sandstone} opacity="0.1" />
      <ellipse cx="155" cy="118" rx="16" ry="7" stroke={COLORS.brass} strokeWidth="0.4" opacity="0.2" fill="none" />
    </svg>
  );
}

function getFallbackIllustration(type: ImageType) {
  switch (type) {
    case 'thali': return <ThaliBase bowls={8} />;
    case 'maharaja-thali': return <ThaliBase bowls={10} decorative />;
    case 'maharani-thali': return <ThaliBase bowls={12} decorative />;
    case 'ghee-thali': return <ThaliBase bowls={8} decorative />;
    case 'dal-baati': return <DalBaatiIllustration />;
    case 'paratha': return <ParathaIllustration />;
    case 'roti': return <RotiIllustration />;
    case 'bati': return <BowlIllustration color={COLORS.sandstone} />;
    case 'dal': return <BowlIllustration color={COLORS.terracotta} />;
    case 'kadhi': return <BowlIllustration color={COLORS.sandstoneLight} />;
    case 'rice': return <BowlIllustration color={COLORS.sandstoneLight} />;
    case 'raita': return <BowlIllustration color={COLORS.ivory} />;
    case 'sabji': return <BowlIllustration color={COLORS.terracottaMuted} />;
    case 'mithai': return <BowlIllustration color={COLORS.sandstoneLight} />;
    case 'tikkar': return <TikkarIllustration />;
    case 'minithali': return <MiniThaliIllustration />;
    default: return <BowlIllustration color={COLORS.sandstone} />;
  }
}

export default function FoodIllustration({ type, imageUrl, imageAlt, className = '' }: FoodIllustrationProps) {
  const [imgError, setImgError] = useState(false);
  const resolved = resolveMenuItemImage(imageUrl, imageAlt, type);
  const usePhoto = resolved && !imgError;

  const containerClass = `relative overflow-hidden ${className}`;

  return (
    <div className={containerClass}>
      {/* Warm gradient background (always present as fallback) */}
      <div className="absolute inset-0 bg-gradient-to-br from-warm-mid/80 via-warm-dark/60 to-warm-mid/80" />

      {usePhoto ? (
        <>
          {/* Real food photo (Database imageUrl → FOOD_IMAGES fallback) */}
          <Image
            src={resolved.src}
            alt={resolved.alt || `${type} food`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
          {/* Subtle dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-warm-black/40 via-transparent to-warm-black/20" />
        </>
      ) : (
        <>
          {/* SVG fallback */}
          <div className="absolute inset-0 jaali-pattern opacity-30" />
          <div className="relative z-10 w-full h-full flex items-center justify-center p-3">
            {getFallbackIllustration(type)}
          </div>
        </>
      )}

      {/* Corner ornaments */}
      <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-brass/15" />
      <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-brass/15" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-brass/15" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-brass/15" />
    </div>
  );
}
