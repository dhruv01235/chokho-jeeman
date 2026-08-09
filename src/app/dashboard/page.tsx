/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { OrnamentalDivider, SectionReveal, JaaliOverlay } from '@/components/ornamental';

interface Reservation {
  id: string;
  date: string;
  partySize: number;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = useCallback(async () => {
    try {
      const res = await fetch('/api/reservation');
      const data = await res.json();
      setReservations(Array.isArray(data) ? data : []);
    } catch {
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'text-green-400/80 bg-green-500/10';
      case 'PENDING': return 'text-brass/80 bg-brass/10';
      case 'CANCELLED': return 'text-red-400/80 bg-red-500/10';
      default: return 'text-ivory/30 bg-ivory/5';
    }
  };

  return (
    <div className="relative min-h-screen">
      <JaaliOverlay opacity={0.015} />
      <div className="max-w-5xl mx-auto px-6 py-20 relative z-10">
        <SectionReveal>
          <div className="text-center mb-16">
            <p className="text-brass/50 uppercase tracking-[0.3em] text-xs mb-5 font-body">Your Account</p>
            <h1 className="text-4xl md:text-6xl font-serif text-ivory mb-4">Customer Dashboard</h1>
            <OrnamentalDivider variant="short" className="mt-8" />
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <SectionReveal delay={0.1}>
            <GlassCard className="p-7 text-center">
              <p className="text-3xl font-serif text-brass">{reservations.length}</p>
              <p className="text-[10px] text-ivory/25 uppercase tracking-[0.2em] mt-2 font-body">Total Bookings</p>
            </GlassCard>
          </SectionReveal>
          <SectionReveal delay={0.15}>
            <GlassCard className="p-7 text-center">
              <p className="text-3xl font-serif text-green-400/70">{reservations.filter(r => r.status === 'CONFIRMED').length}</p>
              <p className="text-[10px] text-ivory/25 uppercase tracking-[0.2em] mt-2 font-body">Confirmed</p>
            </GlassCard>
          </SectionReveal>
          <SectionReveal delay={0.2}>
            <GlassCard className="p-7 text-center">
              <p className="text-3xl font-serif text-brass/70">{reservations.filter(r => r.status === 'PENDING').length}</p>
              <p className="text-[10px] text-ivory/25 uppercase tracking-[0.2em] mt-2 font-body">Pending</p>
            </GlassCard>
          </SectionReveal>
        </div>

        <SectionReveal delay={0.25}>
          <GlassCard className="p-8">
            <h3 className="text-lg font-serif text-ivory/80 mb-6">Your Reservations</h3>
            {loading ? (
              <p className="text-ivory/25 text-center py-12 font-body text-sm">Loading...</p>
            ) : reservations.length === 0 ? (
              <p className="text-ivory/25 text-center py-12 font-body text-sm">No reservations found. Book your first table!</p>
            ) : (
              <div className="space-y-2">
                {reservations.map((res, idx) => (
                  <motion.div
                    key={res.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                    className="flex items-center justify-between p-4 bg-warm-dark/40 rounded-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-brass/5 border border-brass/15 flex items-center justify-center">
                        <span className="text-brass text-sm font-serif">{res.partySize}</span>
                      </div>
                      <div>
                        <p className="text-ivory/70 text-sm font-body">{new Date(res.date).toLocaleDateString()}</p>
                        <p className="text-ivory/25 text-xs font-body">{new Date(res.date).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] px-3 py-1.5 rounded-sm uppercase tracking-wider font-body ${getStatusColor(res.status)}`}>
                      {res.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </GlassCard>
        </SectionReveal>
      </div>
    </div>
  );
}
