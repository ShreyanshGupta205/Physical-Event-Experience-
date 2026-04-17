'use client';
import { useState } from 'react';
import { Zap, AlertTriangle, Users, ShieldAlert, RefreshCw, Radio, Power } from 'lucide-react';

export default function SimulationConsole({ onSimulate }) {
  const [activeSim, setActiveSim] = useState(null);

  const simulations = [
    { id: 'surge', label: 'Crowd Surge', icon: Users, color: 'var(--primary)', desc: 'Simulate a 40% increase in Zone B occupancy.' },
    { id: 'gate', label: 'Gate Jam', icon: AlertTriangle, color: 'var(--accent)', desc: 'simulate Gate A hardware failure and queue spike.' },
    { id: 'security', label: 'System Alert', icon: ShieldAlert, color: '#fbbf24', desc: 'Trigger a platform-wide security synchronization check.' },
  ];

  const handleTrigger = (id) => {
    setActiveSim(id);
    onSimulate(id);
    setTimeout(() => setActiveSim(null), 3000);
  };

  return (
    <div className="simulation-console glass-card animate-fadeInUp">
      <div className="card-header">
        <div className="sim-title">
          <Zap size={16} className="text-secondary" />
          <h3>Sim-Ops Deck</h3>
        </div>
        <div className={`sim-status ${activeSim ? 'active' : ''}`}>
          {activeSim ? 'RUNNING SIM...' : 'STANDBY'}
        </div>
      </div>

      <div className="sim-grid">
        {simulations.map(sim => {
          const Icon = sim.icon;
          const isActive = activeSim === sim.id;
          return (
            <button 
              key={sim.id} 
              className={`sim-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleTrigger(sim.id)}
              disabled={activeSim !== null}
            >
              <div className="sim-btn-icon" style={{ background: sim.color + '1a', color: sim.color }}>
                {isActive ? <RefreshCw size={18} className="animate-spin" /> : <Icon size={18} />}
              </div>
              <div className="sim-btn-meta">
                <strong>{sim.label}</strong>
                <span>{sim.desc}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="console-footer">
        <div className="system-ping">
          <Radio size={12} className="animate-pulse" />
          <span>LATENCY: 14ms</span>
        </div>
        <button className="btn btn-ghost btn-sm btn-icon"><Power size={14} /></button>
      </div>

      <style jsx>{`
        .simulation-console { padding: 1.5rem !important; margin-bottom: 2rem; border-color: var(--secondary-glow); }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .sim-title { display: flex; align-items: center; gap: 0.6rem; }
        .sim-title h3 { font-size: 0.875rem; font-weight: 800; letter-spacing: 0.05em; }
        
        .sim-status { 
          font-size: 0.65rem; font-weight: 900; color: var(--text-faint); 
          padding: 0.2rem 0.5rem; background: var(--bg-card2); border-radius: 4px;
          border: 1px solid var(--border);
        }
        .sim-status.active { color: var(--secondary); border-color: var(--secondary-glow); }

        .sim-grid { display: flex; flex-direction: column; gap: 1rem; }
        .sim-btn { 
          display: flex; gap: 1rem; align-items: center; padding: 1rem;
          background: var(--bg-card2); border: 1px solid var(--border); border-radius: var(--radius-md);
          text-align: left; cursor: pointer; transition: var(--transition);
        }
        .sim-btn:hover:not(:disabled) { border-color: var(--secondary); background: var(--bg-glass); }
        .sim-btn.active { border-color: var(--secondary); border-style: dashed; }
        
        .sim-btn-icon { 
          width: 40px; height: 40px; border-radius: 10px; 
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .sim-btn-meta { display: flex; flex-direction: column; gap: 0.2rem; }
        .sim-btn-meta strong { font-size: 0.8125rem; color: var(--text); }
        .sim-btn-meta span { font-size: 0.7rem; color: var(--text-faint); line-height: 1.3; }

        .console-footer { 
          margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
        }
        .system-ping { display: flex; align-items: center; gap: 0.4rem; font-size: 0.6rem; color: var(--text-faint); font-weight: 800; }
      `}</style>
    </div>
  );
}
