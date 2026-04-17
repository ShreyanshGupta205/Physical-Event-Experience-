'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Home, Calendar, LayoutDashboard, Users, Settings,
  QrCode, Bell, BarChart2, PlusCircle, ShieldCheck,
  Map, Zap, ChevronRight, TrendingUp, UserCheck, Activity, X, Trophy
} from 'lucide-react';

const NAV_CONFIG = {
  student: [
    { href: '/', icon: Home, label: 'Discover Events' },
    { href: '/student', icon: LayoutDashboard, label: 'Experience Hub' },
    { href: '/student/networking', icon: Users, label: 'Networking' },
    { href: '/student/achievements', icon: Trophy, label: 'Achievements' },
    { href: '/student/events', icon: Calendar, label: 'My Sessions' },
    { href: '/student/pass', icon: QrCode, label: 'Digital Passes' },
  ],
  organizer: [
    { href: '/', icon: Home, label: 'Platform Home' },
    { href: '/organizer', icon: LayoutDashboard, label: 'Event Console' },
    { href: '/organizer/create', icon: PlusCircle, label: 'Create New' },
    { href: '/organizer/crowd', icon: Map, label: 'Venue Intel' },
    { href: '/organizer/analytics', icon: BarChart2, label: 'Insights' },
  ],
  admin: [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/admin', icon: ShieldCheck, label: 'System Admin' },
    { href: '/admin/users', icon: Users, label: 'User Directory' },
    { href: '/admin/events', icon: Calendar, label: 'Approvals' },
  ],
  staff: [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/staff', icon: UserCheck, label: 'Gate Control' },
    { href: '/organizer/crowd', icon: Activity, label: 'Venue Monitor' },
  ],
};

const ROLE_COLORS = {
  student: { primary: 'var(--primary)', glow: 'var(--primary-glow)', label: 'Student' },
  organizer: { primary: 'var(--secondary)', glow: 'var(--secondary-glow)', label: 'Organizer' },
  admin: { primary: 'var(--accent)', glow: 'var(--accent-glow)', label: 'Admin' },
  staff: { primary: '#fbbf24', glow: 'rgba(251, 191, 36, 0.1)', label: 'Staff' },
};

export default function Sidebar({ open, onClose }) {
  const { role } = useApp();
  const pathname = usePathname();
  const navItems = NAV_CONFIG[role] || NAV_CONFIG.student;
  const config = ROLE_COLORS[role] || ROLE_COLORS.student;

  return (
    <>
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="role-portal-badge" style={{ borderColor: config.primary + '33', background: config.glow }}>
            <div className="role-dot" style={{ background: config.primary }} />
            <span style={{ color: config.primary }}>{config.label} Perspective</span>
          </div>
          <button className="mobile-close" onClick={onClose}><X size={18} /></button>
        </div>

        <nav className="sidebar-nav stagger">
          {navItems.map((item, idx) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
                style={isActive ? { color: config.primary } : {}}
                onClick={() => { if (window.innerWidth < 1024) onClose(); }}
              >
                <div className={`nav-link-icon ${isActive ? 'active' : ''}`} style={isActive ? { background: config.glow, color: config.primary } : {}}>
                  <item.icon size={18} />
                </div>
                <span className="nav-link-label">{item.label}</span>
                {isActive && <div className="nav-active-indicator" style={{ background: config.primary }} />}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="ai-status-card glass-card">
            <div className="ai-icon-pulse">
              <Zap size={14} fill="currentColor" />
            </div>
            <div className="ai-content">
              <h5>EventSphere AI</h5>
              <p>Predicting crowd flows...</p>
            </div>
          </div>
          
          <Link href="/settings" className="footer-nav-link">
            <Settings size={16} />
            <span>Preferences</span>
          </Link>
        </div>

        <style jsx>{`
          .sidebar {
            position: fixed;
            top: 0; left: 0; bottom: 0;
            width: var(--sidebar-width);
            background: rgba(3, 4, 11, 0.6);
            backdrop-filter: blur(20px);
            border-right: 1px solid var(--border);
            z-index: 1001;
            display: flex;
            flex-direction: column;
            transition: var(--transition-slow);
            padding: 1.5rem;
          }

          @media (max-width: 1024px) {
            .sidebar {
              transform: translateX(-100%);
              background: var(--bg);
            }
            .sidebar.open {
              transform: translateX(0);
              box-shadow: 20px 0 60px rgba(0,0,0,0.8);
            }
          }

          .sidebar-header {
            height: var(--navbar-height);
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 2rem;
          }

          .role-portal-badge {
            display: flex;
            align-items: center;
            gap: 0.625rem;
            padding: 0.5rem 1rem;
            border-radius: var(--radius-full);
            border: 1px solid;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .role-dot {
            width: 6px; height: 6px;
            border-radius: 50%;
            box-shadow: 0 0 8px currentColor;
          }

          .mobile-close {
            display: none;
            color: var(--text-muted);
          }

          @media (max-width: 1024px) {
            .mobile-close { display: block; }
          }

          .sidebar-nav {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .nav-link {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.75rem;
            border-radius: var(--radius-md);
            color: var(--text-muted);
            text-decoration: none;
            transition: var(--transition);
            position: relative;
            font-weight: 500;
            font-size: 0.9375rem;
          }

          .nav-link:hover {
            color: var(--text);
            background: var(--bg-glass);
            transform: translateX(4px);
          }

          .nav-link.active {
            background: var(--bg-glass);
            font-weight: 600;
          }

          .nav-link-icon {
            width: 36px; height: 36px;
            display: flex; align-items: center; justify-content: center;
            border-radius: var(--radius-md);
            transition: var(--transition);
            color: var(--text-faint);
          }

          .nav-link:hover .nav-link-icon {
            color: var(--text);
          }

          .nav-active-indicator {
            position: absolute;
            left: -1.5rem;
            width: 4px; height: 20px;
            border-radius: 0 4px 4px 0;
            box-shadow: 0 0 12px currentColor;
          }

          .sidebar-footer {
            margin-top: auto;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .ai-status-card {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1.25rem !important;
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(16, 185, 129, 0.05)) !important;
          }

          .ai-icon-pulse {
            width: 32px; height: 32px;
            background: var(--primary);
            color: white;
            display: flex; align-items: center; justify-content: center;
            border-radius: var(--radius-sm);
            flex-shrink: 0;
            animation: ai-pulse 2s infinite;
          }

          .ai-content h5 { font-size: 0.875rem; margin-bottom: 2px; }
          .ai-content p { font-size: 0.75rem; color: var(--text-faint); }

          @keyframes ai-pulse {
            0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
            100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
          }

          .footer-nav-link {
            display: flex;
            align-items: center; gap: 0.75rem;
            color: var(--text-faint);
            font-size: 0.875rem;
            font-weight: 600;
            text-decoration: none;
            padding: 0.5rem;
            transition: var(--transition);
          }

          .footer-nav-link:hover {
            color: var(--text-muted);
            transform: translateY(-2px);
          }

          .backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.4);
            backdrop-filter: blur(4px);
            z-index: 1000;
          }
        `}</style>
      </aside>
      {open && <div className="backdrop" onClick={onClose} />}
    </>
  );
}
