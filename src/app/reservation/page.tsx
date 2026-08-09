'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Calendar from '@/components/ui/Calendar';
import FloorMap from '@/components/three/FloorMap';
import AnimatedButton from '@/components/ui/AnimatedButton';
import GlassCard from '@/components/ui/GlassCard';
import { OrnamentalDivider, SectionReveal, JaaliOverlay } from '@/components/ornamental';
import type { FloorTable } from '@/types';

const TIME_SLOTS = ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'];

export default function ReservationPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [selectedTable, setSelectedTable] = useState<FloorTable | undefined>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [reservationId, setReservationId] = useState('');
  const [emailStatus, setEmailStatus] = useState<'sent' | 'failed' | 'pending'>('pending');
  const [bookedTableIds, setBookedTableIds] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch availability when date or time changes
  useEffect(() => {
    async function fetchAvailability() {
      if (selectedDate && selectedTime) {
        try {
          const res = await fetch(`/api/reservation/availability?date=${selectedDate.toISOString()}&timeSlot=${selectedTime}`);
          const data = await res.json();
          setBookedTableIds(data);
        } catch (error) {
          console.error(error);
          setBookedTableIds([]);
        }
      } else {
        setBookedTableIds([]);
      }
    }
    fetchAvailability();
  }, [selectedDate, selectedTime]);

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !name || !email || !phone) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate.toISOString(),
          timeSlot: selectedTime,
          partySize,
          name,
          email,
          phone,
          tableInfo: selectedTable ? `Table ${selectedTable.id} (${selectedTable.seats} seats)` : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create reservation');
      }

      setReservationId(data.reservationId);
      setEmailStatus(data.email?.status === 'sent' ? 'sent' : 'failed');
      setSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error submitting reservation';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <JaaliOverlay opacity={0.015} />
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <SectionReveal>
          <div className="text-center mb-16">
            <p className="text-brass/50 uppercase tracking-[0.3em] text-xs mb-5 font-body">Reserve Your Experience</p>
            <h1 className="text-4xl md:text-6xl font-serif text-ivory mb-4">Table Reservation</h1>
            <p className="text-ivory/40 max-w-xl mx-auto font-body text-lg">
              Choose your preferred date, time, and table.
            </p>
            <OrnamentalDivider variant="short" className="mt-8" />
          </div>
        </SectionReveal>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-lg mx-auto"
          >
            <GlassCard className="p-10 text-center">
              {/* Animated check */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-8 rounded-full bg-brass/10 border border-brass/25 flex items-center justify-center"
              >
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <svg className="w-8 h-8 text-brass" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <motion.path
                      d="M5 13l4 4L19 7"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.6, duration: 0.6, ease: 'easeOut' }}
                    />
                  </svg>
                </motion.div>
              </motion.div>

              <h2 className="text-2xl font-serif text-ivory/90 mb-2">RESERVATION CONFIRMED ✓</h2>
              <div className="space-y-2 mb-6">
                {emailStatus === 'sent' ? (
                  <p className="text-ivory/80 font-body text-sm">Confirmation Email Sent ✓ — sent to {email}</p>
                ) : (
                  <p className="text-ivory/40 font-body text-sm">Confirmation email could not be delivered.</p>
                )}
              </div>

              <div className="bg-warm-dark/60 rounded-sm border border-brass/10 p-5 mb-8">
                <p className="text-[10px] uppercase tracking-[0.2em] text-ivory/30 mb-1 font-body">Booking ID</p>
                <p className="text-brass font-mono text-xl tracking-wider">{reservationId}</p>
              </div>

              <p className="text-xs text-ivory/60 font-body leading-relaxed">
                Please provide your Reservation ID (<strong className="text-brass">{reservationId}</strong>) to our restaurant staff upon arrival.
              </p>
            </GlassCard>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <SectionReveal delay={0.1}>
                <Calendar onSelectDate={setSelectedDate} selectedDate={selectedDate} />
              </SectionReveal>

              <SectionReveal delay={0.15}>
                <GlassCard className="p-7">
                  <h3 className="text-sm font-serif text-brass/70 mb-4 uppercase tracking-[0.15em]">Select Time</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {TIME_SLOTS.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`px-3 py-2.5 rounded-sm text-[11px] uppercase tracking-wider transition-all duration-300 font-body ${
                          selectedTime === time
                            ? 'bg-brass/90 text-warm-black font-semibold shadow-[0_2px_8px_rgba(181,144,60,0.2)]'
                            : 'bg-warm-dark/60 border border-brass/8 text-ivory/50 hover:bg-warm-dark hover:text-ivory/70 hover:border-brass/15'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </GlassCard>
              </SectionReveal>

              <SectionReveal delay={0.2}>
                <GlassCard className="p-7">
                  <h3 className="text-sm font-serif text-brass/70 mb-4 uppercase tracking-[0.15em]">Party Size</h3>
                  <div className="flex items-center gap-5">
                    <button onClick={() => setPartySize(Math.max(1, partySize - 1))} className="w-10 h-10 rounded-full bg-warm-dark/60 border border-brass/10 text-ivory/50 hover:text-ivory hover:border-brass/25 transition-all duration-300 flex items-center justify-center">-</button>
                    <span className="text-2xl font-serif text-brass w-12 text-center">{partySize}</span>
                    <button onClick={() => setPartySize(Math.min(12, partySize + 1))} className="w-10 h-10 rounded-full bg-warm-dark/60 border border-brass/10 text-ivory/50 hover:text-ivory hover:border-brass/25 transition-all duration-300 flex items-center justify-center">+</button>
                  </div>
                </GlassCard>
              </SectionReveal>
            </div>

            <div className="space-y-6">
              <SectionReveal delay={0.15}>
                <FloorMap onSelectTable={setSelectedTable} selectedTableId={selectedTable?.id} bookedTableIds={bookedTableIds} />
              </SectionReveal>

              <SectionReveal delay={0.2}>
                <GlassCard className="p-7">
                  <h3 className="text-sm font-serif text-brass/70 mb-5 uppercase tracking-[0.15em]">Your Details</h3>
                  <div className="space-y-4">
                    <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-sm bg-warm-dark/80 border border-brass/10 text-ivory/80 placeholder-ivory/25 focus:outline-none focus:border-brass/30 focus:shadow-[0_0_0_3px_rgba(181,144,60,0.06)] transition-all duration-300 font-body text-sm" />
                    <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-sm bg-warm-dark/80 border border-brass/10 text-ivory/80 placeholder-ivory/25 focus:outline-none focus:border-brass/30 focus:shadow-[0_0_0_3px_rgba(181,144,60,0.06)] transition-all duration-300 font-body text-sm" />
                    <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-sm bg-warm-dark/80 border border-brass/10 text-ivory/80 placeholder-ivory/25 focus:outline-none focus:border-brass/30 focus:shadow-[0_0_0_3px_rgba(181,144,60,0.06)] transition-all duration-300 font-body text-sm" />
                  </div>
                </GlassCard>
              </SectionReveal>

              <SectionReveal delay={0.25}>
                <GlassCard className="p-7">
                  <h3 className="text-sm font-serif text-brass/70 mb-5 uppercase tracking-[0.15em]">Booking Summary</h3>
                  <div className="space-y-3 text-sm font-body">
                    <div className="flex justify-between text-ivory/40">
                      <span>Date</span>
                      <span className="text-ivory/70">{selectedDate ? selectedDate.toLocaleDateString() : 'Not selected'}</span>
                    </div>
                    <div className="h-px bg-brass/5" />
                    <div className="flex justify-between text-ivory/40">
                      <span>Time</span>
                      <span className="text-ivory/70">{selectedTime || 'Not selected'}</span>
                    </div>
                    <div className="h-px bg-brass/5" />
                    <div className="flex justify-between text-ivory/40">
                      <span>Party Size</span>
                      <span className="text-ivory/70">{partySize} guests</span>
                    </div>
                    <div className="h-px bg-brass/5" />
                    <div className="flex justify-between text-ivory/40">
                      <span>Table</span>
                      <span className="text-ivory/70">{selectedTable ? `Table ${selectedTable.id} (${selectedTable.seats} seats)` : 'Not selected'}</span>
                    </div>
                  </div>
                  {errorMsg && (
                    <p className="text-xs text-red-400 mt-4 font-body">{errorMsg}</p>
                  )}
                  <div className="mt-8">
                    <AnimatedButton
                      onClick={handleSubmit}
                      disabled={loading || !selectedDate || !selectedTime || !name || !email || !phone}
                      className="w-full"
                    >
                      {loading ? 'Confirming...' : 'Confirm Reservation'}
                    </AnimatedButton>
                  </div>
                </GlassCard>
              </SectionReveal>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
