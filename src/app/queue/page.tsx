/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { OrnamentalDivider, SectionReveal, JaaliOverlay } from '@/components/ornamental';
import { useSocket } from '@/hooks/useSocket';

interface QueueEntry {
  id: string;
  name: string;
  partySize: number;
  status: string;
  estimatedAt: string;
  position: number;
}

export default function QueuePage() {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [name, setName] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [joined, setJoined] = useState(false);
  const [myPosition, setMyPosition] = useState(0);
  const [estimatedWait, setEstimatedWait] = useState(0);

  const fetchQueue = useCallback(async () => {
    try {
      const res = await fetch('/api/queue');
      const data = await res.json();
      const items = Array.isArray(data) ? data : [];
      setQueue(items.map((item: QueueEntry, idx: number) => ({ ...item, position: idx + 1 })));
    } catch {
      setQueue([]);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 10000);
    return () => clearInterval(interval);
  }, [fetchQueue]);

  useSocket('queue-updated', () => {
    fetchQueue();
  });

  const handleJoin = async () => {
    if (!name) return;
    try {
      const res = await fetch('/api/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, partySize }),
      });
      const item = await res.json();
      if (item && item.id) {
        setJoined(true);
        fetchQueue();
        const pos = queue.length + 1;
        setMyPosition(pos);
        setEstimatedWait(pos * 15);
      }
    } catch {
      setJoined(true);
      setMyPosition(queue.length + 1);
      setEstimatedWait((queue.length + 1) * 15);
    }
  };

  const waitingItems = queue.filter(i => i.status === 'WAITING');

  return (
    <div className="relative min-h-screen">
      <JaaliOverlay opacity={0.015} />
      <div className="max-w-5xl mx-auto px-6 py-20 relative z-10">
        <SectionReveal>
          <div className="text-center mb-16">
            <p className="text-brass/50 uppercase tracking-[0.3em] text-xs mb-5 font-body">Live Queue</p>
            <h1 className="text-4xl md:text-6xl font-serif text-ivory mb-4">Waiting Queue</h1>
            <p className="text-ivory/40 max-w-xl mx-auto font-body text-lg">
              Join our live queue and get real-time updates on your waiting position.
            </p>
            <OrnamentalDivider variant="short" className="mt-8" />
          </div>
        </SectionReveal>

        {!joined ? (
          <SectionReveal delay={0.1}>
            <div className="max-w-md mx-auto">
              <GlassCard className="p-10">
                <h3 className="text-lg font-serif text-ivory/80 mb-8 text-center">Join the Queue</h3>
                <div className="space-y-5">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-sm bg-warm-dark/80 border border-brass/10 text-ivory/80 placeholder-ivory/25 focus:outline-none focus:border-brass/30 focus:shadow-[0_0_0_3px_rgba(181,144,60,0.06)] transition-all duration-300 font-body text-sm"
                  />
                  <div>
                    <label className="text-[11px] uppercase tracking-[0.2em] text-ivory/30 mb-3 block font-body">Party Size</label>
                    <div className="flex items-center gap-5">
                      <button onClick={() => setPartySize(Math.max(1, partySize - 1))} className="w-10 h-10 rounded-full bg-warm-dark/60 border border-brass/10 text-ivory/50 hover:text-ivory hover:border-brass/25 transition-all duration-300 flex items-center justify-center">-</button>
                      <span className="text-2xl font-serif text-brass w-12 text-center">{partySize}</span>
                      <button onClick={() => setPartySize(Math.min(12, partySize + 1))} className="w-10 h-10 rounded-full bg-warm-dark/60 border border-brass/10 text-ivory/50 hover:text-ivory hover:border-brass/25 transition-all duration-300 flex items-center justify-center">+</button>
                    </div>
                  </div>
                  <AnimatedButton onClick={handleJoin} disabled={!name} className="w-full">
                    Join Queue
                  </AnimatedButton>
                </div>
              </GlassCard>
            </div>
          </SectionReveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* My Queue Status */}
            <SectionReveal delay={0.1}>
              <GlassCard className="p-10">
                <h3 className="text-lg font-serif text-ivory/80 mb-8 text-center">Your Queue Status</h3>
                <div className="text-center mb-8">
                  {/* Token circle */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, type: 'spring', stiffness: 150, damping: 15 }}
                    className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-brass/10 to-brass/5 border-2 border-brass/30 flex items-center justify-center mb-5 relative"
                  >
                    {/* Inner ring */}
                    <div className="absolute inset-2 rounded-full border border-brass/15" />
                    <span className="text-3xl font-serif text-brass relative z-10">#{myPosition || waitingItems.length}</span>
                  </motion.div>
                  <p className="text-ivory/35 text-sm font-body">Your Position</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-ivory/35 text-sm font-body">Name</span>
                    <span className="text-ivory/70 text-sm font-body">{name}</span>
                  </div>
                  <div className="h-px bg-brass/5" />
                  <div className="flex justify-between items-center">
                    <span className="text-ivory/35 text-sm font-body">Party Size</span>
                    <span className="text-ivory/70 text-sm font-body">{partySize} guests</span>
                  </div>
                  <div className="h-px bg-brass/5" />
                  <div className="flex justify-between items-center">
                    <span className="text-ivory/35 text-sm font-body">Estimated Wait</span>
                    <span className="text-brass text-sm font-semibold font-body">{estimatedWait} min</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="bg-warm-dark/60 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: myPosition > 0 ? `${Math.max(10, 100 - (myPosition * 20))}%` : '5%' }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full bg-gradient-to-r from-brass/60 to-brass rounded-full"
                  />
                </div>
                <p className="text-[10px] text-ivory/20 text-center mt-3 font-body uppercase tracking-wider">Queue Progress</p>
              </GlassCard>
            </SectionReveal>

            {/* Live Queue List */}
            <SectionReveal delay={0.15}>
              <GlassCard className="p-10">
                <h3 className="text-lg font-serif text-ivory/80 mb-6">Live Queue <span className="text-ivory/30 text-sm font-body">({waitingItems.length} waiting)</span></h3>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                  {waitingItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03, duration: 0.3 }}
                      className={`flex items-center justify-between p-3.5 rounded-sm transition-colors duration-300 ${
                        item.name === name
                          ? 'bg-brass/5 border border-brass/15'
                          : 'bg-warm-dark/30 hover:bg-warm-dark/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-brass/50 font-mono text-xs w-8">#{idx + 1}</span>
                        <div>
                          <p className="text-ivory/70 text-sm font-body">{item.name}</p>
                          <p className="text-ivory/25 text-xs font-body">{item.partySize} guests</p>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2.5 py-1 rounded-sm uppercase tracking-wider font-body ${
                        item.status === 'WAITING' ? 'bg-brass/10 text-brass/70' : 'bg-green-500/10 text-green-400/70'
                      }`}>
                        {item.status}
                      </span>
                    </motion.div>
                  ))}
                  {waitingItems.length === 0 && (
                    <p className="text-ivory/25 text-center py-12 font-body text-sm">No one in queue. Be the first!</p>
                  )}
                </div>
              </GlassCard>
            </SectionReveal>
          </div>
        )}
      </div>
    </div>
  );
}
