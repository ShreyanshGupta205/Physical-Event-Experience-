'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import {
  Home, Calendar, LayoutDashboard, Users, Settings,
  QrCode, Bell, BarChart2, PlusCircle, ShieldCheck,
  Map, Zap, ChevronRight, TrendingUp, UserCheck, Activity, X, Trophy,
  Megaphone, History
} from 'lucide-react';
import styles from './Sidebar.module.css';

const NAV_CONFIG = {
  student: [
    { href: '/student/events', icon: Calendar, label: 'My Sessions' },
    { href: '/discover', icon: Home, label: 'Discover Events' },
    { href: '/student', icon: LayoutDashboard, label: 'Experience Hub' },
    { href: '/student/networking', icon: Users, label: 'Networking' },
    { href: '/student/achievements', icon: Trophy, label: 'Achievements' },
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
    { href: '/admin', icon: ShieldCheck, label: 'Control Tower' },
    { href: '/admin/users', icon: Users, label: 'User Directory' },
    { href: '/admin/events', icon: Calendar, label: 'Approvals' },
    { href: '/admin/broadcast', icon: Megaphone, label: 'Broadcast Center' },
    { href: '/admin/logs', icon: History, label: 'Audit Logs' },
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
  const { role: contextRole, events, setRole } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [prediction, setPrediction] = useState('Analyzing telemetry...');

  // Derive role from path for visual consistency
  let activeRole = contextRole;
  if (pathname.startsWith('/organizer')) activeRole = 'organizer';
  else if (pathname.startsWith('/admin')) activeRole = 'admin';
  else if (pathname.startsWith('/staff')) activeRole = 'staff';
  else if (pathname.startsWith('/student')) activeRole = 'student';

  useEffect(() => {
    if (activeRole !== contextRole) {
      setRole(activeRole);
    }
  }, [activeRole, contextRole, setRole]);

  useEffect(() => {
    if (events && events.length > 0 && activeRole === 'organizer') {
      fetch(`/api/ai/predict?eventId=${events[0].id}`)
        .then(res => res.json())
        .then(data => setPrediction(data.suggestion || 'System nominal.'))
        .catch(() => setPrediction('Telemetry disconnected.'));
    } else if (activeRole !== 'organizer') {
      setPrediction('AI securely monitoring bounds.');
    }
  }, [events, activeRole]);

  const navItems = NAV_CONFIG[activeRole] || NAV_CONFIG.student;
  const config = ROLE_COLORS[activeRole] || ROLE_COLORS.student;

  return (
    <>
      <aside 
        className={`${styles.sidebar} ${open ? styles.open : ''}`}
        aria-label="Sidebar navigation"
        aria-hidden={!open && typeof window !== 'undefined' && window.innerWidth < 1024}
      >
        <div className={styles.sidebarHeader}>
          <div className={styles.rolePortalBadge} style={{ borderColor: config.primary + '33', background: config.glow }} role="status">
            <div className={styles.roleDot} style={{ background: config.primary }} aria-hidden="true" />
            <span style={{ color: config.primary }}>{config.label} Perspective</span>
          </div>
          <button className={styles.mobileClose} onClick={onClose} aria-label="Close sidebar"><X size={18} /></button>
        </div>

        <nav className={`${styles.sidebarNav} stagger`} aria-label="Main menu">
          {navItems.map((item, idx) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                style={isActive ? { color: config.primary } : {}}
                onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className={`${styles.navLinkIcon} ${isActive ? styles.active : ''}`} style={isActive ? { background: config.glow, color: config.primary } : {}} aria-hidden="true">
                  <item.icon size={18} />
                </div>
                <span className={styles.navLinkLabel}>{item.label}</span>
                {isActive && <div className={styles.navActiveIndicator} style={{ background: config.primary }} aria-hidden="true" />}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={`${styles.aiStatusCard} glass-card`} role="complementary" aria-label="AI Insight">
            <div className={styles.aiIconPulse} aria-hidden="true">
              <Zap size={14} fill="currentColor" />
            </div>
            <div className={styles.aiContent}>
              <h5>Eventra AI</h5>
              <p style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prediction}</p>
            </div>
          </div>
          
          <div className={styles.perspectiveSwitcher}>
            <span className={styles.switcherLabel}>PLATFORM PERSPECTIVE</span>
            <div className={styles.switcherGrid} role="group" aria-label="Switch user perspective">
              {['student', 'organizer', 'admin', 'staff'].map(r => (
                <button 
                  key={r} 
                  className={`${styles.switchBtn} ${activeRole === r ? styles.activeSwitch : ''}`}
                  onClick={() => {
                    setRole(r);
                    const dest = r === 'student' ? '/student/events' : `/${r}`;
                    router.push(dest);
                  }}
                  title={`Switch to ${r} portal`}
                  aria-pressed={activeRole === r}
                  aria-label={`Switch to ${r} perspective`}
                >
                  {r.charAt(0).toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          
          <Link href="/settings" className={styles.footerNavLink}>
            <Settings size={16} />
            <span>Preferences</span>
          </Link>
        </div>
      </aside>
      {open && <div className={styles.backdrop} onClick={onClose} />}
    </>
  );
}
