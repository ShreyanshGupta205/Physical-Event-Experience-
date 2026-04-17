'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { USERS } from '@/data/mockData';
import { Search, UserX, UserCheck, Edit2, MoreHorizontal } from 'lucide-react';

const ROLE_COLORS = { student: '#6C63FF', organizer: '#00D4AA', admin: '#FF4757', staff: '#FFA502' };

export default function UserManagementPage() {
  const [users, setUsers] = useState(USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  };

  return (
    <DashboardLayout>
      <div className="animate-fadeInUp">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, marginBottom: 4 }}>User Management</h1>
            <p style={{ color: 'var(--text-muted)' }}>{users.length} total users on the platform</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {['all', 'student', 'organizer', 'staff', 'admin'].map(r => (
              <button key={r} className={`btn btn-sm ${roleFilter === r ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setRoleFilter(r)}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
            <input className="input" style={{ paddingLeft: 36 }} placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input" style={{ width: 140 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Stats row */}
        <div className="grid-4" style={{ marginBottom: 24 }}>
          {[
            { label: 'Students', count: users.filter(u => u.role === 'student').length, color: '#6C63FF' },
            { label: 'Organizers', count: users.filter(u => u.role === 'organizer').length, color: '#00D4AA' },
            { label: 'Staff', count: users.filter(u => u.role === 'staff').length, color: '#FFA502' },
            { label: 'Active', count: users.filter(u => u.status === 'active').length, color: 'var(--success)' },
          ].map(s => (
            <div key={s.label} className="glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</span>
              <span style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Space Grotesk', color: s.color }}>{s.count}</span>
            </div>
          ))}
        </div>

        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Registrations</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar avatar-sm" style={{ background: `linear-gradient(135deg, ${ROLE_COLORS[u.role] || 'var(--primary)'}, #1a1a2e)` }}>
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 600 }}>{u.name}</p>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{ background: `${ROLE_COLORS[u.role] || 'var(--primary)'}20`, color: ROLE_COLORS[u.role] || 'var(--primary)', border: `1px solid ${ROLE_COLORS[u.role] || 'var(--primary)'}30`, textTransform: 'capitalize' }}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-ghost'}`} style={{ textTransform: 'capitalize' }}>
                      {u.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{u.joined}</td>
                  <td style={{ fontSize: 13 }}>{u.registrations}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => toggleStatus(u.id)}
                        className={`btn btn-sm ${u.status === 'active' ? 'btn-danger' : 'btn-secondary'}`}
                        style={{ fontSize: 12 }}
                      >
                        {u.status === 'active' ? <><UserX size={12} /> Suspend</> : <><UserCheck size={12} /> Activate</>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No users found</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
