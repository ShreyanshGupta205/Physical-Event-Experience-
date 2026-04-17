'use client';
import { Users, Zap, Activity, Clock } from 'lucide-react';

export default function KpiGrid({ registeredCount, pct }) {
  return (
    <>
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
      <style jsx>{`
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
        
        @media (max-width: 1024px) {
          .mission-kpis { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </>
  );
}
