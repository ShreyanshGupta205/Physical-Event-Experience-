'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Users, Calendar, CheckCircle, TrendingUp, ShieldCheck, AlertTriangle, Activity, BarChart2, Star, Zap, Globe, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';



const MONTHLY = [
  { month: 'Jan', users: 0, events: 0 },
  { month: 'Feb', users: 0, events: 0 },
  { month: 'Mar', users: 0, events: 0 },
  { month: 'Apr', users: 0, events: 0 },
];

export default function AdminPanel() {
  const [data, setData] = useState({ stats: null, users: [], pendingEvents: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load admin stats");
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading || !data.stats) {
    return (
      <DashboardLayout>
         <div className="telemetry-loading animate-pulse" style={{ height: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--text-faint)' }}>
           <Activity className="animate-spin" size={32} />
           <p>AGGREGATING GLOBAL METRICS...</p>
         </div>
      </DashboardLayout>
    );
  }

  const { stats, users, pendingEvents } = data;

  return (
    <DashboardLayout>
      <div className="platform-control-tower animate-fadeIn">

        
        {/* Header */}
        <header className="tower-header">
          <div className="tower-title-group">
            <div className="tower-badge">
               <ShieldCheck size={14} /> SYS-ADMIN / GLOBAL
            </div>
            <h1 className="Hub-heading">Global Operations</h1>
            <p className="HUB-lead">Real-time platform synchronization and compliance monitoring.</p>
          </div>
          
          <div className="tower-actions">
            <Link href="/admin/users" className="btn btn-ghost btn-lg"><Users size={18} /> Directory</Link>
            <Link href="/admin/events" className="btn btn-primary btn-lg"><Zap size={18} /> Review {stats.pendingApprovals} Appeals</Link>
          </div>
        </header>

        {/* Tactical Metrics Grid */}
        <section className="stats-mosaic animate-fadeInUp">
          {[
            { label: 'Event Universe', value: stats.totalEvents, icon: Globe, color: 'var(--primary)', trend: '+12% vs LY', sub: 'Active Sessions' },
            { label: 'Platform Population', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'var(--secondary)', trend: 'Nominal', sub: 'Explorer Base' },
            { label: 'Global Throughput', value: stats.totalRegistrations.toLocaleString(), icon: Activity, color: 'var(--accent)', trend: 'Nominal', sub: 'Entries & Passes' },
            { label: 'System Integrity', value: '100%', icon: ShieldCheck, color: '#4ade80', trend: 'Optimal', sub: 'Operation Uptime' },
          ].map(s => (
            <div key={s.label} className="glass-card mosaic-brick">
              <div className="brick-top">
                <div className="brick-icon" style={{ background: s.color + '1a', color: s.color }}>
                  <s.icon size={20} />
                </div>
                <div className="brick-trend">
                  <ArrowUpRight size={14} /> {s.trend}
                </div>
              </div>
              <div className="brick-val-group">
                <span className="brick-val">{s.value}</span>
                <span className="brick-lab">{s.label}</span>
              </div>
              <div className="brick-sub">{s.sub}</div>
            </div>
          ))}
        </section>

        {/* Analytics Section */}
        <div className="analytics-dock">
          <div className="glass-card chart-well animate-fadeInUp">
            <div className="card-header">
              <h3 className="section-title small">Expansion Metrics</h3>
              <div className="chart-legend">
                <span className="dot" style={{ background: 'var(--accent)' }} /> POPULATION GROWTH
              </div>
            </div>
            <div className="chart-container">
               <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={MONTHLY}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-faint)', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-faint)', fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '11px' }} />
                    <Area type="monotone" dataKey="users" stroke="var(--accent)" strokeWidth={3} fill="url(#areaGrad)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
          </div>

          <aside className="pending-queue-aside">
            <div className="glass-card queue-brick animate-fadeInUp">
               <div className="brick-header">
                 <h3>Registry Appeals</h3>
                 <span className="count-badge">{pendingEvents.length}</span>
               </div>

               <div className="queue-list">
                 {pendingEvents.length === 0 ? (
                   <div style={{ color: 'var(--text-faint)', fontSize: '0.8rem', textAlign: 'center', padding: '1rem 0' }}>No pending appeals.</div>
                 ) : (
                   pendingEvents.slice(0, 3).map(e => (
                     <div key={e.id} className="queue-item">
                       <div className="q-info">
                         <strong>{e.title}</strong>
                         <span>by {e.organizerName}</span>
                       </div>
                       <Link href="/admin/events" className="q-act"><ArrowUpRight size={14} /></Link>
                     </div>
                   ))
                 )}
               </div>

               <Link href="/admin/events" className="btn btn-ghost btn-sm full-btn" style={{ marginTop: '1rem' }}>Review Protocol</Link>
            </div>
          </aside>
        </div>

        {/* Governance Table */}
        <section className="governance-table-area glass-card animate-fadeInUp">
          <div className="card-header">
            <h3 className="section-title small">Population Governance</h3>
            <button className="btn btn-ghost btn-sm">Audit Records</button>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
               <thead>
                 <tr>
                   <th>Identity</th>
                   <th>Role Profile</th>
                   <th>Access Status</th>
                   <th>Entry History</th>
                   <th>Actions</th>
                 </tr>
               </thead>
               <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-faint)' }}>No user records found.</td></tr>
                  ) : (
                    users.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div className="ident-cell">
                            <div className="ident-avatar">{u.name.charAt(0)}</div>
                            <div className="ident-meta">
                              <strong style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{u.name}</strong>
                              <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td><span className="role-tag">{u.role}</span></td>

                      <td>
                         <div className={`status-indicator ${u.status === 'active' ? 'online' : 'offline'}`}>
                           <span className="dot" /> {u.status.toUpperCase()}
                         </div>
                      </td>
                      <td>{u.registrations} Events</td>
                      <td><button className="btn btn-ghost btn-sm">Revoke</button></td>
                    </tr>
                  ))
                )}
              </tbody>

             </table>
          </div>
        </section>

        {/* Tactical Health & Sync Module */}
        <section className="admin-footer-modules grid2 animate-fadeInUp">
          <div className="glass-card health-brick">
            <h3 className="section-title small">Node Infrastructure</h3>
            <div className="node-grid">
              {[
                { name: 'AP-SOUTH-1', status: 'optimal', load: '0%' },
                { name: 'US-EAST-1', status: 'optimal', load: '0%' },
                { name: 'EU-CENTRAL-1', status: 'optimal', load: '0%' },
              ].map(node => (
                <div key={node.name} className="node-row">
                  <div className={`node-dot ${node.status}`} />
                  <span className="node-name">{node.name}</span>
                  <span className="node-load ml-auto">{node.load}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card sync-brick">
             <h3 className="section-title small">Platform Protocol</h3>
             <div className="protocol-controls">
               <div className="control-item">
                 <div className="ci-info">
                   <strong>Global Synchronization</strong>
                   <span>Real-time data relay to all gate nodes.</span>
                 </div>
                 <button className="btn btn-secondary btn-sm">DESYNC</button>
               </div>
               <div className="control-item">
                 <div className="ci-info">
                   <strong>Security Perimeter</strong>
                   <span>Standard operational compliance across all zones.</span>
                 </div>
                 <button className="btn btn-ghost btn-sm">LOCKDOWN</button>
               </div>
             </div>
          </div>
        </section>

      </div>

      <style jsx>{`
        .platform-control-tower { max-width: 1300px; margin: 0 auto; padding: 1rem 0; }
        
        .tower-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; }
        .tower-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.3rem 0.8rem; background: rgba(248, 113, 113, 0.1); 
          color: #f87171; border-radius: 4px; font-size: 0.65rem; font-weight: 800;
          letter-spacing: 0.05em; margin-bottom: 0.75rem;
        }

        .tower-actions { display: flex; gap: 1rem; }

        .stats-mosaic {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .mosaic-brick { padding: 1.5rem !important; display: flex; flex-direction: column; gap: 1rem; }
        .brick-top { display: flex; justify-content: space-between; align-items: center; }
        .brick-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .brick-trend { font-size: 0.7rem; font-weight: 800; color: #4ade80; display: flex; align-items: center; gap: 0.2rem; }
        
        .brick-val-group { display: flex; flex-direction: column; }
        .brick-val { font-size: 1.75rem; font-family: 'Space Grotesk', sans-serif; font-weight: 700; }
        .brick-lab { font-size: 0.75rem; font-weight: 700; color: var(--text-faint); text-transform: uppercase; }
        .brick-sub { font-size: 0.65rem; color: var(--text-faint); margin-top: auto; }

        .analytics-dock { display: grid; grid-template-columns: 1fr 340px; gap: 2rem; margin-bottom: 2rem; }
        .chart-well { padding: 2rem !important; }
        .chart-container { margin-top: 2rem; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .chart-legend { display: flex; align-items: center; gap: 0.5rem; font-size: 0.65rem; font-weight: 800; color: var(--text-faint); }
        .chart-legend .dot { width: 6px; height: 6px; border-radius: 50%; }

        .queue-brick { padding: 1.5rem !important; }
        .brick-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .count-badge { background: var(--border); padding: 0.1rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 800; }
        
        .queue-list { display: flex; flex-direction: column; gap: 1rem; }
        .queue-item { 
          display: flex; justify-content: space-between; align-items: center;
          padding: 0.75rem; background: var(--bg-card2); border-radius: var(--radius-md);
          border: 1px solid var(--border);
        }
        .q-info { display: flex; flex-direction: column; gap: 0.125rem; }
        .q-info strong { font-size: 0.8125rem; }
        .q-info span { font-size: 0.7rem; color: var(--text-faint); }
        .q-act { color: var(--text-faint); transition: var(--transition); }
        .q-act:hover { color: var(--text); transform: translate(2px, -2px); }

        .governance-table-area { padding: 2rem !important; margin-bottom: 2rem; }
        
        .admin-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        .admin-table th { text-align: left; padding: 1rem; border-bottom: 1px solid var(--border); font-size: 0.7rem; font-weight: 800; color: var(--text-faint); text-transform: uppercase; }
        .admin-table td { padding: 1.25rem 1rem; border-bottom: 1px solid var(--border); }
        
        .ident-cell { display: flex; align-items: center; gap: 1rem; }
        .ident-avatar { width: 32px; height: 32px; border-radius: 8px; background: var(--bg-card2); display: flex; align-items: center; justify-content: center; font-size: 0.8125rem; font-weight: 800; color: var(--secondary); border: 1px solid var(--border); }
        .ident-meta { display: flex; flex-direction: column; }
        .ident-meta strong { font-size: 0.875rem; }
        .ident-meta span { font-size: 0.75rem; color: var(--text-faint); }

        .role-tag { padding: 0.2rem 0.6rem; background: var(--bg-card2); border: 1px solid var(--border); border-radius: 4px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
        
        .status-indicator { display: flex; align-items: center; gap: 0.5rem; font-size: 0.7rem; font-weight: 800; }
        .status-indicator.online .dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 10px #4ade80; }
        .status-indicator.offline .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--text-faint); }

        .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .health-brick, .sync-brick { padding: 2rem !important; }
        .node-grid { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem; }
        .node-row { display: flex; align-items: center; gap: 0.75rem; font-size: 0.8125rem; font-weight: 700; }
        .node-dot { width: 8px; height: 8px; border-radius: 50%; }
        .node-dot.optimal { background: #4ade80; box-shadow: 0 0 10px #4ade80; }
        .node-dot.warning { background: #fbbf24; box-shadow: 0 0 10px #fbbf24; }
        .ml-auto { margin-left: auto; color: var(--text-faint); font-family: monospace; }

        .protocol-controls { display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1.5rem; }
        .control-item { display: flex; justify-content: space-between; align-items: center; }
        .ci-info { display: flex; flex-direction: column; gap: 0.25rem; }
        .ci-info strong { font-size: 0.875rem; color: var(--text); }
        .ci-info span { font-size: 0.75rem; color: var(--text-faint); }

        @media (max-width: 1024px) {
          .stats-mosaic { grid-template-columns: repeat(2, 1fr); }
          .analytics-dock { grid-template-columns: 1fr; }
          .grid2 { grid-template-columns: 1fr; }
        }
      `}</style>
    </DashboardLayout>
  );
}
