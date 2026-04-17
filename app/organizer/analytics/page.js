'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { CROWD_TIMELINE, EVENTS } from '@/data/mockData';
import { BarChart, Bar, AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';

const EVENT = EVENTS[0];

const MONTHLY_REG = [
  { month: 'Jan', registrations: 120, checkIns: 98 },
  { month: 'Feb', registrations: 230, checkIns: 185 },
  { month: 'Mar', registrations: 310, checkIns: 278 },
  { month: 'Apr', registrations: 423, checkIns: 0 },
];

const CATEGORY_DATA = [
  { name: 'Students', value: 65, color: '#6C63FF' },
  { name: 'Professionals', value: 20, color: '#00D4AA' },
  { name: 'Faculty', value: 10, color: '#FFA502' },
  { name: 'Others', value: 5, color: '#FF4757' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
      <p style={{ fontWeight: 700, marginBottom: 6 }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return (
      <DashboardLayout>
        <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-faint)' }}>
          LOADING INTEL...
        </div>
      </DashboardLayout>
    );
  }

  const totalReg = MONTHLY_REG.reduce((s, d) => s + d.registrations, 0);
  const convRate = Math.round((MONTHLY_REG.reduce((s, d) => s + d.checkIns, 0) / totalReg) * 100);

  return (
    <DashboardLayout>
      <div className="animate-fadeInUp">
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, marginBottom: 4 }}>Analytics & Reports</h1>
          <p style={{ color: 'var(--text-muted)' }}>Event performance insights — {EVENT.title}</p>
        </div>

        {/* KPIs */}
        <div className="grid-4 stagger" style={{ marginBottom: 32 }}>
          {[
            { label: 'Total Registrations', value: EVENT.registered.toLocaleString(), sub: `of ${EVENT.capacity.toLocaleString()} capacity`, icon: Users, color: 'var(--primary)', bg: 'var(--primary-glow)' },
            { label: 'Check-in Rate', value: `${convRate}%`, sub: 'Historical avg', icon: CheckCircle, color: 'var(--success)', bg: 'var(--success-glow)' },
            { label: 'Growth Rate', value: '+36%', sub: 'vs last event', icon: TrendingUp, color: 'var(--secondary)', bg: 'var(--secondary-glow)' },
            { label: 'Avg Wait Time', value: '8 min', sub: 'At peak hour', icon: Clock, color: 'var(--warning)', bg: 'var(--warning-glow)' },
          ].map(s => (
            <div key={s.label} className="glass-card animate-fadeInUp" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</span>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon size={16} style={{ color: s.color }} />
                </div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Space Grotesk', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 4 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Registration vs Check-in bar */}
        <div className="grid-2" style={{ gap: 24, marginBottom: 24 }}>
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Registrations vs Check-ins</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={MONTHLY_REG} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-faint)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-faint)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-muted)' }} />
                <Bar dataKey="registrations" name="Registrations" fill="#6C63FF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="checkIns" name="Check-ins" fill="#00D4AA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Attendee breakdown pie */}
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Attendee Breakdown</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={3}>
                    {CATEGORY_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {CATEGORY_DATA.map(d => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color }} />
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{d.name}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: d.color }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Crowd Timeline */}
        <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Predicted Crowd Timeline (Event Day)</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={CROWD_TIMELINE}>
              <defs>
                <linearGradient id="crowdGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D4AA" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00D4AA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" tick={{ fontSize: 12, fill: 'var(--text-faint)' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `${v}%`} domain={[0, 100]} tick={{ fontSize: 12, fill: 'var(--text-faint)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} formatter={(v) => [`${v}%`, 'Crowd Level']} />
              <Area type="monotone" dataKey="occupancy" stroke="#00D4AA" fill="url(#crowdGrad)" strokeWidth={2.5} name="Crowd %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Capacity breakdown per zone */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Zone Capacity Summary</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Zone</th>
                <th>Capacity</th>
                <th>Projected Peak</th>
                <th>Utilization</th>
                <th>Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {EVENT.zones.map(z => {
                const utilPct = Math.round(Math.random() * 40 + 55);
                const risk = utilPct > 85 ? { label: 'High', color: 'badge-danger' } : utilPct > 60 ? { label: 'Medium', color: 'badge-warning' } : { label: 'Low', color: 'badge-success' };
                return (
                  <tr key={z.id}>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: z.color }} />{z.name}</div></td>
                    <td>{z.capacity.toLocaleString()}</td>
                    <td style={{ fontWeight: 700, color: z.color }}>{Math.round(z.capacity * (utilPct / 100)).toLocaleString()}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="progress-bar" style={{ flex: 1 }}>
                          <div className="progress-fill" style={{ width: `${utilPct}%`, background: z.color }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: z.color, minWidth: 36 }}>{utilPct}%</span>
                      </div>
                    </td>
                    <td><span className={`badge ${risk.color}`}>{risk.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
