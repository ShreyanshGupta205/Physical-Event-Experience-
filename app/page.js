'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { CATEGORY_OPTIONS, TYPE_OPTIONS } from '@/data/mockData';
import {
  Search, Filter, Calendar, MapPin, Users, Clock,
  TrendingUp, Star, Zap, ArrowRight, ChevronRight,
  Play, Activity, Sparkles
} from 'lucide-react';

function EventCard({ event, onRegister, isRegistered }) {
  const pct = Math.round((event.registered / event.capacity) * 100);
  const remaining = event.capacity - event.registered;
  const isAlmostFull = pct >= 85;

  return (
    <div className="glass-card stagger-item">
      <div className="event-banner" style={{ background: `linear-gradient(135deg, ${event.color}44, transparent)` }}>
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
              disabled={remaining === 0}
            >
              {remaining === 0 ? 'Closed' : 'Secure Spot'}
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .event-banner {
          height: 120px;
          margin: -1.5rem -1.5rem 1.5rem;
          padding: 1rem;
          display: flex;
          align-items: flex-start;
        }
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

export default function HomePage() {
  const { events, registrations, registerForEvent } = useApp();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeType, setActiveType] = useState('All Types');
  const [sortBy, setSortBy] = useState('trending');
  const [registerModal, setRegisterModal] = useState(null);
  const [successModal, setSuccessModal] = useState(null);
  const [liveCount, setLiveCount] = useState(42810);

  useEffect(() => {
    const t = setInterval(() => setLiveCount(c => c + Math.floor(Math.random() * 3)), 3000);
    return () => clearInterval(t);
  }, []);

  const registeredIds = registrations.map(r => r.eventId);

  const filtered = events.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.venue.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || e.category === activeCategory.toLowerCase();
    const matchType = activeType === 'All Types' || e.type === activeType;
    return matchSearch && matchCat && matchType;
  });

  return (
    <DashboardLayout>
      <div className="landing-container">
        {/* Cinematic Hero */}
        <section className="hero-section animate-fadeIn">
          <div className="hero-glow" />
          <div className="hero-content-box">
            <div className="live-indicator-pill">
              <span className="status-dot live" />
              <span>{liveCount.toLocaleString()} Explorers Online</span>
            </div>
            <h1 className="hero-heading animate-fadeInUp">
              The Next Frontier of<br />
              <span className="gradient-text">Physical Experiences</span>
            </h1>
            <p className="hero-lead animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              Seamless entry, real-time crowd intelligence, and exclusive access to the most anticipated events across the sphere.
            </p>
            
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
              <button className="btn btn-primary btn-lg">Explore Now</button>
            </div>

            <div className="hero-metrics animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <div className="metric"><strong>120+</strong><span>Daily Events</span></div>
              <div className="metric-sep" />
              <div className="metric"><strong>1.2M</strong><span>Tickets Issued</span></div>
              <div className="metric-sep" />
              <div className="metric"><strong>99.9%</strong><span>Entry Success</span></div>
            </div>
          </div>
        </section>

        {/* Categories & Filter Bar */}
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

        {/* Live Events Grid */}
        <section className="events-section">
          <div className="grid-auto stagger">
            {filtered.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                onRegister={setRegisterModal}
                isRegistered={registeredIds.includes(event.id)}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Modern Modals */}
      {registerModal && (
        <div className="modal-overlay" onClick={() => setRegisterModal(null)}>
          <div className="glass-card modal animate-fadeInUp" onClick={e => e.stopPropagation()}>
            <div className="modal-icon-wrap" style={{ color: registerModal.color }}>
              <Sparkles size={32} />
            </div>
            <h2 className="modal-title">Confirm Attendance</h2>
            <p className="modal-desc">Secure your spot at <strong>{registerModal.title}</strong>. Your digital pass will be generated instantly.</p>
            
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setRegisterModal(null)}>Maybe Later</button>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  const reg = registerForEvent(registerModal);
                  setRegisterModal(null);
                  setSuccessModal(reg);
                }}
              >
                Confirm Spot
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
            <p className="modal-desc">Registration confirmed for {successModal.eventTitle}.</p>
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
        
        .hero-section {
          position: relative;
          padding: 6rem 0;
          text-align: center;
          margin-bottom: 4rem;
        }

        .hero-glow {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 600px; height: 300px;
          background: radial-gradient(circle, var(--primary-glow) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .hero-content-box { position: relative; z-index: 1; }

        .live-indicator-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1.25rem;
          background: var(--bg-glass);
          border: 1px solid var(--border);
          border-radius: var(--radius-full);
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 2rem;
        }

        .hero-heading {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          margin-bottom: 1.5rem;
          line-height: 1.05;
        }

        .hero-lead {
          font-size: 1.125rem;
          color: var(--text-muted);
          max-width: 600px;
          margin: 0 auto 3rem;
          line-height: 1.6;
        }

        .hero-action-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 4rem;
          max-width: 700px;
          margin: 0 auto 4rem;
        }

        .premium-search {
          flex: 1;
          display: flex;
          align-items: center;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 0.25rem 1rem;
          transition: var(--transition);
        }

        .premium-search:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px var(--primary-glow);
        }

        .premium-search input {
          width: 100%;
          background: transparent;
          border: none;
          padding: 0.75rem;
          color: var(--text);
          font-size: 1rem;
          outline: none;
        }

        .search-icon { color: var(--text-faint); }

        .hero-metrics {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
        }

        .metric { display: flex; flex-direction: column; gap: 0.25rem; }
        .metric strong { font-size: 1.5rem; font-family: 'Space Grotesk', sans-serif; }
        .metric span { font-size: 0.75rem; color: var(--text-faint); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; }
        .metric-sep { width: 1px; height: 32px; background: var(--border); }

        .filter-section { margin-bottom: 3rem; }
        .section-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }
        
        .category-scroll {
          display: flex;
          gap: 0.75rem;
          overflow-x: auto;
          padding-bottom: 1rem;
        }
        .category-scroll::-webkit-scrollbar { display: none; }

        .category-chip {
          padding: 0.625rem 1.25rem;
          border-radius: var(--radius-full);
          background: var(--bg-glass);
          border: 1px solid var(--border);
          color: var(--text-muted);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: var(--transition);
        }

        .category-chip:hover { border-color: var(--border-bright); color: var(--text); }
        .category-chip.active { background: var(--primary); color: white; border-color: var(--primary); box-shadow: var(--shadow-primary); }

        .modal { width: 100%; max-width: 480px; padding: 3rem !important; text-align: center; }
        .modal-icon-wrap { margin-bottom: 1.5rem; display: flex; justify-content: center; }
        .modal-title { font-size: 1.75rem; margin-bottom: 1rem; }
        .modal-desc { color: var(--text-muted); margin-bottom: 2.5rem; line-height: 1.6; }
        .modal-actions { display: flex; gap: 1rem; }
        .modal-actions.full { flex-direction: column; }
        
        .success-icon {
          width: 80px; height: 80px;
          background: var(--secondary-glow);
          color: var(--secondary);
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          margin: 0 auto 2rem;
        }

        .pass-pill {
          display: inline-block;
          padding: 0.5rem 1.5rem;
          background: rgba(255,255,255,0.05);
          border: 1px dashed var(--border-bright);
          border-radius: var(--radius-md);
          font-family: monospace;
          color: var(--secondary-light);
          margin-bottom: 2.5rem;
        }

        .text-center { text-align: center; }
        .w-full { width: 100%; }

        @media (max-width: 768px) {
          .hero-action-row { flex-direction: column; }
          .premium-search { width: 100%; }
          .hero-metrics { flex-wrap: wrap; gap: 1.5rem; }
          .metric-sep { display: none; }
        }
      `}</style>
    </DashboardLayout>
  );
}
