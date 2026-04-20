'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { REGISTRATION_FEED, CROWD_TIMELINE } from '@/data/mockData';
import {
  Share2, PlusCircle, BarChart2, Map, Radio, Zap
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

import LiveFeed from '@/components/organizer/LiveFeed';
import KpiGrid from '@/components/organizer/KpiGrid';
import ZoneMatrix from '@/components/organizer/ZoneMatrix';
import AiInsights from '@/components/organizer/AiInsights';
import SimulationConsole from '@/components/organizer/SimulationConsole';

export default function OrganizerDashboard() {
  const { events, loading } = useApp();
  const event = events[0]; // Default to first event or null
  const [telemetry, setTelemetry] = useState({ registered: 0, checkedIn: 0 });
  const [simMode, setSimMode] = useState(false);

  useEffect(() => {
    if (event) {
      setTelemetry({ registered: event.registered, checkedIn: event.checkedIn });
      
      const t = setInterval(async () => {
        try {
          const res = await fetch(`/api/events/${event.id}/stats`);
          if (res.ok) {
            const data = await res.json();
            setTelemetry({ registered: data.registered, checkedIn: data.checkedIn });
          }
        } catch (e) {
          console.error("Telemetry fetch failed", e);
        }
      }, 4000); // Poll every 4 seconds
      return () => clearInterval(t);
    }
  }, [event?.id]);

  const handleSimulate = (type) => {
    console.log(`Triggering Simulation: ${type}`);
    if (type === 'surge') {
      setTelemetry(prev => ({ ...prev, checkedIn: prev.checkedIn + 50 }));
    }
  };

  const pct = event ? Math.round((telemetry.checkedIn / event.capacity) * 100) : 0;


  if (loading) {
    return (
      <DashboardLayout>
        <div className="telemetry-loading animate-pulse">
           <Radio className="animate-spin" size={32} />
           <p>SYNCHRONIZING SECURE TELEMETRY...</p>
        </div>
        <style jsx>{`
          .telemetry-loading { height: 70vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.5rem; color: var(--text-faint); }
        `}</style>
      </DashboardLayout>
    );
  }

  if (!event || !event.gates || !event.zones) {
    return (
      <DashboardLayout>
        <div className="empty-mission-state">
           <Map size={48} className="text-faint" />
           <h2>No Active Missions</h2>
           <p>You currently have no events assigned to your coordinates.</p>
           <Link href="/organizer/create" className="btn btn-primary">INITIALIZE NEW EVENT</Link>
        </div>
        <style jsx>{`
          .empty-mission-state { height: 70vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.5rem; text-align: center; }
          .empty-mission-state p { color: var(--text-faint); margin-bottom: 1rem; }
        `}</style>
      </DashboardLayout>
    );
  }


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
            <button className={`btn btn-sm ${simMode ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setSimMode(!simMode)}>
               {simMode ? <Zap size={14} fill="currentColor" /> : <PlusCircle size={14} />} SIM-MODE
            </button>
            <div className="divider-v" />
            <button className="btn btn-ghost btn-lg"><Share2 size={18} /> Invite</button>
            <Link href="/organizer/analytics" className="btn btn-ghost btn-lg"><BarChart2 size={18} /> Intel</Link>
          </div>
        </header>

        {/* Global KPIs via Modular Component */}
        <KpiGrid registeredCount={telemetry.registered} pct={pct} checkedInCount={telemetry.checkedIn} />

        {/* AI & Simulation Layer - Tactical Row */}
        <div className="tactical-row animate-fadeIn">
           <AiInsights eventId={event.id} />
           {simMode && <SimulationConsole onSimulate={handleSimulate} />}
        </div>


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
                    <linearGradient id="checkGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-faint)', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-faint)', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: '12px' }} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '10px', fontWeight: 'bold' }} />
                  <Area type="monotone" name="Registrations" dataKey="count" stroke="var(--primary)" strokeWidth={3} fill="url(#regGrad)" />
                  <Area type="monotone" name="Check-ins" dataKey="actual" stroke="var(--secondary)" strokeWidth={3} fill="url(#checkGrad)" />
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

            {/* Live Feed Panel via Modular Component */}
            <div className="glass-card feed-brick animate-fadeInUp">
              <div className="card-header">
                <h3>Activity Pulse</h3>
                <Radio size={14} className="text-accent" />
              </div>
              <LiveFeed feed={REGISTRATION_FEED} />
            </div>
          </aside>
        </div>

        {/* Global Overview Section via Modular Component */}
        <ZoneMatrix zones={event.zones} />

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

        .mission-actions { display: flex; gap: 1rem; align-items: center; }
        .divider-v { width: 1px; height: 30px; background: var(--border); }

        .tactical-row { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2.5rem; }
        @media (max-width: 900px) { .tactical-row { grid-template-columns: 1fr; } }

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

        .card-header { display: flex; justify-content: space-between; align-items: center; }
        .section-title.small { font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-faint); margin-bottom: 0; }

        @media (max-width: 1024px) {
          .mission-main-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </DashboardLayout>
  );
}
