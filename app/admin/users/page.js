'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Search, UserX, UserCheck, Edit2, Plus, ShieldCheck, Mail, UserPlus, Loader2 } from 'lucide-react';

const ROLE_COLORS = { student: '#6C63FF', organizer: '#00D4AA', admin: '#FF4757', staff: '#FFA502' };

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Guardian Creator State
  const [showModal, setShowModal] = useState(false);
  const [newGuardian, setNewGuardian] = useState({ name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error("Failed to load users", e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) fetchUsers();
    } catch (e) {
      alert("Failed to update status");
    }
  };

  const createGuardian = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/users/create-guardian', {
        method: 'POST',
        body: JSON.stringify(newGuardian)
      });
      if (res.ok) {
        setShowModal(false);
        setNewGuardian({ name: '', email: '' });
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create staff account");
      }
    } catch (e) {
      alert("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
       <DashboardLayout>
          <div className="telemetry-loading">
            <Loader2 className="animate-spin" />
            <p>SYNCING GLOBAL DIRECTORY...</p>
          </div>
       </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fadeInUp">
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="badge badge-accent" style={{ marginBottom: 8, fontSize: '0.65rem' }}>GOVERNANCE / USERS</div>
            <h1 style={{ fontSize: 26, marginBottom: 4 }}>User Management</h1>
            <p style={{ color: 'var(--text-muted)' }}>{users.length} authenticated identities on platform</p>
          </div>
          
          <div style={{ display: 'flex', gap: 12 }}>
             <button className="btn btn-primary" onClick={() => setShowModal(true)}>
               <UserPlus size={16} /> Create Guardian
             </button>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 300, position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
              <input className="input" style={{ paddingLeft: 36, width: '100%' }} placeholder="Search by name, email, or credentials..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            
            <div style={{ display: 'flex', gap: 8 }}>
              {['all', 'student', 'organizer', 'staff', 'admin'].map(r => (
                <button key={r} className={`btn btn-sm ${roleFilter === r ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setRoleFilter(r)}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Identity</th>
                <th>Role Profile</th>
                <th>Platform Status</th>
                <th>Registration Integrity</th>
                <th>Audit Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="avatar avatar-sm" style={{ background: `linear-gradient(135deg, ${ROLE_COLORS[u.role] || 'var(--primary)'}, #000)`, fontWeight: 800 }}>
                        {u.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255, 255, 255, 0.95)' }}>{u.name}</p>
                        <p style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.6)' }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{ background: `${ROLE_COLORS[u.role] || 'var(--primary)'}15`, color: ROLE_COLORS[u.role] || 'var(--primary)', border: `1px solid ${ROLE_COLORS[u.role] || 'var(--primary)'}30`, fontWeight: 800, fontSize: '0.65rem' }}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className={`status-pill ${u.status}`}>
                      <span className="dot" />
                      {u.status.toUpperCase()}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                       <span style={{ fontSize: 13, fontWeight: 700 }}>{u.registrations || 0}</span>
                       <span style={{ fontSize: 10, color: 'var(--text-faint)' }}>EVENTS</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => toggleStatus(u.id, u.status)}
                        className={`btn-icon ${u.status === 'active' ? 'danger' : 'success'}`}
                        title={u.status === 'active' ? 'Suspend Access' : 'Restore Access'}
                      >
                        {u.status === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
                      <button className="btn-icon ghost"><Edit2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filtered.length === 0 && (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <Search size={32} style={{ color: 'var(--text-faint)', marginBottom: 16 }} />
              <p style={{ color: 'var(--text-muted)' }}>No identities matched your query.</p>
            </div>
          )}
        </div>
      </div>

      {/* Guardian Creator Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal animate-scaleIn" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div className="icon-box warning"><ShieldCheck size={20} /></div>
              <div>
                <h2 style={{ fontSize: 18 }}>Create Guardian</h2>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Staff accounts are administrative only.</p>
              </div>
            </div>

            <form onSubmit={createGuardian} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="label">FULL NAME</label>
                <div className="input-wrap">
                   <Edit2 size={14} />
                   <input 
                    className="input" 
                    placeholder="e.g. John Doe" 
                    value={newGuardian.name}
                    onChange={e => setNewGuardian({...newGuardian, name: e.target.value})}
                    required
                   />
                </div>
              </div>

              <div>
                <label className="label">SECURITY EMAIL</label>
                <div className="input-wrap">
                   <Mail size={14} />
                   <input 
                    className="input" 
                    type="email"
                    placeholder="staff@eventra.ai" 
                    value={newGuardian.email}
                    onChange={e => setNewGuardian({...newGuardian, email: e.target.value})}
                    required
                   />
                </div>
              </div>

              <div className="alert warning" style={{ fontSize: 11, padding: '10px' }}>
                <ShieldCheck size={12} /> Password will be set to platform default for onboarding.
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
                  {submitting ? <Loader2 className="animate-spin" size={16} /> : 'DEPLOY STAFF'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .telemetry-loading { height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; color: var(--text-faint); font-weight: 800; font-size: 0.75rem; }
        
        .status-pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 6px; font-size: 0.65rem; font-weight: 900; background: var(--bg-card2); border: 1px solid var(--border); }
        .status-pill.active { color: #4ade80; border-color: rgba(74, 222, 128, 0.2); }
        .status-pill.suspended { color: #f87171; border-color: rgba(248, 113, 113, 0.2); }
        .status-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
        
        .btn-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: var(--bg-card2); border: 1px solid var(--border); color: var(--text-faint); cursor: pointer; transition: 0.2s; }
        .btn-icon:hover { transform: translateY(-2px); color: var(--text); border-color: var(--text-muted); }
        .btn-icon.danger:hover { background: #f8717115; border-color: #f8717140; color: #f87171; }
        .btn-icon.success:hover { background: #4ade8015; border-color: #4ade8040; color: #4ade80; }

        .label { font-size: 0.65rem; font-weight: 800; color: var(--text-faint); margin-bottom: 6px; display: block; letter-spacing: 0.05em; }
        .input-wrap { position: relative; }
        .input-wrap :global(svg) { position: absolute; left: 12px; top: 12px; color: var(--text-faint); }
        .input-wrap .input { padding-left: 36px; width: 100%; border-radius: 10px; }
      `}</style>
    </DashboardLayout>
  );
}

