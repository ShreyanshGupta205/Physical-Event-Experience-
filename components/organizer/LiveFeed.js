'use client';
import { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function LiveFeed({ feed }) {
  const [items, setItems] = useState(feed);

  useEffect(() => {
    const names = ['Riya Joshi', 'Karan Mehta', 'Anjali Rao', 'Dev Sharma', 'Pooja Nair', 'Arjun Das'];
    const evts = ['Hackathon 2026', 'AI Summit', 'Cloud Bootcamp'];
    const t = setInterval(() => {
      const n = names[Math.floor(Math.random() * names.length)];
      const e = evts[Math.floor(Math.random() * evts.length)];
      setItems(prev => [
        { id: Date.now(), name: n, event: e, time: 'Just now', avatar: n.slice(0, 2).toUpperCase() },
        ...prev.slice(0, 6)
      ]);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <div className="live-feed-stack">
        {items.map((item) => (
          <div key={item.id} className="feed-row glass-card">
            <div className="feed-avatar" style={{ background: `linear-gradient(135deg, hsl(${(item.name.charCodeAt(0) * 40) % 360}, 60%, 45%), transparent)` }}>
              {item.avatar}
            </div>
            <div className="feed-content">
              <p><strong>{item.name}</strong> shared interest in {item.event}</p>
              <span>{item.time}</span>
            </div>
            <ArrowUpRight size={14} className="text-secondary ml-auto" />
          </div>
        ))}
      </div>
      <style jsx>{`
        .live-feed-stack { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; }
        .feed-row { 
          padding: 0.75rem !important; display: flex; align-items: center; gap: 0.75rem; 
          background: rgba(255,255,255,0.01) !important;
        }
        .feed-avatar { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; }
        .feed-content p { font-size: 0.75rem; line-height: 1.3; }
        .feed-content span { font-size: 0.65rem; color: var(--text-faint); }
        .ml-auto { margin-left: auto; }
      `}</style>
    </>
  );
}
