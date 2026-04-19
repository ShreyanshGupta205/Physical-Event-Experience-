'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Check, X, Eye, Calendar, MapPin, Users, Clock, AlertTriangle, Loader2, Sparkles, ShieldAlert } from 'lucide-react';

export default function EventApprovalsPage() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [actionNote, setActionNote] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const res = await fetch('/api/admin/events/approvals');
      if (res.ok) {
        const data = await res.json();
        setPending(data);
      }
    } catch (e) {
      console.error("Failed to load queue", e);
    } finally {
      setLoading(false);
    }
  };

  const processEvent = async (id, status) => {
    setProcessing(true);
    try {
      const res = await fetch('/api/admin/events/approvals', {
        method: 'PATCH',
        body: JSON.stringify({ id, status, reason: actionNote })
      });
      if (res.ok) {
        setDetail(null);
        setActionNote('');
        fetchQueue();
      }
    } catch (e) {
      alert("Failed to process event");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="telemetry-loading">
          <Loader2 className="animate-spin" />
          <p>SCANNING APPROVAL QUEUE...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fadeInUp">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="badge badge-warning" style={{ marginBottom: 8, fontSize: '0.65rem' }}>GOVERNANCE / CONTENT</div>
            <h1 style={{ fontSize: 26, marginBottom: 4 }}>Event Approvals</h1>
            <p style={{ color: 'var(--text-muted)' }}>Review and validate ecosystem experience submissions</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <span className="count-card">
               <span className="count-val">{pending.length}</span>
               <span className="count-label">AWAITING REVIEW</span>
            </span>
          </div>
        </div>

        {/* List */}
        <div style={{ marginBottom: 32 }}>
          {pending.length === 0 ? (
            <div className="glass-card empty-state">
              <div className="icon-pulse"><Check size={32} /></div>
              <h3>Ecosystem Synchronized</h3>
              <p>No experiences are currently pending administrative validation.</p>
            </div>
          ) : (
            <div className="event-stack">
              {pending.map(e => (
                <div key={e.id} className="glass-card event-approval-card animate-fadeInUp">
                  <div className="card-accent" style={{ background: e.color || 'var(--primary)' }} />
                  <div className="card-body">
                    <div className="event-meta-top">
                      <div className="title-group">
                         <h3>{e.title}</h3>
                         <span className="type-tag">{e.type.toUpperCase()}</span>
                      </div>
                      <span className="date-tag"><Clock size={12} /> {new Date(e.submittedAt).toLocaleDateString()}</span>
                    </div>

                    <div className="event-details-grid">
                      <div className="detail-item"><Users size={14} /> {e.organizerName}</div>
                      <div className="detail-item"><MapPin size={14} /> {e.venue}</div>
                      <div className="detail-item"><Calendar size={14} /> {e.date}</div>
                      <div className="detail-item"><ShieldAlert size={14} /> {e.capacity} MAX</div>
                    </div>

                    <div className="card-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => setDetail(e)}>
                        <Eye size={14} /> View Manifest
                      </button>
                      <div style={{ display: 'flex', gap: 8 }}>
                         <button className="btn btn-sm btn-reject" onClick={() => processEvent(e.id, 'rejected')}>
                           <X size={14} /> REJECT
                         </button>
                         <button className="btn btn-sm btn-approve" onClick={() => processEvent(e.id, 'approved')}>
                           <Check size={14} /> APPROVE
                         </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {detail && (
        <div className="modal-overlay" onClick={() => setDetail(null)}>
          <div className="modal animate-scaleIn" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
               <div className="header-info">
                 <h2 style={{ fontSize: '1.25rem' }}>Experience manifest</h2>
                 <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Validate submission integrity for {detail.title}</p>
               </div>
               <button className="close-btn" onClick={() => setDetail(null)}>✕</button>
            </div>

            <div className="manifest-well">
               <div className="manifest-section">
                  <label>DESCRIPTION</label>
                  <p>{detail.description || 'No detailed description provided.'}</p>
               </div>
               <div className="manifest-grid">
                  <div className="manifest-cell">
                     <label>ORGANIZER</label>
                     <strong>{detail.organizerName}</strong>
                  </div>
                  <div className="manifest-cell">
                     <label>CATEGORY</label>
                     <strong>{detail.category}</strong>
                  </div>
               </div>
            </div>

            <div className="review-action-area">
              <label className="label">ADMINISTRATIVE NOTES</label>
              <textarea 
                className="input" 
                rows={3} 
                placeholder="Optional feedback for the organizer..." 
                value={actionNote} 
                onChange={e => setActionNote(e.target.value)} 
              />
              
              <div className="action-buttons">
                 <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setDetail(null)}>Close</button>
                 <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => processEvent(detail.id, 'rejected')} disabled={processing}>
                   <X size={14} /> REJECT
                 </button>
                 <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => processEvent(detail.id, 'approved')} disabled={processing}>
                   <Check size={14} /> {processing ? 'VALIDATING...' : 'APPROVE'}
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .telemetry-loading { height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; color: var(--text-faint); font-weight: 800; }
        
        .count-card { display: flex; flex-direction: column; align-items: flex-end; }
        .count-val { font-size: 1.5rem; font-weight: 800; color: var(--warning); font-family: 'Space Grotesk', sans-serif; }
        .count-label { font-size: 0.6rem; font-weight: 900; color: var(--text-faint); letter-spacing: 0.1em; }

        .empty-state { padding: 60px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; text-align: center; }
        .icon-pulse { width: 64px; height: 64px; border-radius: 50%; background: var(--success-glow); color: var(--success); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; animation: soft-pulse 2s infinite; }
        @keyframes soft-pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.7; } 100% { transform: scale(1); opacity: 1; } }

        .event-stack { display: flex; flexDirection: column; gap: 16px; }
        .event-approval-card { position: relative; display: flex; overflow: hidden; }
        .card-accent { width: 4px; flex-shrink: 0; }
        .card-body { padding: 20px; flex: 1; }
        
        .event-meta-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .title-group { display: flex; align-items: center; gap: 12px; }
        .title-group h3 { font-size: 1rem; font-weight: 700; }
        .type-tag { font-size: 0.65rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; background: var(--bg-card2); border: 1px solid var(--border); color: var(--text-muted); }
        .date-tag { font-size: 0.7rem; color: var(--text-faint); font-weight: 700; }

        .event-details-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
        .detail-item { font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px; font-weight: 600; }

        .card-actions { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid var(--border); }
        .btn-approve { background: var(--success-glow); color: var(--success); border: 1px solid rgba(46, 213, 115, 0.2); font-weight: 800; font-size: 0.7rem; }
        .btn-approve:hover { background: var(--success); color: black; }
        .btn-reject { background: var(--danger-glow); color: var(--danger); border: 1px solid rgba(255, 71, 87, 0.2); font-weight: 800; font-size: 0.7rem; }
        .btn-reject:hover { background: var(--danger); color: white; }

        /* Modal Styles */
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .close-btn { background: none; border: none; color: var(--text-faint); cursor: pointer; font-size: 1.25rem; }
        .manifest-well { background: var(--bg-card2); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 24px; }
        .manifest-section { margin-bottom: 20px; }
        .manifest-section label { font-size: 0.6rem; font-weight: 900; color: var(--text-faint); display: block; margin-bottom: 8px; }
        .manifest-section p { font-size: 0.85rem; line-height: 1.6; color: var(--text-muted); }
        .manifest-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .manifest-cell label { font-size: 0.6rem; font-weight: 900; color: var(--text-faint); display: block; margin-bottom: 4px; }
        .manifest-cell strong { font-size: 0.9rem; color: var(--text); }
        
        .review-action-area { display: flex; flexDirection: column; gap: 16px; }
        .review-action-area .label { font-size: 0.65rem; font-weight: 800; color: var(--text-faint); }
        .review-action-area .input { border-radius: 10px; padding: 12px; }
        .action-buttons { display: flex; gap: 12px; }
      `}</style>
    </DashboardLayout>
  );
}

