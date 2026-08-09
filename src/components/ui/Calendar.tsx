'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface CalendarProps {
  onSelectDate: (date: Date) => void;
  selectedDate?: Date;
}

export default function Calendar({ onSelectDate, selectedDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
    days.push(
      <motion.button
        key={day}
        whileHover={!isPast ? { scale: 1.1 } : undefined}
        whileTap={!isPast ? { scale: 0.95 } : undefined}
        onClick={() => !isPast && onSelectDate(date)}
        disabled={isPast}
        className={`w-10 h-10 rounded-sm flex items-center justify-center text-sm transition-all duration-300 font-body ${
          isSelected
            ? 'bg-brass/90 text-warm-black font-semibold shadow-[0_2px_8px_rgba(181,144,60,0.25)]'
            : isPast
            ? 'text-ivory/15 cursor-not-allowed'
            : 'text-ivory/50 hover:bg-warm-mid hover:text-ivory/80'
        }`}
      >
        {day}
      </motion.button>
    );
  }

  return (
    <div className="bg-gradient-to-br from-warm-mid/80 via-warm-dark/90 to-warm-mid/60 backdrop-blur-xl border border-brass/10 rounded-xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => setCurrentMonth(new Date(year, month - 1))}
          className="text-brass/50 hover:text-brass px-2 transition-colors duration-300 text-lg"
        >
          &#8249;
        </button>
        <h3 className="text-base font-serif text-ivory/80">
          {monthNames[month]} {year}
        </h3>
        <button
          onClick={() => setCurrentMonth(new Date(year, month + 1))}
          className="text-brass/50 hover:text-brass px-2 transition-colors duration-300 text-lg"
        >
          &#8250;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-center text-[10px] text-ivory/25 uppercase tracking-wider py-1 font-body">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 justify-items-center">
        {days}
      </div>
    </div>
  );
}
