'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PENDING_EVENTS, EVENTS } from '@/data/mockData';
import { Check, X, Eye, Calendar, MapPin, Users, Clock, AlertTriangle } from 'lucide-react';

export default function EventApprovalsPage() {
  const [pending, setPending] = useState(PENDING_EVENTS);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [detail, setDetail] = useState(null);
  const [actionNote, setActionNote] = useState('');

  const approve = (id) => {
    const ev = pending.find(e => e.id === id);
    setPending(prev => prev.filter(e => e.id !== id));
    setApproved(prev => [...prev, { ...ev, status: 'approved', approvedOn: new Date().toISOString().slice(0, 10) }]);
    setDetail(null);
  };

  const reject = (id) => {
    const ev = pending.find(e => e.id === id);
    setPending(prev => prev.filter(e => e.id !== id));
    setRejected(prev => [...prev, { ...ev, status: 'rejected' }]);
    setDetail(null);
  };

  return (
    <DashboardLayout>
      <div className="animate-fadeInUp">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, marginBottom: 4 }}>Event Approvals</h1>
            <p style={{ color: 'var(--text-muted)' }}>Review and approve organizer event submissions</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <span className="badge badge-warning" style={{ padding: '8px 14px', fontSize: 13 }}>{pending.length} Pending</span>
            <span className="badge badge-success" style={{ padding: '8px 14px', fontSize: 13 }}>{approved.length} Approved</span>
            <span className="badge badge-danger" style={{ padding: '8px 14px', fontSize: 13 }}>{rejected.length} Rejected</span>
          </div>
        </div>

        {/* Pending */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={18} style={{ color: 'var(--warning)' }} /> Pending Review ({pending.length})
          </h2>
          {pending.length === 0 ? (
            <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
              <Check size={32} style={{ color: 'var(--success)', margin: '0 auto 12px' }} />
              <h3>All caught up!</h3>
              <p style={{ color: 'var(--text-muted)' }}>No pending event approvals.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pending.map(e => (
                <div key={e.id} className="glass-card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', borderLeft: '3px solid var(--warning)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700 }}>{e.title}</h3>
                      <span className="badge badge-ghost">{e.type}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                        <Users size={12} /> {e.organizer}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                        <MapPin size={12} /> {e.venue}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                        <Calendar size={12} /> {e.date}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                        <Users size={12} /> {e.capacity.toLocaleString()} capacity
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-faint)' }}>
                        <Clock size={12} /> Submitted {e.submittedOn}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setDetail(e)}>
                      <Eye size={13} /> Review
                    </button>
                    <button className="btn btn-sm" style={{ background: 'var(--success-glow)', color: 'var(--success)', border: '1px solid rgba(46,213,115,0.3)' }} onClick={() => approve(e.id)}>
                      <Check size={13} /> Approve
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => reject(e.id)}>
                      <X size={13} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Approved */}
        {approved.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Check size={18} style={{ color: 'var(--success)' }} /> Approved ({approved.length})
            </h2>
            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <table className="data-table">
                <thead><tr><th>Event</th><th>Organizer</th><th>Date</th><th>Approved On</th></tr></thead>
                <tbody>
                  {approved.map(e => (
                    <tr key={e.id}>
                      <td style={{ fontWeight: 600 }}>{e.title}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{e.organizer}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{e.date}</td>
                      <td><span className="badge badge-success">{e.approvedOn}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Rejected */}
        {rejected.length > 0 && (
          <div>
            <h2 style={{ fontSize: 18, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <X size={18} style={{ color: 'var(--danger)' }} /> Rejected ({rejected.length})
            </h2>
            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <table className="data-table">
                <thead><tr><th>Event</th><th>Organizer</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {rejected.map(e => (
                    <tr key={e.id}>
                      <td style={{ fontWeight: 600 }}>{e.title}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{e.organizer}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{e.date}</td>
                      <td><span className="badge badge-danger">Rejected</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="modal-overlay" onClick={() => setDetail(null)}>
          <div className="modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setDetail(null)}>✕</button>
            <h2 style={{ marginBottom: 20 }}>Event Review</h2>
            <div className="glass-card" style={{ padding: 16, marginBottom: 20 }}>
              <h3 style={{ marginBottom: 10 }}>{detail.title}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}><Users size={14} /> {detail.organizer} · {detail.orgEmail}</p>
                <p style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}><MapPin size={14} /> {detail.venue}</p>
                <p style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}><Calendar size={14} /> {detail.date} · {detail.type}</p>
                <p style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}><Users size={14} /> Capacity: {detail.capacity.toLocaleString()}</p>
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Review note (optional)</label>
              <textarea className="input" rows={3} placeholder="Add a note to the organizer..." value={actionNote} onChange={e => setActionNote(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-danger" style={{ flex: 1, justifyContent: 'center' }} onClick={() => reject(detail.id)}>
                <X size={15} /> Reject
              </button>
              <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => approve(detail.id)}>
                <Check size={15} /> Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
