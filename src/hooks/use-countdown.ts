import { useEffect, useMemo, useState } from 'react';

export type Countdown = {
  hours: number;
  minutes: number;
  seconds: number;
  label: string; // "HH:MM:SS"
};

function msUntilNextMidnight(now: Date): number {
  const next = new Date(now);
  next.setHours(24, 0, 0, 0); // rolls to 00:00 tomorrow, local time
  return next.getTime() - now.getTime();
}

const pad = (n: number): string => String(n).padStart(2, '0');

/** Ticks every second, counting down to the next local midnight. */
export function useCountdown(): Countdown {
  const [remaining, setRemaining] = useState(() => msUntilNextMidnight(new Date()));

  useEffect(() => {
    const id = setInterval(() => setRemaining(msUntilNextMidnight(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return useMemo(() => {
    const totalSeconds = Math.max(0, Math.floor(remaining / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds, label: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}` };
  }, [remaining]);
}
