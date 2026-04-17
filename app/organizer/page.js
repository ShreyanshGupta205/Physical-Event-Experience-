'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { EVENTS, REGISTRATION_FEED, CROWD_TIMELINE } from '@/data/mockData';
import {
  Users, TrendingUp, CheckCircle, AlertTriangle, Clock,
  ChevronRight, PlusCircle, Bell, Activity, BarChart2,
  Map, Radio, Zap, ArrowUpRight, Share2, MoreHorizontal
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

const MANAGED_EVENT_ID = 'evt-001';

function LiveFeed({ feed }) {
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
    <div className="live-feed-stack">
      {items.map((item, i) => (
        <div key={item.id} className="feed-row glass-card">
          <div className="feed-avatar" style={{ background: `linear-gradient(135deg, hsl(${(item.name.charCodeAt(0) * 40) % 360}, 60%, 45%), transparent)` }}>
            {item.avatar}
          </div>
          <div className="feed-content">
            <p><strong>{item.name}</strong> shared interest in {item.event}</p>
            <span>{item.time}</span>
          </div>
          <ArrowUpRight size={14} className="text-secondary" />
        </div>
      ))}
    </div>
  );
}

export default function OrganizerDashboard() {
  const event = EVENTS.find(e => e.id === MANAGED_EVENT_ID) || EVENTS[0];
  const [registeredCount, setRegisteredCount] = useState(event.registered);

  useEffect(() => {
    const t = setInterval(() => {
      setRegisteredCount(c => c + (Math.random() > 0.6 ? 1 : 0));
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const pct = Math.round((registeredCount / event.capacity) * 100);

  return (
    <DashboardLayout>
      <div className="mission-control animate-fadeIn">
        
        {/* Header Section */}
        <header className="mission-header">
          <div className="mission-title-group">
            <div className="live-badge">
               <div className="pulse-dot" /> LIVE TRACKING
            </div>
            <h1 className="Hub-heading">{event.title}</h1>
            <p className="HUB-lead">Orchestrating {event.venue} • {event.date}</p>
          </div>
          
          <div className="mission-actions">
            <button className="btn btn-ghost btn-lg"><Share2 size={18} /> Invite</button>
            <Link href="/organizer/analytics" className="btn btn-ghost btn-lg"><BarChart2 size={18} /> Intel</Link>
            <Link href="/organizer/create" className="btn btn-primary btn-lg"><PlusCircle size={18} /> Scale Event</Link>
          </div>
        </header>

        {/* Global KPIs */}
        <section className="mission-kpis animate-fadeInUp">
          {[
            { label: 'Registered Explorers', value: registeredCount, icon: Users, color: 'var(--primary)', trend: '+8%' },
            { label: 'Entry Throughput', value: '42 p/m', icon: Zap, color: 'var(--secondary)', trend: 'Steady' },
            { label: 'Venue Saturation', value: `${pct}%`, icon: Activity, color: pct > 80 ? 'var(--accent)' : 'var(--secondary)', trend: 'High' },
            { label: 'Wait Estimation', value: '8.4m', icon: Clock, color: 'var(--info)', trend: 'Optimum' },
          ].map(kpi => (
            <div key={kpi.label} className="glass-card kpi-card">
              <div className="kpi-icon" style={{ color: kpi.color, background: kpi.color + '1a' }}>
                <kpi.icon size={20} />
              </div>
              <div className="kpi-body">
                <span className="kpi-val">{kpi.value}</span>
                <span className="kpi-lab">{kpi.label}</span>
              </div>
              <div className="kpi-trend">{kpi.trend}</div>
            </div>
          ))}
        </section>

        <div className="mission-main-grid">
          {/* Analytics Well */}
          <div className="glass-card analytics-well animate-fadeInUp">
            <div className="card-header">
              <h3 className="section-title small">Engagement Velocity</h3>
              <div className="chart-legend">
                <span>VOLUMETRIC GROWTH</span>
              </div>
            </div>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={CROWD_TIMELINE}>
                  <defs>
                    <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-faint)', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-faint)', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={3} fill="url(#regGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <aside className="mission-sidebar">
             {/* Gate Status Panel */}
             <div className="glass-card gate-telemetry animate-fadeInUp">
                <div className="card-header">
                  <h3>Gate Flow</h3>
                  <Link href="/organizer/crowd"><Map size={14} /></Link>
                </div>
                <div className="gate-flow-stack">
                  {event.gates.map(gate => {
                    const status = gate.queue > 40 ? 'critical' : gate.queue > 20 ? 'busy' : 'safe';
                    return (
                      <div key={gate.id} className={`gate-flow-row ${status}`}>
                        <div className="g-info">
                          <strong>{gate.name}</strong>
                          <span>{gate.throughput} throughput</span>
                        </div>
                        <div className="g-status">
                          <span className="g-queue">{gate.queue}</span>
                          <span className="g-tag">{status}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
             </div>

             {/* Live Feed Panel */}
             <div className="glass-card feed-brick animate-fadeInUp">
               <div className="card-header">
                 <h3>Activity Pulse</h3>
                 <Radio size={14} className="text-accent" />
               </div>
               <LiveFeed feed={REGISTRATION_FEED} />
             </div>
          </aside>
        </div>

        {/* Global Overview Section */}
        <section className="glass-card zone-matrix animate-fadeInUp">
          <div className="card-header">
            <h3 className="section-title small">Zone Saturation Matrix</h3>
            <div className="matrix-matrix-controls">
              <button className="btn btn-ghost btn-sm">Audit Zones</button>
            </div>
          </div>
          <div className="matrix-grid">
            {event.zones.map(zone => (
              <div key={zone.id} className="matrix-item glass-card">
                 <div className="m-header">
                   <div className="z-tag" style={{ background: zone.color + '22', color: zone.color }}>{zone.name}</div>
                   <MoreHorizontal size={16} />
                 </div>
                 <div className="m-body">
                   <div className="m-val">{Math.round(zone.occupancy * 100)}%</div>
                   <div className="progress-bar mini">
                     <div className="progress-fill" style={{ width: `${zone.occupancy * 100}%`, background: zone.color }} />
                   </div>
                 </div>
                 <div className="m-footer">
                   <span>CAPACITY: {zone.capacity}</span>
                 </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      <style jsx>{`
        .mission-control { max-width: 1400px; margin: 0 auto; padding: 1rem 0; }
        
        .mission-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; }
        .live-badge { 
          display: inline-flex; align-items: center; gap: 0.5rem; 
          padding: 0.25rem 0.75rem; background: var(--bg-glass);
          border: 1px solid var(--border); border-radius: var(--radius-full);
          font-size: 0.7rem; font-weight: 800; color: var(--accent);
          margin-bottom: 0.75rem;
        }
        .pulse-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 10px var(--accent); animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 100% { opacity: 0.4; transform: scale(1.5); } }

        .mission-actions { display: flex; gap: 1rem; }

        .mission-kpis { 
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; 
          margin-bottom: 2.5rem;
        }
        .kpi-card { padding: 1.5rem !important; display: flex; align-items: center; gap: 1.25rem; position: relative; }
        .kpi-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .kpi-body { display: flex; flex-direction: column; }
        .kpi-val { font-size: 1.5rem; font-family: 'Space Grotesk', sans-serif; font-weight: 700; }
        .kpi-lab { font-size: 0.75rem; font-weight: 700; color: var(--text-faint); text-transform: uppercase; }
        .kpi-trend { position: absolute; top: 1rem; right: 1rem; font-size: 0.7rem; font-weight: 800; color: #4ade80; }

        .mission-main-grid { display: grid; grid-template-columns: 1fr 360px; gap: 2rem; margin-bottom: 2.5rem; }
        .analytics-well { padding: 2rem !important; }
        .chart-wrap { margin-top: 2rem; }

        .mission-sidebar { display: flex; flex-direction: column; gap: 2rem; }
        
        .gate-telemetry { padding: 1.5rem !important; }
        .gate-flow-stack { display: flex; flex-direction: column; gap: 1.25rem; margin-top: 1.5rem; }
        .gate-flow-row { 
          display: flex; justify-content: space-between; align-items: center;
          padding: 0.75rem; background: var(--bg-card2); border-radius: var(--radius-md);
          border: 1px solid var(--border);
        }
        .gate-flow-row.critical { border-color: var(--accent-glow); }
        .g-info strong { font-size: 0.8125rem; display: block; }
        .g-info span { font-size: 0.7rem; color: var(--text-faint); }
        .g-status { text-align: right; }
        .g-queue { font-size: 1rem; font-weight: 800; display: block; }
        .g-tag { font-size: 0.6rem; font-weight: 900; text-transform: uppercase; border-radius: 2px; }
        .critical .g-tag { color: var(--accent); }
        .safe .g-tag { color: var(--secondary); }

        .feed-brick { padding: 1.5rem !important; }
        .live-feed-stack { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; }
        .feed-row { 
          padding: 0.75rem !important; display: flex; align-items: center; gap: 0.75rem; 
          background: rgba(255,255,255,0.01) !important;
        }
        .feed-avatar { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; }
        .feed-content p { font-size: 0.75rem; line-height: 1.3; }
        .feed-content span { font-size: 0.65rem; color: var(--text-faint); }

        .zone-matrix { padding: 2rem !important; }
        .matrix-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-top: 2rem; }
        .matrix-item { padding: 1.25rem !important; display: flex; flex-direction: column; gap: 1rem; }
        .m-header { display: flex; justify-content: space-between; align-items: center; }
        .z-tag { font-size: 0.65rem; font-weight: 900; padding: 0.1rem 0.6rem; border-radius: 4px; }
        .m-val { font-size: 1.5rem; font-weight: 700; font-family: 'Space Grotesk', sans-serif; }
        .m-footer { font-size: 0.65rem; color: var(--text-faint); letter-spacing: 0.05em; font-weight: 800; }

        @media (max-width: 1024px) {
          .mission-kpis { grid-template-columns: repeat(2, 1fr); }
          .mission-main-grid { grid-template-columns: 1fr; }
          .matrix-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </DashboardLayout>
  );
}
  );
}
