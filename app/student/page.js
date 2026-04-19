'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { 
  QrCode, Calendar, MapPin, Clock, CheckCircle, 
  AlertCircle, ChevronRight, Bell, Zap, TrendingUp, 
  ArrowRight, Sparkles, Activity
} from 'lucide-react';

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmed', color: 'var(--secondary)', badge: 'badge-secondary' },
  pending: { label: 'Pending', color: 'var(--warning)', badge: 'badge-warning' },
  cancelled: { label: 'Cancelled', color: 'var(--accent)', badge: 'badge-accent' },
};

export default function StudentDashboard() {
  const { user, registrations, events } = useApp();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 30000);
    return () => clearInterval(t);
  }, []);

  const upcomingEvents = events.filter(e => e.status === 'upcoming').slice(0, 3);
  const confirmedRegs = registrations.filter(r => r.status === 'confirmed');

  const notifications = [
    { id: 1, type: 'reminder', msg: 'National Hackathon starts in 3 days!', time: '2h ago', unread: true, icon: Bell, color: 'var(--primary)' },
    { id: 2, type: 'success', msg: 'AI Summit registration confirmed.', time: '1d ago', unread: true, icon: CheckCircle, color: 'var(--secondary)' },
    { id: 3, type: 'info', msg: 'Venue update: Design Workshop → Room 4B.', time: '2d ago', unread: false, icon: AlertCircle, color: 'var(--warning)' },
  ];

  return (
    <DashboardLayout>
      <div className="hub-container animate-fadeIn">
        {/* Header Section */}
        <section className="hub-header stagger">
          <div className="welcome-box">
            <h1 className="Hub-heading">Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Member'}</span> 👋</h1>
            <p className="HUB-lead">Your personalized experience portal is ready.</p>
          </div>
          <Link href="/" className="btn btn-primary btn-lg">
            <Sparkles size={18} /> Explore Experiences
          </Link>
        </section>

        {/* Dynamic Stats Grid */}
        <section className="HUB-stats-grid stagger">
          {[
            { label: 'Events Scheduled', value: registrations.length, icon: Calendar, color: 'var(--primary)', glow: 'var(--primary-glow)' },
            { label: 'Passes Ready', value: confirmedRegs.length, icon: QrCode, color: 'var(--secondary)', glow: 'var(--secondary-glow)' },
            { label: 'XP Earned', value: 850, icon: Sparkles, color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.1)' },
            { label: 'Activity Rate', value: 'High', icon: Activity, color: 'var(--accent)', glow: 'var(--accent-glow)' },
          ].map(stat => (
            <div key={stat.label} className="glass-card stat-card HUB-stagger-item" style={{ position: 'relative', overflow: 'hidden' }}>
              <div className="stat-bg-mesh" style={{ background: `radial-gradient(circle at 100% 100%, ${stat.color}22, transparent 60%)` }} />
              <div className="HUB-stat-icon" style={{ background: stat.glow, color: stat.color, border: `1px solid ${stat.color}44` }}>
                <stat.icon size={22} />
              </div>
              <div className="HUB-stat-body">
                <span className="HUB-stat-label">{stat.label}</span>
                <span className="HUB-stat-value">{stat.value}</span>
              </div>
            </div>
          ))}
        </section>

        <div className="HUB-main-grid">
          {/* Main Feed: Registrations */}
          <div className="HUB-feed">
            <div className="section-header">
              <h2 className="section-title">Active Experiences</h2>
              <Link href="/student/events" className="btn btn-ghost btn-sm">Manage All <ArrowRight size={14} /></Link>
            </div>
            
            <div className="HUB-card-stack">
              {registrations.length === 0 ? (
                <div className="glass-card empty-state">
                  <Calendar size={48} className="empty-icon" />
                  <h3>No Active Bookings</h3>
                  <p>Start your journey by discovering upcoming hackathons and summits.</p>
                  <Link href="/" className="btn btn-primary">Browse Events</Link>
                </div>
              ) : registrations.slice(0, 3).map(reg => (
                <div key={reg.id} className="glass-card experience-card animate-fadeInUp">
                  <div className="experience-badge" style={{ background: reg.color }}>
                    <Zap size={16} fill="white" />
                  </div>
                  <div className="experience-body">
                    <div className="experience-top">
                      <span className="badge badge-secondary">{reg.type}</span>
                      <h3 className="experience-title">{reg.eventTitle}</h3>
                    </div>
                    <div className="experience-meta">
                      <div className="meta-item"><Calendar size={14} />{new Date(reg.date).toLocaleDateString()}</div>
                      <div className="meta-item"><MapPin size={14} />{reg.venue.split(',')[0]}</div>
                    </div>
                    <div className="experience-actions">
                      <Link href="/student/pass" className="btn btn-primary btn-sm">
                        <QrCode size={14} /> Get Pass
                      </Link>
                      <Link href={`/event/${reg.eventId}`} className="btn btn-ghost btn-sm">Details</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar: Notifications & Browse */}
          <aside className="HUB-sidebar">
            <div className="HUB-sidebar-section">
              <div className="section-header">
                <h3 className="section-title small">Updates</h3>
              </div>
              <div className="glass-card HUB-notif-box">
                {notifications.map(n => (
                  <div key={n.id} className={`HUB-notif-item ${n.unread ? 'unread' : ''}`}>
                    <div className="notif-indicator" style={{ background: n.color }} />
                    <div className="notif-info">
                      <p>{n.msg}</p>
                      <span>{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="HUB-sidebar-section">
              <div className="section-header">
                <h3 className="section-title small">Recommended</h3>
              </div>
              <div className="HUB-rec-list">
                {upcomingEvents.map(e => (
                  <Link key={e.id} href={`/event/${e.id}`} className="glass-card rec-card">
                    <div className="rec-icon" style={{ background: e.color + '22', color: e.color }}>
                      <TrendingUp size={16} />
                    </div>
                    <div className="rec-info">
                      <h4>{e.title}</h4>
                      <p>{e.type} · {e.registered} in</p>
                    </div>
                    <ChevronRight size={14} className="rec-arrow" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        .hub-container { max-width: 1400px; margin: 0 auto; }
        
        .hub-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 3rem;
          padding: 2rem 0;
        }

        .Hub-heading { font-size: 2.5rem; }
        .HUB-lead { font-size: 1.125rem; color: var(--text-muted); margin-top: 0.5rem; }

        .HUB-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 4rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.751rem !important;
        }

        .HUB-stat-icon {
          width: 52px; height: 52px;
          border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
          position: relative; z-index: 1;
        }
        
        .stat-bg-mesh {
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          pointer-events: none;
          z-index: 0;
        }

        .HUB-stat-body { display: flex; flex-direction: column; gap: 0.25rem; }
        .HUB-stat-label { font-size: 0.75rem; color: var(--text-faint); text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em; }
        .HUB-stat-value { font-size: 1.75rem; font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: var(--text); }

        .HUB-main-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 3rem;
        }

        .HUB-card-stack { display: flex; flex-direction: column; gap: 1.5rem; }

        .experience-card {
          display: flex;
          gap: 2rem;
          padding: 2rem !important;
        }

        .experience-badge {
          width: 64px; height: 64px;
          border-radius: var(--radius-lg);
          display: flex; align-items: center; justify-content: center;
          color: white; flex-shrink: 0;
          box-shadow: 0 8px 16px rgba(0,0,0,0.5);
        }

        .experience-body { flex: 1; }
        .experience-top { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
        .experience-title { font-size: 1.25rem; }
        .experience-meta { display: flex; gap: 1.5rem; margin-bottom: 1.5rem; }
        .meta-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem; color: var(--text-muted); }
        .experience-actions { display: flex; gap: 0.75rem; }

        .empty-state { padding: 4rem !important; text-align: center; }
        .empty-icon { color: var(--text-faint); margin-bottom: 1.5rem; }

        .HUB-sidebar { display: flex; flex-direction: column; gap: 3rem; }
        .HUB-sidebar-section .section-title.small { font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-faint); margin-bottom: 1.25rem; }

        .HUB-notif-box { padding: 0 !important; overflow: hidden; }
        .HUB-notif-item {
          display: flex; gap: 1rem; padding: 1.25rem;
          border-bottom: 1px solid var(--border);
          transition: var(--transition);
        }
        .HUB-notif-item:last-child { border-bottom: none; }
        .HUB-notif-item.unread { background: rgba(99, 102, 241, 0.03); }
        .notif-indicator { width: 4px; border-radius: 2px; flex-shrink: 0; }
        .notif-info p { font-size: 0.875rem; margin-bottom: 0.25rem; line-height: 1.4; }
        .notif-info span { font-size: 0.75rem; color: var(--text-faint); }

        .HUB-rec-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .rec-card {
          display: flex; align-items: center; gap: 1rem;
          padding: 1rem !important;
          text-decoration: none; color: inherit;
        }
        .rec-card:hover { transform: translateX(4px); }
        .rec-icon { width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .rec-info h4 { font-size: 0.875rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }
        .rec-info p { font-size: 0.75rem; color: var(--text-muted); }
        .rec-arrow { margin-left: auto; color: var(--text-faint); }

        @media (max-width: 1280px) {
          .HUB-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .HUB-main-grid { grid-template-columns: 1fr; }
          .HUB-sidebar { grid-template-columns: repeat(2, 1fr); display: grid; }
        }

        @media (max-width: 768px) {
          .HUB-stats-grid { grid-template-columns: 1fr; }
          .HUB-sidebar { grid-template-columns: 1fr; }
          .experience-card { flex-direction: column; gap: 1rem; }
        }
      `}</style>
    </DashboardLayout>
  );
}
