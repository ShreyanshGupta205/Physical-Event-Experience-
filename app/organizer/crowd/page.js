'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { EVENTS } from '@/data/mockData';
import { AlertTriangle, Users, Activity, Zap, Maximize2, Shield } from 'lucide-react';
import SimulationConsole from '@/components/organizer/SimulationConsole';

const MANAGED_EVENT_ID = 'evt-001';

function occupancyColor(occ) {
  if (occ < 0.4) return 'var(--secondary)';
  if (occ < 0.7) return '#fbbf24';
  return 'var(--accent)';
}

export default function CrowdMonitorPage() {
  const event = EVENTS.find(e => e.id === MANAGED_EVENT_ID) || EVENTS?.[0] || { title: 'N/A', zones: [], gates: [] };
  const [zones, setZones] = useState(event.zones?.map(z => ({ ...z, occupancy: 0 })) || []);
  const [gates, setGates] = useState(event.gates?.map(g => ({ ...g, queue: 0 })) || []);
  const [alerts, setAlerts] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [liveMode, setLiveMode] = useState(true);

  const handleSimulate = (type) => {
    let msg = '';
    let level = 'warning';
    if (type === 'surge') {
      msg = 'SIM: Sudden crowd surge detected in Zone B';
      level = 'danger';
      setZones(prev => prev.map(z => z.id === 'Z2' ? { ...z, occupancy: Math.min(1, z.occupancy + 0.3) } : z));
    } else if (type === 'gate') {
      msg = 'SIM: Gate A reporting hardware desync — checking logs...';
      setGates(prev => prev.map(g => g.id === 'G1' ? { ...g, queue: g.queue + 20 } : g));
    } else {
      msg = 'SIM: Platform-wide security sync initiated.';
      level = 'warning';
    }
    setAlerts(prev => [{ id: Date.now(), msg, level, time: 'Now' }, ...prev]);
  };

  useEffect(() => {
    if (!liveMode) return;
    const t = setInterval(() => {
      setZones(prev => prev.map(z => ({
        ...z,
        occupancy: Math.min(1, Math.max(0, z.occupancy + (Math.random() - 0.48) * 0.05))
      })));
      setGates(prev => prev.map(g => ({
        ...g,
        queue: Math.max(0, g.queue + Math.floor((Math.random() - 0.45) * 8)),
        throughput: Math.max(5, g.throughput + Math.floor((Math.random() - 0.5) * 4))
      })));
    }, 2500);
    return () => clearInterval(t);
  }, [liveMode]);

  const totalOcc = zones?.reduce((s, z) => s + (z.occupancy || 0) * (z.capacity || 0), 0) || 0;
  const totalCap = zones?.reduce((s, z) => s + (z.capacity || 0), 0) || 1; // Prevent div by zero
  const avgOcc = totalOcc / totalCap;

  return (
    <DashboardLayout>
      <div className="command-center animate-fadeIn">
        <header className="command-header">
          <div className="title-group">
            <div className={`intel-status ${liveMode ? 'active' : ''}`}>
              <span className="pulse-dot" />
              <span>{liveMode ? 'Live Intel' : 'Monitor Paused'}</span>
            </div>
            <h1 className="Hub-heading">Venue Command Center</h1>
            <p className="HUB-lead">{event.title} • Real-time Monitoring</p>
          </div>
          
          <div className="control-group">
            <button className={`btn btn-lg ${liveMode ? 'btn-secondary' : 'btn-ghost'}`} onClick={() => setLiveMode(!liveMode)}>
              <Activity size={18} /> {liveMode ? 'Suspend Stream' : 'Resume Stream'}
            </button>
            <button className="btn btn-primary btn-lg"><Maximize2 size={18} /> View Fullscreen</button>
          </div>
        </header>

        <section className="command-stats animate-fadeInUp">
          {[
            { label: 'System Health', value: 'Nominal', icon: Shield, color: 'var(--secondary)' },
            { label: 'Active Occupancy', value: `${Math.round(avgOcc * 100)}%`, icon: Users, color: occupancyColor(avgOcc) },
            { label: 'Total Souls', value: Math.round(totalOcc).toLocaleString(), icon: Zap, color: 'var(--primary)' },
            { label: 'Incident Index', value: alerts.length, icon: AlertTriangle, color: alerts.length > 0 ? 'var(--accent)' : 'var(--secondary)' },
          ].map(stat => (
            <div key={stat.label} className="glass-card metric-card">
              <div className="metric-icon" style={{ background: stat.color + '22', color: stat.color }}>
                <stat.icon size={20} />
              </div>
              <div className="metric-content">
                <span className="metric-label">{stat.label}</span>
                <span className="metric-value" style={{ color: stat.color }}>{stat.value}</span>
              </div>
            </div>
          ))}
        </section>

        <div className="command-main-grid">
          <div className="heatmap-section glass-card animate-fadeInUp">
            <div className="card-header">
              <h3 className="section-title small">Real-time Heatmap</h3>
              <div className="legend">
                <div className="leg-item"><span style={{ background: 'var(--secondary)' }} /> Safe</div>
                <div className="leg-item"><span style={{ background: '#fbbf24' }} /> High</div>
                <div className="leg-item"><span style={{ background: 'var(--accent)' }} /> Critical</div>
              </div>
            </div>

            <div className="heatmap-canvas glass-container">
              <svg viewBox="0 0 500 360" className="venue-svg">
                <rect x="10" y="10" width="480" height="340" rx="12" className="venue-base" />
                {zones.map((z, i) => {
                  const layouts = [
                    { x: 30, y: 30, w: 270, h: 180 },
                    { x: 320, y: 30, w: 150, h: 100 },
                    { x: 320, y: 150, w: 150, h: 90 },
                    { x: 320, y: 260, w: 150, h: 70 },
                  ];
                  const l = layouts[i] || layouts[0];
                  const col = occupancyColor(z.occupancy);
                  const isSel = selectedZone === z.id;
                  
                  return (
                    <g key={z.id} className={`zone-group ${isSel ? 'selected' : ''}`} onClick={() => setSelectedZone(isSel ? null : z.id)}>
                      <rect x={l.x} y={l.y} width={l.w} height={l.h} rx="8" className="zone-rect" style={{ fill: col + '1a', stroke: col + (isSel ? 'cc' : '44') }} />
                      <text x={l.x + l.w/2} y={l.y + l.h/2 - 10} className="zone-name" fill={col}>{z.name}</text>
                      <text x={l.x + l.w/2} y={l.y + l.h/2 + 15} className="zone-occ" fill={col}>{Math.round(z.occupancy * 100)}%</text>
                      {isSel && <rect x={l.x - 2} y={l.y - 2} width={l.w + 4} height={l.h + 4} rx="10" className="zone-selected-glow" style={{ stroke: col }} />}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <aside className="command-sidebar">
            <SimulationConsole onSimulate={handleSimulate} />

            <div className="glass-card gate-monitor animate-fadeInUp">
              <h3 className="section-title small">Gate Intelligence</h3>
              <div className="gate-stack">
                {gates.map(gate => {
                  const col = gate.queue > 35 ? 'var(--accent)' : gate.queue > 20 ? '#fbbf24' : 'var(--secondary)';
                  return (
                    <div key={gate.id} className="gate-row">
                      <div className="gate-info">
                        <strong>{gate.name}</strong>
                        <span style={{ color: col }}>{gate.queue} in queue</span>
                      </div>
                      <div className="progress-bar mini">
                        <div className="progress-fill" style={{ width: `${Math.min(100, gate.queue * 2)}%`, background: col }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card alert-panel animate-fadeInUp">
              <h3 className="section-title small">System Alerts</h3>
              <div className="alert-list">
                {alerts.map(a => (
                  <div key={a.id} className={`intel-alert ${a.level}`}>
                    <AlertTriangle size={14} />
                    <div className="alert-body">
                      <p>{a.msg}</p>
                      <span>{a.time} ago</span>
                    </div>
                  </div>
                ))}
                {alerts.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-faint)', fontSize: '0.8rem' }}>
                    No system alerts detected.
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>

        {selectedZone && (
          <div className="zone-focus glass-card animate-fadeInUp">
            <div className="focus-header">
              <Zap size={20} className="text-secondary" />
              <h3>Critical Insight: {zones.find(z => z.id === selectedZone)?.name}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedZone(null)}>Close</button>
            </div>
            <div className="focus-grid">
              <div className="focus-item"><span>Throughput</span><strong>{Math.floor(Math.random() * 50) + 20} p/min</strong></div>
              <div className="focus-item"><span>Predicted Full</span><strong>42 mins</strong></div>
              <div className="focus-item"><span>Staff Alert</span><strong>Normal</strong></div>
              <button className="btn btn-primary">Dispatch Team</button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .command-center { max-width: 1400px; margin: 0 auto; }
        .command-header { display: flex; justify-content: space-between; align-items: flex-end; padding: 2rem 0; margin-bottom: 2rem; }
        .intel-status { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.25rem 0.75rem; background: var(--bg-glass); border: 1px solid var(--border); border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--text-faint); margin-bottom: 0.75rem; }
        .intel-status.active { color: var(--accent); border-color: var(--accent-glow); }
        .intel-status.active .pulse-dot { background: var(--accent); box-shadow: 0 0 10px var(--accent); }
        .pulse-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--text-faint); }
        .control-group { display: flex; gap: 1rem; }
        .command-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 3rem; }
        .metric-card { display: flex; align-items: center; gap: 1.25rem; padding: 1.5rem !important; }
        .metric-icon { width: 48px; height: 48px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; }
        .metric-content { display: flex; flex-direction: column; gap: 0.25rem; }
        .metric-label { font-size: 0.75rem; color: var(--text-faint); font-weight: 700; text-transform: uppercase; }
        .metric-value { font-size: 1.5rem; font-family: 'Space Grotesk', sans-serif; font-weight: 700; }
        .command-main-grid { display: grid; grid-template-columns: 1fr 360px; gap: 2rem; margin-bottom: 2rem; }
        .heatmap-section { padding: 2rem !important; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .legend { display: flex; gap: 1rem; }
        .leg-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: var(--text-faint); }
        .leg-item span { width: 8px; height: 8px; border-radius: 2px; }
        .heatmap-canvas { background: #05070a; border-radius: var(--radius-lg); padding: 1rem; border: 1px solid var(--border); }
        .venue-base { fill: #0a0e14; stroke: var(--border); stroke-width: 1; }
        .zone-group { cursor: pointer; transition: var(--transition); }
        .zone-rect { transition: var(--transition); stroke-dasharray: 4; }
        .zone-group:hover .zone-rect { fill-opacity: 0.2; }
        .zone-name { font-size: 10px; font-weight: 700; font-family: Inter, sans-serif; text-transform: uppercase; text-anchor: middle; opacity: 0.7; }
        .zone-occ { font-size: 18px; font-weight: 800; font-family: 'Space Grotesk', sans-serif; text-anchor: middle; }
        .zone-selected-glow { fill: none; stroke-width: 2; animation: zone-pulse 2s infinite; }
        @keyframes zone-pulse { 0% { stroke-opacity: 1; stroke-width: 2; } 100% { stroke-opacity: 0; stroke-width: 10; } }
        .command-sidebar { display: flex; flex-direction: column; gap: 2rem; }
        .gate-stack { display: flex; flex-direction: column; gap: 1.5rem; }
        .gate-row { display: flex; flex-direction: column; gap: 0.5rem; }
        .gate-info { display: flex; justify-content: space-between; font-size: 0.8125rem; font-weight: 600; }
        .mini { height: 6px; }
        .alert-list { display: flex; flex-direction: column; gap: 1rem; }
        .intel-alert { display: flex; gap: 1rem; padding: 1rem; border-radius: var(--radius-md); background: rgba(255, 255, 255, 0.02); border-left: 3px solid transparent; }
        .intel-alert.warning { border-color: #fbbf24; color: #fbbf24; }
        .intel-alert.danger { border-color: var(--accent); color: var(--accent); }
        .alert-body p { font-size: 0.8125rem; font-weight: 600; line-height: 1.4; margin-bottom: 0.25rem; }
        .alert-body span { font-size: 0.7rem; opacity: 0.6; }
        .zone-focus { padding: 2rem !important; background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), transparent) !important; border-color: var(--secondary-glow); }
        .focus-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
        .focus-header h3 { flex: 1; font-size: 1.25rem; }
        .focus-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; align-items: center; }
        .focus-item { display: flex; flex-direction: column; gap: 0.25rem; }
        .focus-item span { font-size: 0.75rem; color: var(--text-faint); text-transform: uppercase; font-weight: 700; }
        .focus-item strong { font-size: 1.25rem; }
        @media (max-width: 1024px) { .command-stats { grid-template-columns: repeat(2, 1fr); } .command-main-grid { grid-template-columns: 1fr; } .focus-grid { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; } }
      `}</style>
    </DashboardLayout>
  );
}
