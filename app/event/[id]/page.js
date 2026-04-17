'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { EVENTS } from '@/data/mockData';
import {
  Calendar, MapPin, Users, Clock, ArrowLeft, Zap, QrCode,
  CheckCircle, Tag, Star, TrendingUp, ArrowRight, Share2, 
  ShieldCheck, Info, Map as MapIcon, Globe
} from 'lucide-react';
import SessionFeedback from '@/components/event/SessionFeedback';
import LiveEngagement from '@/components/event/LiveEngagement';

const SCHEDULE_ICONS = { 
  keynote: '🎙️', session: '📡', workshop: '🛠️', 
  panel: '👥', logistics: '⏳', main: '🚀', 
  ceremony: '✨', networking: '🥂', showcase: '💎' 
};

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { registrations, registerForEvent } = useApp();

  const event = EVENTS.find(e => e.id === id);
  const [showModal, setShowModal] = useState(false);
  const [registered, setRegistered] = useState(false);

  const isRegistered = registrations.some(r => r.eventId === id) || registered;
  const pct = event ? Math.round((event.registered / event.capacity) * 100) : 0;
  const remaining = event ? event.capacity - event.registered : 0;

  if (!event) {
    return (
      <DashboardLayout>
        <div className="error-state animate-fadeIn">
          <Info size={40} className="text-secondary" />
          <h2>Protocol Interrupted</h2>
          <p>The requested event coordinates could not be retrieved.</p>
          <Link href="/" className="btn btn-primary">RETURN TO TERMINAL</Link>
        </div>
        <style jsx>{`
          .error-state { height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.5rem; text-align: center; }
          .error-state h2 { font-size: 2rem; }
          .error-state p { color: var(--text-faint); }
        `}</style>
      </DashboardLayout>
    );
  }

  const handleRegister = () => {
    registerForEvent(event);
    setRegistered(true);
    setShowModal(false);
  };

  return (
    <DashboardLayout>
      <div className="event-experience animate-fadeIn">
        
        {/* Navigation / Actions */}
        <nav className="experience-nav">
          <button onClick={() => router.back()} className="btn btn-ghost btn-sm">
            <ArrowLeft size={16} /> BACK
          </button>
          <div className="nav-actions">
            <button className="btn btn-ghost btn-icon"><Share2 size={16} /></button>
            <button className="btn btn-ghost btn-icon"><ShieldCheck size={16} /></button>
          </div>
        </nav>

        {/* Cinematic Hero */}
        <header className="experience-hero glass-card animate-fadeInUp">
          <div className="hero-backdrop" style={{ background: `linear-gradient(135deg, ${event.color}44, transparent), radial-gradient(circle at 80% 20%, ${event.color}22, transparent)` }} />
          
          <div className="hero-content">
            <div className="hero-meta">
              <span className="type-badge" style={{ color: event.color, borderColor: event.color + '44' }}>{event.type.toUpperCase()}</span>
              {event.featured && <span className="premium-badge"><Star size={12} fill="currentColor" /> FEATURED</span>}
            </div>
            
            <h1 className="Hub-heading large">{event.title}</h1>
            <p className="HUB-lead max-w-700">{event.description}</p>

            <div className="hero-stats-grid">
              <div className="h-stat">
                <Calendar size={18} style={{ color: event.color }} />
                <span>{new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="h-stat">
                <Clock size={18} style={{ color: event.color }} />
                <span>{event.time}</span>
              </div>
              <div className="h-stat">
                <MapPin size={18} style={{ color: event.color }} />
                <span>{event.venue}</span>
              </div>
              <div className="h-stat">
                <Users size={18} style={{ color: event.color }} />
                <span>{event.registered.toLocaleString()} JOINED</span>
              </div>
            </div>
          </div>
        </header>

        <div className="experience-grid">
          {/* Detailed Intel */}
          <main className="intel-layer">
            
            {/* Speakers / Experts */}
            {event.speakers.length > 0 && (
              <section className="glass-card section-card animate-fadeInUp">
                <h3 className="section-title small">The Visionaries</h3>
                <div className="experts-stack">
                  {event.speakers.map(sp => (
                    <div key={sp.name} className="expert-brick">
                      <div className="expert-avatar" style={{ background: `linear-gradient(135deg, ${event.color}, transparent)` }}>
                        {sp.avatar}
                      </div>
                      <div className="expert-meta">
                        <strong>{sp.name}</strong>
                        <span>{sp.role}</span>
                      </div>
                      <ArrowRight size={14} className="expert-arrow" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Mission Timeline */}
            <section className="glass-card section-card animate-fadeInUp">
              <h3 className="section-title small">Mission Protocol</h3>
              <div className="protocol-timeline">
                {event.schedule.map((item, i) => (
                  <div key={i} className="protocol-step">
                    <div className="step-marker">
                      <div className="dot" style={{ background: event.color }} />
                      <div className="line" />
                    </div>
                    <div className="step-content">
                      <div className="step-icon">{SCHEDULE_ICONS[item.type] || '💠'}</div>
                      <div className="step-info">
                        <p>{item.title}</p>
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>

          {/* Registration Deck */}
          <aside className="registration-deck">
            <div className="glass-card deck-brick animated-border animate-fadeInUp">
              <h3 className="section-title small">Access Gateway</h3>
              
              <div className="occupancy-telem">
                <div className="tele-top">
                  <span className="tele-label">CAPACITY UTILIZATION</span>
                  <span className="tele-val">{pct}%</span>
                </div>
                <div className="progress-bar tall">
                   <div className="progress-fill" style={{ width: `${pct}%`, background: event.color }} />
                </div>
                <p className="tele-sub">{remaining.toLocaleString()} slots remain available for registration.</p>
              </div>

              {isRegistered ? (
                <div className="reg-status success animate-fadeIn">
                  <div className="status-icon"><ShieldCheck size={28} /></div>
                  <div className="status-text">
                    <strong>ACCESS AUTHORIZED</strong>
                    <span>Your identity has been verified for this mission.</span>
                  </div>
                  <Link href="/student/pass" className="btn btn-secondary full-btn">
                    <QrCode size={18} /> RETRIEVE PASS
                  </Link>
                </div>
              ) : (
                <button 
                  className="btn btn-primary full-btn lg shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${event.color}, ${event.color}cc)` }}
                  onClick={() => setShowModal(true)}
                  disabled={remaining === 0}
                >
                  <Zap size={18} /> {remaining === 0 ? 'MISSION CAPACITY REACHED' : 'AUTHORIZE REGISTRATION'}
                </button>
              )}

              <div className="deck-footer">
                <Globe size={14} />
                <span>Instant blockchain-verified QR generation.</span>
              </div>
            </div>

            {/* Live Engagement Feature */}
            <div className="animate-fadeInUp" style={{ animationDelay: '0.1s', marginBottom: '2rem' }}>
              <LiveEngagement />
            </div>

            {/* Practical Points */}
            <div className="glass-card section-card animate-fadeInUp">
              <h3 className="section-title small">Venue Entry Points</h3>
              <div className="entry-points">
                {event.gates.map(g => (
                  <div key={g.id} className="entry-point-row">
                    <MapIcon size={14} className="text-secondary" />
                    <strong>{g.name}</strong>
                    <span className="badge badge-ghost ml-auto">{g.capacity} p/h</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Feedback */}
            <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <SessionFeedback />
            </div>
          </aside>
        </div>
      </div>

      {/* Auth Confirmation Modal */}
      {showModal && (
        <div className="experience-overlay" onClick={() => setShowModal(false)}>
          <div className="experience-modal glass-card animate-scaleUp" onClick={e => e.stopPropagation()}>
            <div className="modal-inner">
               <div className="modal-icon" style={{ background: event.color + '22', color: event.color }}>
                 <Zap size={32} />
               </div>
               <h3>Confirm Neutral Access?</h3>
               <p>By proceeding, you will be registered for <strong>{event.title}</strong> and a unique entry token will be generated.</p>
               
               <div className="action-row">
                 <button className="btn btn-ghost" onClick={() => setShowModal(false)}>ABORT</button>
                 <button 
                    className="btn btn-primary" 
                    style={{ background: event.color }}
                    onClick={handleRegister}
                  >
                    CONFIRM ACCESS
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .event-experience { max-width: 1200px; margin: 0 auto; padding: 1rem 0; }
        
        .experience-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .nav-actions { display: flex; gap: 0.75rem; }

        .experience-hero { 
          position: relative; padding: 4rem 3rem !important; overflow: hidden; 
          margin-bottom: 3rem; min-height: 400px; display: flex; align-items: flex-end;
        }
        .hero-backdrop { position: absolute; inset: 0; z-index: 0; }
        .hero-content { position: relative; z-index: 1; }
        .hero-meta { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; }
        .type-badge { padding: 0.25rem 0.75rem; border: 1px solid; border-radius: 4px; font-size: 0.65rem; font-weight: 800; letter-spacing: 0.05em; }
        .premium-badge { padding: 0.25rem 0.75rem; background: var(--secondary-glow); color: var(--secondary); border: 1px solid var(--secondary-glow); border-radius: 4px; font-size: 0.65rem; font-weight: 800; display: flex; align-items: center; gap: 0.4rem; }

        .hero-stats-grid { display: flex; gap: 2.5rem; margin-top: 2.5rem; flex-wrap: wrap; }
        .h-stat { display: flex; align-items: center; gap: 0.75rem; font-size: 0.8125rem; font-weight: 700; color: var(--text-faint); }
        .h-stat span { color: var(--text); }

        .experience-grid { display: grid; grid-template-columns: 1fr 380px; gap: 2.5rem; }

        .section-card { padding: 2rem !important; margin-bottom: 2rem; }
        .experts-stack { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem; }
        .expert-brick { 
          display: flex; align-items: center; gap: 1.25rem; padding: 1rem; 
          background: var(--bg-card2); border-radius: var(--radius-md); border: 1px solid var(--border);
          transition: var(--transition); cursor: pointer;
        }
        .expert-brick:hover { border-color: var(--secondary); transform: translateX(5px); }
        .expert-avatar { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 800; }
        .expert-meta { display: flex; flex-direction: column; }
        .expert-meta strong { font-size: 0.9375rem; }
        .expert-meta span { font-size: 0.75rem; color: var(--text-faint); }
        .expert-arrow { margin-left: auto; color: var(--text-faint); }

        .protocol-timeline { position: relative; padding-left: 2rem; margin-top: 2rem; }
        .protocol-step { position: relative; display: flex; gap: 1.5rem; padding-bottom: 2rem; }
        .step-marker { position: absolute; left: -2rem; top: 0; bottom: 0; display: flex; flex-direction: column; align-items: center; }
        .step-marker .dot { width: 10px; height: 10px; border-radius: 50%; border: 2px solid var(--bg); z-index: 1; }
        .step-marker .line { flex: 1; width: 1px; background: var(--border); }
        .step-content { display: flex; gap: 1rem; align-items: flex-start; }
        .step-icon { font-size: 1.25rem; }
        .step-info p { font-size: 0.9375rem; font-weight: 700; }
        .step-info span { font-size: 0.75rem; color: var(--text-faint); }

        .registration-deck { position: sticky; top: 2rem; }
        .deck-brick { padding: 2.5rem !important; display: flex; flex-direction: column; gap: 2rem; margin-bottom: 2rem; }
        .animated-border { border: 1px solid var(--secondary-glow); box-shadow: 0 0 20px rgba(0,212,170,0.05); }

        .occupancy-telem { display: flex; flex-direction: column; gap: 0.75rem; }
        .tele-top { display: flex; justify-content: space-between; align-items: flex-end; }
        .tele-label { font-size: 0.65rem; font-weight: 800; color: var(--text-faint); }
        .tele-val { font-size: 1.25rem; font-weight: 800; font-family: 'Space Grotesk', sans-serif; }
        .tele-sub { font-size: 0.7rem; color: var(--text-faint); line-height: 1.4; }

        .reg-status { text-align: center; display: flex; flex-direction: column; gap: 1.5rem; padding: 2rem; background: var(--bg-card2); border-radius: var(--radius-md); }
        .reg-status.success { border: 1px solid rgba(74, 222, 128, 0.1); }
        .status-icon { color: #4ade80; margin: 0 auto; }
        .status-text strong { display: block; font-size: 1rem; letter-spacing: 0.1em; color: #4ade80; margin-bottom: 0.5rem; }
        .status-text span { font-size: 0.75rem; color: var(--text-faint); }

        .deck-footer { display: flex; align-items: center; gap: 0.5rem; font-size: 0.65rem; color: var(--text-faint); justify-content: center; font-weight: 800; }

        .entry-points { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem; }
        .entry-point-row { display: flex; align-items: center; gap: 0.75rem; font-size: 0.8125rem; }

        .experience-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .experience-modal { width: 100%; max-width: 440px; padding: 3rem !important; }
        .modal-inner { text-align: center; }
        .modal-icon { width: 64px; height: 64px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
        .modal-inner h3 { font-size: 1.5rem; margin-bottom: 1rem; }
        .modal-inner p { color: var(--text-faint); font-size: 0.875rem; line-height: 1.6; margin-bottom: 2rem; }
        .action-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        @media (max-width: 1024px) {
          .experience-grid { grid-template-columns: 1fr; }
          .registration-deck { position: static; }
        }
      `}</style>
    </DashboardLayout>
  );
}
}
    </DashboardLayout>
  );
}
