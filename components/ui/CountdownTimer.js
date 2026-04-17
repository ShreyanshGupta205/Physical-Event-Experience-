'use client';
import { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;
      
      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex gap-12">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex-col items-center">
          <div className="glass-card" style={{ padding: '8px 12px', fontSize: 20, fontWeight: 700, minWidth: 50, textAlign: 'center' }}>
            {value.toString().padStart(2, '0')}
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase' }}>{unit}</span>
        </div>
      ))}
    </div>
  );
}
