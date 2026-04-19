'use client';
import { Users, Zap, Activity, Ticket } from 'lucide-react';

export default function KpiGrid({ registeredCount, pct, checkedInCount = 0 }) {
  const kpis = [
    { 
      label: 'Registrations', 
      value: registeredCount.toLocaleString(), 
      trend: '+12% from avg', 
      icon: Users, 
      color: 'var(--primary)' 
    },
    { 
      label: 'Check-in Volume', 
      value: checkedInCount.toLocaleString(), 
      trend: `${pct}% of capacity`, 
      icon: Ticket, 
      color: 'var(--secondary)' 
    },
    { 
      label: 'Arrival Pressure', 
      value: `${Math.round((registeredCount / (checkedInCount || 1)) * 10) / 10}x`, 
      trend: 'Queue intensity', 
      icon: Activity, 
      color: 'var(--accent)' 
    },
    { 
      label: 'Throughput', 
      value: '142/min', 
      trend: 'Optimal flow', 
      icon: Zap, 
      color: '#fbbf24' 
    },
  ];

  return (
    <>
      <section className="mission-kpis">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="glass-card kpi-card animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="kpi-icon" style={{ background: kpi.color + '1a', color: kpi.color }}>
                <Icon size={20} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">{kpi.label}</span>
                <h2 className="kpi-value">{kpi.value}</h2>
                <span className="kpi-trend">{kpi.trend}</span>
              </div>
            </div>
          );
        })}
      </section>
      <style jsx>{`
        .mission-kpis { 
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; 
          margin-bottom: 2.5rem;
        }
        .kpi-card { padding: 1.5rem !important; display: flex; align-items: center; gap: 1.25rem; }
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
