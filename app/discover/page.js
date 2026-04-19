'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { CATEGORY_OPTIONS } from '@/data/mockData';
import {
  Search, Calendar, MapPin, Clock,
  TrendingUp, Zap, ArrowRight, Sparkles
} from 'lucide-react';

function EventCard({ event, onRegister, isRegistered, isRegistering }) {
  const pct = Math.round((event.registered / event.capacity) * 100);
  const remaining = event.capacity - event.registered;
  const isAlmostFull = pct >= 85;

  return (
    <div className="glass-card stagger-item event-card-wrapper">
      <div className="event-banner" style={{ background: `linear-gradient(135deg, ${event.color}66, rgba(13,15,28,0.4)), radial-gradient(circle at top right, ${event.color}55, transparent)` }}>
        <div className="badge-group">
          <span className="badge badge-secondary">{event.type}</span>
          {event.trending && <span className="badge badge-accent"><TrendingUp size={10} /> Hot</span>}
        </div>
      </div>

      <div className="event-content">
        <h3 className="event-title">{event.title}</h3>
        <p className="event-desc">{event.description}</p>

        <div className="event-meta-grid">
          <div className="meta-item"><Calendar size={14} /> <span>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span></div>
          <div className="meta-item"><Clock size={14} /> <span>{event.time}</span></div>
          <div className="meta-item"><MapPin size={14} /> <span className="truncate">{event.venue.split(',')[0]}</span></div>
        </div>

        <div className="capacity-section">
          <div className="capacity-meta">
            <span>{event.registered.toLocaleString()} joined</span>
            <span className={isAlmostFull ? 'text-accent' : 'text-primary'}>{remaining.toLocaleString()} left</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%`, background: event.color }} />
          </div>
        </div>

        <div className="card-actions">
          <Link href={`/event/${event.id}`} className="btn btn-ghost btn-sm">Details</Link>
          {isRegistered ? (
            <Link href="/student/pass" className="btn btn-secondary btn-sm">Pass Attached</Link>
          ) : (
            <button 
              className="btn btn-primary btn-sm" 
              onClick={() => onRegister(event)}
              disabled={remaining === 0 || isRegistering}
            >
              {isRegistering ? 'Processing...' : (remaining === 0 ? 'Closed' : 'Secure Spot')}
            </button>
          )}
        </div>
      </div>


      <style jsx>{`
        .event-card-wrapper { display: flex; flex-direction: column; height: 100%; }
        .event-banner { height: 140px; margin: -1.5rem -1.5rem 1.5rem; padding: 1rem; display: flex; align-items: flex-start; background-size: 200% 200% !important; animation: pan-gradient 10s ease infinite alternate; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        @keyframes pan-gradient { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
        .badge-group { display: flex; gap: 0.5rem; }
        .event-title { margin-bottom: 0.5rem; font-size: 1.125rem; }
        .event-desc { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1.25rem; line-height: 1.5; height: 2.6rem; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        .event-meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.5rem; }
        .meta-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: var(--text-faint); }
        .capacity-section { margin-bottom: 1.5rem; }
        .capacity-meta { display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 0.5rem; font-weight: 600; }
        .card-actions { display: flex; gap: 0.75rem; justify-content: space-between; }
        .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80px; }
        .text-accent { color: var(--accent); }
        .text-primary { color: var(--primary-light); }
      `}</style>
    </div>
  );
}

export default function DiscoverPage() {
  const { events, registrations, registerForEvent } = useApp();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('trending');
  const [registerModal, setRegisterModal] = useState(null);
  const [successModal, setSuccessModal] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [regError, setRegError] = useState(null);
  const [liveCount, setLiveCount] = useState(42810);

  useEffect(() => {
    const t = setInterval(() => setLiveCount(c => c + Math.floor(Math.random() * 3)), 3000);
    return () => clearInterval(t);
  }, []);

  const registeredIds = registrations.map(r => r.eventId);

  const filtered = events.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.venue.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || e.category === activeCategory.toLowerCase();
    return matchSearch && matchCat;
  });

  return (
    <DashboardLayout>
      <div className="landing-container">
        <section className="hero-section animate-fadeIn">
          <div className="hero-glow" />
          <div className="hero-content-box">
            <div className="live-indicator-pill">
              <span className="status-dot live" />
              <span>{liveCount.toLocaleString()} Explorers Online</span>
            </div>
            <h1 className="hero-heading animate-fadeInUp">
              Discover Physical<br />
              <span className="gradient-text">Experiences</span>
            </h1>
            
            <div className="hero-action-row animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <div className="premium-search">
                <Search className="search-icon" size={20} />
                <input 
                  type="text" 
                  placeholder="What are you looking for?" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="filter-section stagger">
          <div className="section-header">
            <h2 className="section-title">Experience Categories</h2>
            <div className="header-actions">
              <select className="input minimal" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="trending">Trending Now</option>
                <option value="date">Upcoming Soon</option>
              </select>
            </div>
          </div>

          <div className="category-scroll">
            {CATEGORY_OPTIONS.map(cat => (
              <button 
                key={cat} 
                className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section className="events-section">
          <div className="grid-auto stagger">
            {filtered.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                onRegister={setRegisterModal}
                isRegistered={registeredIds.includes(event.id)}
                isRegistering={registering && registerModal?.id === event.id}
              />
            ))}
          </div>
        </section>

      </div>

      {/* Modals... */}
      {registerModal && (
        <div className="modal-overlay" onClick={() => { setRegisterModal(null); setRegError(null); }}>
          <div className="glass-card modal animate-fadeInUp" onClick={e => e.stopPropagation()}>
            <div className="modal-icon-wrap" style={{ color: registerModal.color }}>
              <Sparkles size={32} />
            </div>
            <h2 className="modal-title">Confirm Attendance</h2>
            <p className="modal-desc">Secure your spot at <strong>{registerModal.title}</strong>. Your digital pass will be generated instantly.</p>
            {regError && <p style={{ color: 'var(--accent)', fontSize: '0.875rem', marginBottom: '1rem' }}>⚠️ {regError}</p>}
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => { setRegisterModal(null); setRegError(null); }}>Maybe Later</button>
              <button 
                className="btn btn-primary" 
                disabled={registering}
                onClick={async () => {
                  setRegistering(true);
                  setRegError(null);
                  try {
                    const reg = await registerForEvent(registerModal);
                    setRegisterModal(null);
                    setSuccessModal(reg);
                  } catch (err) {
                    setRegError(err.message || 'Registration failed. Please try again.');
                  } finally {
                    setRegistering(false);
                  }
                }}
              >
                {registering ? 'Securing...' : 'Confirm Spot'}
              </button>
            </div>
          </div>
        </div>
      )}

      {successModal && (
        <div className="modal-overlay" onClick={() => setSuccessModal(null)}>
          <div className="glass-card modal text-center animate-fadeInUp" onClick={e => e.stopPropagation()}>
            <div className="success-icon animate-float">
              <Zap size={32} />
            </div>
            <h2 className="modal-title">Great Choice! 🎉</h2>
            <p className="modal-desc">Registration confirmed for {successModal.event?.title || 'Event'}.</p>
            <div className="pass-pill">Pass ID: {successModal.passId}</div>
            <div className="modal-actions full">
              <Link href="/student/pass" className="btn btn-primary w-full" onClick={() => setSuccessModal(null)}>
                View Digital Pass <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .landing-container { max-width: 1400px; margin: 0 auto; }
        .hero-section { position: relative; padding: 4rem 0; text-align: center; margin-bottom: 2rem; }
        .hero-glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 800px; height: 400px; background: radial-gradient(circle at 30% 50%, rgba(99, 102, 241, 0.4) 0%, transparent 60%), radial-gradient(circle at 70% 50%, rgba(16, 185, 129, 0.3) 0%, transparent 60%); filter: blur(60px); pointer-events: none; z-index: 0; animation: pulse-glow 8s ease-in-out infinite alternate; }
        @keyframes pulse-glow { 0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; } 100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; } }
        .hero-content-box { position: relative; z-index: 1; }
        .live-indicator-pill { display: inline-flex; align-items: center; gap: 0.75rem; padding: 0.5rem 1.25rem; background: var(--bg-glass); border: 1px solid var(--border); border-radius: var(--radius-full); font-size: 0.8125rem; font-weight: 700; color: var(--text-muted); margin-bottom: 2rem; }
        .hero-heading { font-size: clamp(2.5rem, 6vw, 4rem); margin-bottom: 1.5rem; line-height: 1.05; }
        .hero-action-row { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 2rem; max-width: 700px; margin: 0 auto; }
        .premium-search { flex: 1; display: flex; align-items: center; background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: var(--radius-full); padding: 0.35rem 1.5rem; transition: all 0.4s var(--easing); box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.02), 0 8px 32px rgba(0, 0, 0, 0.2); }
        .premium-search:focus-within { background: rgba(255, 255, 255, 0.06); border-color: rgba(255, 255, 255, 0.25); box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.05), 0 12px 40px rgba(99, 102, 241, 0.25), 0 0 0 1px rgba(99, 102, 241, 0.3); transform: translateY(-2px); }
        .premium-search input { width: 100%; background: transparent; border: none; padding: 0.75rem; color: var(--text); font-size: 1rem; outline: none; }
        .search-icon { color: var(--text-faint); }
        .filter-section { margin-bottom: 3rem; }
        .section-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }
        .category-scroll { display: flex; gap: 0.75rem; overflow-x: auto; padding-bottom: 1rem; }
        .category-scroll::-webkit-scrollbar { display: none; }
        .category-chip { padding: 0.625rem 1.25rem; border-radius: var(--radius-full); background: var(--bg-glass); border: 1px solid var(--border); color: var(--text-muted); font-size: 0.8125rem; font-weight: 600; cursor: pointer; white-space: nowrap; transition: var(--transition); }
        .category-chip:hover { border-color: var(--border-bright); color: var(--text); }
        .category-chip.active { background: var(--primary); color: white; border-color: var(--primary); box-shadow: var(--shadow-primary); }
        .modal { width: 100%; max-width: 480px; padding: 3rem !important; text-align: center; }
        .modal-icon-wrap { margin-bottom: 1.5rem; display: flex; justify-content: center; }
        .modal-title { font-size: 1.75rem; margin-bottom: 1rem; }
        .modal-desc { color: var(--text-muted); margin-bottom: 2.5rem; line-height: 1.6; }
        .modal-actions { display: flex; gap: 1rem; }
        .modal-actions.full { flex-direction: column; }
        .success-icon { width: 80px; height: 80px; background: var(--secondary-glow); color: var(--secondary); display: flex; align-items: center; justify-content: center; border-radius: 50%; margin: 0 auto 2rem; }
        .pass-pill { display: inline-block; padding: 0.5rem 1.5rem; background: rgba(255,255,255,0.05); border: 1px dashed var(--border-bright); border-radius: var(--radius-md); font-family: monospace; color: var(--secondary-light); margin-bottom: 2.5rem; }
        .text-center { text-align: center; }
        .w-full { width: 100%; }
        .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80px; }
      `}</style>
    </DashboardLayout>
  );
}
