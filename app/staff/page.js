'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { 
  UserCheck, QrCode, Search, Radio, Clock, AlertTriangle, 
  CheckCircle, ChevronRight, Users, Activity, Zap, ArrowRight,
  ShieldCheck, Scan, XCircle, Terminal
} from 'lucide-react';

export default function StaffPortal() {
  const { events, checkInAttendee } = useApp();
  const [selectedEventId, setSelectedEventId] = useState('');
  const [passId, setPassId] = useState('');
  const [status, setStatus] = useState({ type: null, msg: '' });
  const [recentCheckIns, setRecentCheckIns] = useState([]);
  const [scanning, setScanning] = useState(false);

  const activeEvent = events.find(e => e.id === selectedEventId) || events[0];

  useEffect(() => {
    if (!selectedEventId && events.length > 0) {
      setSelectedEventId(events[0].id);
    }
  }, [events]);

  const handleCheckIn = (e) => {
    if (e) e.preventDefault();
    if (!passId.trim()) return;

    setStatus({ type: 'loading', msg: 'Verifying Security Token...' });
    
    setTimeout(() => {
      const result = checkInAttendee(selectedEventId, passId);
      if (result.success) {
        setStatus({ type: 'success', msg: 'ACCESS GRANTED' });
        setRecentCheckIns(prev => [
          { id: Date.now(), passId, time: new Date().toLocaleTimeString(), name: 'Alpha Check-in' },
          ...prev.slice(0, 5)
        ]);
        setPassId('');
      } else {
        setStatus({ type: 'error', msg: 'TOKEN REJECTED' });
      }
      setTimeout(() => setStatus({ type: null, msg: '' }), 3000);
    }, 1000);
  };

  const simulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      const mockId = `SPHERE-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      setPassId(mockId);
    }, 1800);
  };

  return (
    <DashboardLayout>
      <div className="staff-console animate-fadeIn">
        
        {/* Console Header */}
        <header className="console-header">
          <div className="tactical-brand">
            <div className="op-badge">UNIT-71 / FIELD OPS</div>
            <h1 className="Hub-heading">Entry Protocol Control</h1>
            <p className="HUB-lead">Gate verification and local synchronization active.</p>
          </div>

          <div className="sync-status">
            <div className="pulse-circle" />
            <span>SYNCED TO CLOUD</span>
          </div>
        </header>

        <div className="console-grid">
          {/* Main Action Area: The Scanner */}
          <div className="scanner-bay glass-card animate-fadeInUp">
            <div className="venue-selector">
              <label><Terminal size={14} /> ACTIVE ZONE</label>
              <select 
                value={selectedEventId}
                onChange={e => setSelectedEventId(e.target.value)}
              >
                {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
              </select>
            </div>

            <div className={`optics-frame ${scanning ? 'active' : ''}`}>
              <div className="viewfinder">
                <div className="corner tl" /><div className="corner tr" /><div className="corner bl" /><div className="corner br" />
                {scanning ? <div className="laser-beam" /> : <QrCode size={80} className="placeholder-icon" />}
                {status.type === 'success' && <div className="result-overlay success"><CheckCircle size={48} /></div>}
                {status.type === 'error' && <div className="result-overlay error"><XCircle size={48} /></div>}
              </div>
            </div>

            <div className="manual-entry">
              <h3 className="section-title small">Identity Verification</h3>
              <form onSubmit={handleCheckIn}>
                <div className="id-input-wrap">
                  <Scan size={18} className="scan-icon" />
                  <input 
                    placeholder="SCANNING FOR PASSPORT ID..." 
                    value={passId}
                    onChange={e => setPassId(e.target.value)}
                  />
                  <button type="submit" disabled={status.type === 'loading'}>VERIFY</button>
                </div>
              </form>
              <button className="btn btn-ghost btn-sm" onClick={simulateScan}>Initiate Hardware Scan</button>
            </div>
          </div>

          {/* Telemetry Panel */}
          <aside className="telemetry-panel">
            <div className="glass-card stat-brick animate-fadeInUp">
              <div className="brick-header">
                <h3>Venue Telemetry</h3>
                <span className="live-tag">LIVE</span>
              </div>
              <div className="brick-body">
                <div className="t-stat">
                  <span>CAPACITY UTIL</span>
                  <strong>{Math.round((activeEvent.checkedIn / Math.max(1, activeEvent.registered)) * 100)}%</strong>
                </div>
                <div className="t-stat">
                  <span>FLOW RATE</span>
                  <strong>{Math.floor(Math.random() * 20) + 10} p/min</strong>
                </div>
              </div>
              <div className="progress-bar mini">
                 <div className="progress-fill" style={{ width: `${(activeEvent.checkedIn / Math.max(1, activeEvent.registered)) * 100}%`, background: 'var(--secondary)' }} />
              </div>
            </div>

            <div className="glass-card activity-log animate-fadeInUp">
              <h3 className="section-title small">Operations Log</h3>
              <div className="log-stack">
                {recentCheckIns.length === 0 ? (
                  <div className="empty-log">STANDBY FOR DATA...</div>
                ) : (
                  recentCheckIns.map(log => (
                    <div key={log.id} className="log-entry animate-fadeIn">
                      <div className="log-icon success"><CheckCircle size={14} /></div>
                      <div className="log-info">
                        <strong>{log.passId}</strong>
                        <span>Verification Successful • {log.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        .staff-console { max-width: 1200px; margin: 0 auto; padding: 2rem 0; }
        
        .console-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; }
        .op-badge { 
          display: inline-block; padding: 0.25rem 0.75rem; 
          background: var(--secondary-glow); color: var(--secondary);
          font-size: 0.7rem; font-weight: 800; border-radius: 4px; border: 1px solid var(--secondary-glow);
          margin-bottom: 0.75rem;
        }

        .sync-status { display: flex; align-items: center; gap: 0.5rem; font-size: 0.7rem; font-weight: 800; color: #4ade80; }
        .pulse-circle { width: 8px; height: 8px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 10px #4ade80; animation: pulse 2s infinite; }

        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

        .console-grid { display: grid; grid-template-columns: 1fr 340px; gap: 2rem; }

        /* Scanner Bay */
        .scanner-bay { padding: 3rem !important; display: flex; flex-direction: column; align-items: center; border-color: var(--secondary-glow) !important; position: relative; overflow: hidden; }
        .scanner-bay::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, rgba(0, 212, 170, 0.03), transparent); pointer-events: none; }
        
        .venue-selector { width: 100%; max-width: 400px; margin-bottom: 3rem; }
        .venue-selector label { font-size: 0.7rem; font-weight: 800; color: var(--text-faint); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem; }
        .venue-selector select { 
          width: 100%; background: var(--bg-card2); border: 1px solid var(--border); 
          padding: 0.75rem 1rem; border-radius: var(--radius-md); color: var(--text);
          font-weight: 600; outline: none;
        }

        .optics-frame { 
          width: 260px; height: 260px; padding: 1.5rem; 
          border: 1px solid var(--border); border-radius: 30px; 
          background: rgba(255,255,255,0.02); margin-bottom: 3rem;
          transition: var(--transition); position: relative;
        }
        .optics-frame.active { border-color: var(--secondary); box-shadow: 0 0 40px var(--secondary-glow); transform: scale(1.02); }

        .viewfinder { 
          width: 100%; height: 100%; position: relative; 
          border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); 
          display: flex; align-items: center; justify-content: center; overflow: hidden;
        }
        .corner { position: absolute; width: 24px; height: 24px; border: 2px solid var(--secondary); opacity: 0.6; }
        .tl { top: 12px; left: 12px; border-right: 0; border-bottom: 0; }
        .tr { top: 12px; right: 12px; border-left: 0; border-bottom: 0; }
        .bl { bottom: 12px; left: 12px; border-right: 0; border-top: 0; }
        .br { bottom: 12px; right: 12px; border-left: 0; border-top: 0; }

        .laser-beam {
          position: absolute; top: 0; left: 0; width: 100%; height: 4px;
          background: var(--secondary); box-shadow: 0 0 20px var(--secondary);
          animation: scan-up-down 1.5s linear infinite; z-index: 5;
        }
        @keyframes scan-up-down { 0% { transform: translateY(20px); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(220px); opacity: 0; } }

        .placeholder-icon { opacity: 0.15; }
        .result-overlay { 
          position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
          animation: scale-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); z-index: 10;
        }
        @keyframes scale-up { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .result-overlay.success { background: rgba(74, 222, 128, 0.15); color: #4ade80; }
        .result-overlay.error { background: rgba(248, 113, 113, 0.15); color: #f87171; }

        .manual-entry { width: 100%; max-width: 440px; text-align: center; }
        .id-input-wrap { 
          position: relative; display: flex; gap: 0.5rem; 
          background: var(--bg-card2); border: 1px solid var(--border);
          padding: 0.5rem; border-radius: var(--radius-md); margin-bottom: 1rem;
        }
        .id-input-wrap input { 
          flex: 1; background: transparent; border: none; padding: 0.5rem; 
          color: var(--text); font-family: 'Space Grotesk', sans-serif; font-weight: 700;
          letter-spacing: 0.1em; outline: none;
        }
        .id-input-wrap button { 
          background: var(--secondary); color: black; border: none; 
          padding: 0 1.5rem; border-radius: var(--radius-sm); font-weight: 900; cursor: pointer; transition: var(--transition);
        }
        .id-input-wrap button:hover { transform: scale(0.98); }
        .scan-icon { margin-left: 0.5rem; align-self: center; color: var(--text-faint); }

        /* Telemetry Panel */
        .telemetry-panel { display: flex; flex-direction: column; gap: 2rem; }
        .stat-brick { padding: 1.5rem !important; }
        .brick-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .brick-header h3 { font-size: 0.875rem; font-weight: 800; letter-spacing: 0.05em; }
        .live-tag { font-size: 0.65rem; background: var(--secondary); color: black; padding: 0.1rem 0.4rem; border-radius: 2px; font-weight: 900; }
        
        .brick-body { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
        .t-stat { display: flex; flex-direction: column; gap: 0.25rem; }
        .t-stat span { font-size: 0.65rem; color: var(--text-faint); font-weight: 800; }
        .t-stat strong { font-size: 1.35rem; font-family: 'Space Grotesk', sans-serif; }

        .activity-log { padding: 1.5rem !important; flex: 1; max-height: 500px; overflow-y: auto; }
        .log-stack { display: flex; flex-direction: column; gap: 1.25rem; }
        .log-entry { display: flex; gap: 1rem; align-items: center; animation: fadeInLeft 0.4s ease-out; }
        .log-icon { 
          width: 36px; height: 36px; border-radius: 10px; 
          display: flex; align-items: center; justify-content: center;
          background: var(--bg-card2); border: 1px solid var(--border);
        }
        .log-icon.success { color: #4ade80; border-color: rgba(74, 222, 128, 0.2); background: rgba(74, 222, 128, 0.05); }
        .log-info { display: flex; flex-direction: column; gap: 0.125rem; }
        .log-info strong { font-size: 0.875rem; font-family: monospace; }
        .log-info span { font-size: 0.7rem; color: var(--text-faint); font-weight: 600; }
        .empty-log { font-size: 0.75rem; color: var(--text-faint); text-align: center; padding: 3rem 0; font-family: monospace; opacity: 0.5; }

        @keyframes fadeInLeft { from { transform: translateX(-10px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

        @media (max-width: 1024px) {
          .console-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </DashboardLayout>
  );
}
