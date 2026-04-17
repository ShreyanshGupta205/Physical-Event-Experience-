import { Calendar, MapPin, Zap } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="glass-card animate-fadeIn" style={{ position: 'relative', overflow: 'hidden', padding: '60px 40px', marginBottom: 40, border: 'none', background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.1), rgba(0, 212, 170, 0.05))' }}>
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: 400, height: 400, background: 'var(--primary)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.15 }}></div>
      <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: 300, height: 300, background: 'var(--secondary)', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.1 }}></div>
      
      <div style={{ maxWidth: 800, position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontSize: 'clamp(40px, 5vw, 64px)', marginBottom: 20, letterSpacing: '-1px' }}>
          Experience Events <br />
          <span className="gradient-text">Like Never Before</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-muted)', marginBottom: 40, maxWidth: 600, lineHeight: 1.6 }}>
          Discover, register, and seamlessly check into the most exciting campus events. Your smart event companion built for the future.
        </p>
        
        <div className="flex gap-16 flex-wrap" style={{ marginBottom: 40 }}>
          <button className="btn btn-primary btn-lg">Explore Events</button>
          <button className="btn btn-ghost btn-lg">My Passes</button>
        </div>

        <div className="flex gap-24 flex-wrap">
          <div className="flex items-center gap-8" style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            <Calendar size={18} style={{ color: 'var(--primary)' }} />
            <span>48+ Upcoming Events</span>
          </div>
          <div className="flex items-center gap-8" style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            <MapPin size={18} style={{ color: 'var(--secondary)' }} />
            <span>12 Prime Venues</span>
          </div>
          <div className="flex items-center gap-8" style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            <Zap size={18} style={{ color: 'var(--warning)' }} />
            <span>Instant Check-ins</span>
          </div>
        </div>
      </div>
    </div>
  );
}
