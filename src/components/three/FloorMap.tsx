'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { FloorTable } from '@/types';

const TABLES: FloorTable[] = [
  { id: 't1', x: 50, y: 30, seats: 2, status: 'available' },
  { id: 't2', x: 150, y: 30, seats: 4, status: 'available' },
  { id: 't3', x: 250, y: 30, seats: 2, status: 'available' },
  { id: 't4', x: 50, y: 130, seats: 6, status: 'available' },
  { id: 't5', x: 150, y: 130, seats: 4, status: 'available' },
  { id: 't6', x: 250, y: 130, seats: 2, status: 'available' },
  { id: 't7', x: 100, y: 230, seats: 8, status: 'available' },
  { id: 't8', x: 220, y: 230, seats: 4, status: 'available' },
];

interface FloorMapProps {
  onSelectTable?: (table: FloorTable) => void;
  selectedTableId?: string;
  bookedTableIds?: string[];
}

export default function FloorMap({ onSelectTable, selectedTableId, bookedTableIds = [] }: FloorMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getTableStatus = (table: FloorTable) => {
    return bookedTableIds.includes(table.id) ? 'reserved' : 'available';
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#22c55e';
      case 'reserved': return '#b5903c';
      case 'occupied': return '#ef4444';
      default: return '#71717a';
    }
  };

  return (
    <div className="bg-gradient-to-br from-warm-mid/80 via-warm-dark/90 to-warm-mid/60 backdrop-blur-xl border border-brass/10 rounded-xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
      <h3 className="text-sm font-serif text-ivory/70 mb-4 uppercase tracking-[0.15em]">Interactive Floor Map</h3>
      <div className="flex gap-5 mb-5 text-[10px] font-body uppercase tracking-wider">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500/70 inline-block" /> <span className="text-ivory/40">Available</span></span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brass/70 inline-block" /> <span className="text-ivory/40">Reserved</span></span>
      </div>
      <svg viewBox="0 0 350 300" className="w-full max-w-lg mx-auto">
        <rect x="0" y="0" width="350" height="300" fill="#1a120c" rx="8" />
        {/* Grid pattern */}
        {Array.from({ length: 15 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 25} y1="0" x2={i * 25} y2="300" stroke="rgba(181,144,60,0.03)" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 25} x2="350" y2={i * 25} stroke="rgba(181,144,60,0.03)" strokeWidth="0.5" />
        ))}
        {TABLES.map((table) => {
          const status = getTableStatus(table);
          return (
            <g
              key={table.id}
              onMouseEnter={() => setHoveredId(table.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => status === 'available' && onSelectTable?.(table)}
              className="cursor-pointer"
            >
              <motion.rect
                x={table.x - 20}
                y={table.y - 15}
                width={40}
                height={30}
                rx={3}
                fill={getStatusColor(status)}
                opacity={selectedTableId === table.id ? 0.9 : 0.6}
                stroke={selectedTableId === table.id ? '#b5903c' : 'transparent'}
                strokeWidth={1.5}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.2 }}
              />
              <circle cx={table.x - 12} cy={table.y - 5} r={2.5} fill="#f5f0e8" opacity={0.4} />
              <circle cx={table.x + 12} cy={table.y - 5} r={2.5} fill="#f5f0e8" opacity={0.4} />
              {table.seats > 2 && (
                <>
                  <circle cx={table.x - 12} cy={table.y + 5} r={2.5} fill="#f5f0e8" opacity={0.4} />
                  <circle cx={table.x + 12} cy={table.y + 5} r={2.5} fill="#f5f0e8" opacity={0.4} />
                </>
              )}
              {table.seats > 4 && (
                <>
                  <circle cx={table.x} cy={table.y - 10} r={2.5} fill="#f5f0e8" opacity={0.4} />
                  <circle cx={table.x} cy={table.y + 10} r={2.5} fill="#f5f0e8" opacity={0.4} />
                </>
              )}
              {hoveredId === table.id && (
                <text x={table.x} y={table.y + 30} textAnchor="middle" fill="#b5903c" fontSize="9" fontFamily="serif" opacity="0.8">
                  {table.seats} seats · {status}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
