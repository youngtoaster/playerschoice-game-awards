import React, { useState, useEffect } from 'react';
import { useAwards } from '../store/awardsContext';
import { Calendar, ShieldAlert, Sparkles, Clock } from 'lucide-react';

export default function CountdownTimer() {
  const { settings, cutoffDate } = useAwards();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(settings.showDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [settings.showDate]);

  const formattedShowDate = new Date(settings.showDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  const formattedCutoff = cutoffDate ? new Date(cutoffDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : 'N/A';

  return (
    <div className="flex flex-col items-center">
      {/* Countdown Digits */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-4">
        {[
          { label: 'DAYS', value: timeLeft.days },
          { label: 'HOURS', value: timeLeft.hours },
          { label: 'MINUTES', value: timeLeft.minutes },
          { label: 'SECONDS', value: timeLeft.seconds }
        ].map((unit, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-obsidian-850/80 border border-amber-500/20 backdrop-blur-md min-w-[70px] sm:min-w-[90px] shadow-lg shadow-black/40 group hover:border-amber-500/40 transition-all duration-300"
          >
            <span className="font-cinzel text-2xl sm:text-4xl font-extrabold text-white tracking-wider text-glow-gold">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-amber-400/80 mt-1">
              {unit.label}
            </span>
          </div>
        ))}
      </div>

      {/* Date & 1-Month Cut-off Rule Pill */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-300">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span>Award Ceremony: <strong className="text-white font-semibold">{formattedShowDate}</strong></span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-200 backdrop-blur-sm">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>1-Month Release Cut-Off: <strong className="text-amber-300 font-bold">{formattedCutoff}</strong></span>
        </div>
      </div>
    </div>
  );
}
