'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Megaphone, Send, Clock, Trash2, Info, AlertTriangle, ShieldAlert, Loader2, Sparkles } from 'lucide-react';

export default function BroadcastCenter() {
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', type: 'info' });

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const fetchBroadcasts = async () => {
    try {
      const res = await fetch('/api/admin/broadcast');
      if (res.ok) setBroadcasts(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setForm({ title: '', message: '', type: 'info' });
        fetchBroadcasts();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fadeInUp">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
           <div className="title-icon"><Megaphone size={24} /></div>
           <div>
             <h1 style={{ fontSize: 26, marginBottom: 4 }}>Broadcast Center</h1>
             <p style={{ color: 'var(--text-muted)' }}>Push real-time administrative announcements to the entire ecosystem.</p>
           </div>
        </div>

        <div className="broadcast-grid">
           {/* Composer */}
           <div className="glass-card compose-brick">
              <h3 className="section-title small">New Announcement</h3>
              <form onSubmit={handleSend} className="compose-form">
                 <div className="form-group">
                    <label>ANNOUNCEMENT TITLE</label>
                    <input 
                      className="input" 
                      placeholder="e.g. Protocol Upgrade Incoming" 
                      value={form.title}
                      onChange={e => setForm({...form, title: e.target.value})}
                      required
                    />
                 </div>
                 
                 <div className="form-group">
                    <label>PRIORITY LEVEL</label>
                    <div className="type-selector">
                       {['info', 'warning', 'critical'].map(t => (
                         <button 
                          key={t}
                          type="button" 
                          className={`type-btn ${t} ${form.type === t ? 'active' : ''}`}
                          onClick={() => setForm({...form, type: t})}
                         >
                           {t.toUpperCase()}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="form-group">
                    <label>MESSAGE CONTENT</label>
                    <textarea 
                      className="input" 
                      rows={4} 
                      placeholder="Enter the official communication details..." 
                      value={form.message}
                      onChange={e => setForm({...form, message: e.target.value})}
                      required
                    />
                 </div>

                 <button type="submit" className="btn btn-primary full-btn" disabled={submitting}>
                    {submitting ? <Loader2 className="animate-spin" /> : <><Send size={16} /> BROADCAST TO ECOSYSTEM</>}
                 </button>
              </form>
           </div>

           {/* History */}
           <div className="glass-card history-brick">
              <h3 className="section-title small">Recent Transmissions</h3>
              <div className="history-list">
                 {loading ? (
                    <div className="telemetry-loading"><Loader2 className="animate-spin" /></div>
                 ) : broadcasts.length === 0 ? (
                    <div className="empty-history">No active broadcasts in registry.</div>
                 ) : broadcasts.map(b => (
                    <div key={b.id} className={`history-item ${b.type}`}>
                       <div className="h-top">
                          <span className="h-type">{b.type.toUpperCase()}</span>
                          <span className="h-time"><Clock size={10} /> {new Date(b.createdAt).toLocaleTimeString()}</span>
                       </div>
                       <h4>{b.title}</h4>
                       <p>{b.message}</p>
                       <div className="h-footer">
                          <span className="h-author">BY SYSTEM-ADMIN</span>
                          <button className="h-delete"><Trash2 size={12} /></button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      <style jsx>{`
        .title-icon { width: 48px; height: 48px; border-radius: 12px; background: var(--accent-glow); color: var(--accent); display: flex; align-items: center; justify-content: center; }
        
        .broadcast-grid { display: grid; grid-template-columns: 1fr 400px; gap: 24px; }
        .compose-brick { padding: 24px !important; }
        .compose-form { display: flex; flexDirection: column; gap: 20px; margin-top: 20px; }
        
        .form-group label { font-size: 0.6rem; font-weight: 900; color: var(--text-faint); margin-bottom: 8px; display: block; letter-spacing: 0.05em; }
        .type-selector { display: flex; gap: 8px; }
        .type-btn { flex: 1; padding: 10px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg-card2); color: var(--text-faint); font-size: 0.65rem; font-weight: 800; cursor: pointer; transition: 0.2s; }
        .type-btn.active.info { background: var(--secondary-glow); color: var(--secondary); border-color: var(--secondary); }
        .type-btn.active.warning { background: var(--warning-glow); color: var(--warning); border-color: var(--warning); }
        .type-btn.active.critical { background: var(--danger-glow); color: var(--danger); border-color: var(--danger); }
        
        .history-brick { padding: 24px !important; display: flex; flexDirection: column; }
        .history-list { margin-top: 20px; display: flex; flexDirection: column; gap: 12px; overflow-y: auto; max-height: 60vh; }
        
        .history-item { padding: 16px; border-radius: 12px; border: 1px solid var(--border); background: var(--bg-card2); }
        .history-item.critical { border-left: 4px solid var(--danger); }
        .history-item.warning { border-left: 4px solid var(--warning); }
        .history-item.info { border-left: 4px solid var(--secondary); }
        
        .h-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .h-type { font-size: 0.55rem; font-weight: 900; letter-spacing: 0.05em; }
        .h-time { font-size: 0.6rem; color: var(--text-faint); display: flex; align-items: center; gap: 4px; }
        .history-item h4 { font-size: 0.85rem; margin-bottom: 4px; color: var(--text); }
        .history-item p { font-size: 0.75rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 12px; }
        
        .h-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.05); }
        .h-author { font-size: 0.55rem; font-weight: 800; color: var(--text-faint); }
        .h-delete { background: none; border: none; color: var(--text-faint); cursor: pointer; }
        
        .empty-history { padding: 40px; text-align: center; font-size: 0.75rem; color: var(--text-faint); border: 1px dashed var(--border); border-radius: 12px; }
        
        @media (max-width: 1024px) {
          .broadcast-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </DashboardLayout>
  );
}
