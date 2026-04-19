'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { History, Shield, Database, User, Activity, Clock, Search, Loader2 } from 'lucide-react';

const ACTION_ICONS = {
  'UPDATE_USER': <User size={14} />,
  'CREATE_GUARDIAN': <Shield size={14} />,
  'APPROVE_EVENT': <Activity size={14} title="Event approved" />,
  'REJECT_EVENT': <Activity size={14} title="Event rejected" />,
  'CREATE_BROADCAST': <Database size={14} />
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/logs')
      .then(r => r.json())
      .then(data => {
        setLogs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="telemetry-loading"><Loader2 className="animate-spin" /></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fadeInUp">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
           <div className="title-icon"><History size={24} /></div>
           <div>
             <h1 style={{ fontSize: 26, marginBottom: 4 }}>System Audit Logs</h1>
             <p style={{ color: 'var(--text-muted)' }}>Historical registry of all administrative operations and protocol state changes.</p>
           </div>
        </div>

        <div className="glass-card" style={{ overflow: 'hidden' }}>
           <table className="data-table">
              <thead>
                 <tr>
                    <th>Timestamp</th>
                    <th>Protocol Operation</th>
                    <th>Target Resource</th>
                    <th>Operational Details</th>
                    <th>Executor</th>
                 </tr>
              </thead>
              <tbody>
                 {logs.length === 0 ? (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40, color: 'var(--text-faint)' }}>Log registry is currently empty.</td></tr>
                 ) : logs.map(log => (
                    <tr key={log.id}>
                       <td style={{ width: 180 }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)', whiteSpace: 'nowrap' }}>
                            <Clock size={10} style={{ marginRight: 4 }} /> {new Date(log.timestamp).toLocaleString()}
                          </span>
                       </td>
                       <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                             <div className="action-icon">
                                {ACTION_ICONS[log.action] || <Activity size={14} />}
                             </div>
                             <span style={{ fontSize: '0.7rem', fontWeight: 800 }}>{log.action}</span>
                          </div>
                       </td>
                       <td>
                          <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', background: 'var(--bg-card2)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                            {log.targetType?.toUpperCase() || 'SYS'}: {log.targetId?.slice(0, 8)}...
                          </span>
                       </td>
                       <td>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: 400 }}>{log.details}</p>
                       </td>
                       <td>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)' }}>{log.performerId.toUpperCase()}</span>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>

      <style jsx>{`
        .title-icon { width: 48px; height: 48px; border-radius: 12px; background: rgba(0, 212, 170, 0.1); color: var(--secondary); display: flex; align-items: center; justify-content: center; }
        .action-icon { width: 24px; height: 24px; border-radius: 6px; background: var(--bg-card2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--text-faint); }
      `}</style>
    </DashboardLayout>
  );
}
