'use client';
import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { Calendar, MapPin, QrCode, ChevronRight, Search, Filter, Zap } from 'lucide-react';

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmed', badgeClass: 'badge-success' },
  pending: { label: 'Pending', badgeClass: 'badge-warning' },
  cancelled: { label: 'Cancelled', badgeClass: 'badge-danger' },
};

export default function MyEventsPage() {
  const { registrations } = useApp();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = registrations.filter(r => {
    const matchStatus = filter === 'all' || r.status === filter;
    const matchSearch = r.eventTitle.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <DashboardLayout>
      <div className="animate-fadeInUp">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, marginBottom: 4 }}>My Registrations</h1>
            <p style={{ color: 'var(--text-muted)' }}>{registrations.length} events registered</p>
          </div>
          <Link href="/" className="btn btn-primary">
            <Zap size={15} /> Discover More
          </Link>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
            <input className="input" style={{ paddingLeft: 36 }} placeholder="Search registrations..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {['all', 'confirmed', 'pending', 'cancelled'].map(f => (
            <button
              key={f}
              className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'} btn-sm`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="glass-card" style={{ padding: 60, textAlign: 'center' }}>
            <Calendar size={40} style={{ color: 'var(--text-faint)', margin: '0 auto 12px' }} />
            <h3>No registrations found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => {
                  const sc = STATUS_CONFIG[r.status] || STATUS_CONFIG.confirmed;
                  return (
                    <tr key={r.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 4, height: 36, borderRadius: 2, background: r.color, flexShrink: 0 }} />
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{r.eventTitle}</span>
                        </div>
                      </td>
                      <td><span className="badge" style={{ background: `${r.color}20`, color: r.color, border: `1px solid ${r.color}40` }}>{r.type}</span></td>
                      <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 180 }}>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{r.venue}</span>
                      </td>
                      <td><span className={`badge ${sc.badgeClass}`}>{sc.label}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {r.status === 'confirmed' && (
                            <Link href="/student/pass" className="btn btn-primary btn-sm">
                              <QrCode size={12} /> Pass
                            </Link>
                          )}
                          <Link href={`/event/${r.eventId}`} className="btn btn-ghost btn-sm">
                            Details <ChevronRight size={12} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
