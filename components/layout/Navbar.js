'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  Search, Bell, Menu, X, ChevronDown, 
  Settings, LogOut, Code, User as UserIcon,
  Zap, Calendar, Map, Users, Award, Plus
} from 'lucide-react';
import styles from './Navbar.module.css';

const ROLE_CONFIG = {
  student: { color: 'var(--primary)', label: 'Student', icon: <UserIcon size={16} /> },
  organizer: { color: 'var(--secondary)', label: 'Organizer', icon: <Calendar size={16} /> },
  admin: { color: 'var(--accent)', label: 'Admin', icon: <Code size={16} /> },
  staff: { color: '#fbbf24', label: 'Staff', icon: <Map size={16} /> }
};

export default function Navbar({ onMenuToggle, onBannerStateChange }) {
  const { user, role, setRole, logout } = useApp();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [broadcasts, setBroadcasts] = useState([]);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    fetch('/api/admin/broadcast')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setBroadcasts(data);
          onBannerStateChange?.(true);
        }
      })
      .catch(() => {});
  }, [onBannerStateChange]);

  const closeBanner = () => {
    setShowBanner(false);
    onBannerStateChange?.(false);
  };

  const config = ROLE_CONFIG[role] || ROLE_CONFIG.student;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {showBanner && broadcasts.length > 0 && (
        <div className={styles.broadcastBanner}>
          <div className={styles.bannerContent}>
            <Zap size={14} className={styles.bannerIcon} />
            <span className={styles.bannerText}><strong>{broadcasts[0].title}:</strong> {broadcasts[0].message}</span>
          </div>
          <button className={styles.bannerClose} onClick={closeBanner}><X size={14} /></button>
        </div>
      )}
      <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`} style={{ top: 'var(--banner-offset)' }} role="banner">
        
        {/* Left: Logo & Menu */}
        <div className={styles.left}>
          <button className={styles.menuBtn} onClick={onMenuToggle} aria-label="Open main menu">
            <Menu size={20} />
          </button>
          
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <Zap size={18} fill="currentColor" />
            </div>
            <span className={styles.logoText}>Eventra</span>
          </Link>
        </div>

        {/* Center: Universal Search */}
        <div className={styles.searchBar} role="search">
          <Search size={16} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search experiences..." 
            className={styles.searchInput}
            value={searchQuery}
            aria-label="Search experiences"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className={styles.clearBtn} onClick={() => setSearchQuery('')} aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Right: Actions & Profile */}
        <div className={styles.right}>
          
          {/* Notifications */}
          <div className={styles.dropdownWrap}>
            <button 
              className={styles.iconBtn}
              onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              aria-label="Toggle notifications"
              aria-expanded={notifOpen}
              aria-haspopup="menu"
            >
              <Bell size={18} />
              <div className={styles.badge}>2</div>
            </button>

            {notifOpen && (
              <div className={styles.dropdown} role="menu" aria-label="Notifications menu">
                <div className={styles.dropdownHeader}>
                  <span>Notifications</span>
                  <span className={styles.markRead}>Mark read</span>
                </div>
                <div>
                  {[
                    { id: 1, title: 'Check-in Successful', desc: 'You have checked into the AI Summit.', time: '2m ago' },
                    { id: 2, title: 'New Badge Earned', desc: 'You received the "Early Bird" badge.', time: '1h ago' }
                  ].map(n => (
                    <div key={n.id} className={`${styles.notifItem} ${styles.unread}`}>
                      <div className={styles.notifDot}></div>
                      <div style={{ flex: 1 }}>
                        <p className={styles.notifMsg}>{n.desc}</p>
                        <span className={styles.notifTime}>{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className={styles.dropdownWrap}>
            {!user ? (
              <Link href="/auth" className="btn btn-primary btn-sm" style={{ padding: '0.5rem 1.25rem' }}>
                Sign In
              </Link>
            ) : (
              <>
                <button 
                  className={styles.profileBtn}
                  onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                  aria-label="Toggle user profile menu"
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                >
                  <div className={styles.avatar} style={{ background: `linear-gradient(135deg, ${config.color}, #000)` }}>
                    {user.avatar || user.name?.[0] || 'U'}
                  </div>
                  <div className={styles.profileInfo}>
                    <span className={styles.profileName}>{(user.name || 'User').split(' ')[0]}</span>
                    <span className={styles.profileRole} style={{ color: config.color }}>{config.label}</span>
                  </div>
                  <ChevronDown size={14} className={`${styles.chevron} ${profileOpen ? styles.chevronOpen : ''}`} />
                </button>

                {profileOpen && (
                  <div className={styles.dropdown} role="menu" aria-label="User profile menu">
                    
                    <div className={styles.dropdownHeader}>
                      <div className={styles.dropdownUser}>
                        <div className={styles.avatar} style={{ background: `linear-gradient(135deg, ${config.color}, #000)` }}>
                          {user.avatar || user.name?.[0] || 'U'}
                        </div>
                        <div>
                          <div className={styles.profileName}>{user.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>{user.email}</div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.dropdownSection}>
                      <div className={styles.sectionLabel}>Tools & Experiences</div>
                      {role === 'student' && (
                        <>
                          <Link href="/student/networking" className={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                            <Users size={16} /> Smart Networking
                          </Link>
                          <Link href="/student/achievements" className={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                            <Award size={16} /> Achievements
                          </Link>
                        </>
                      )}
                      {role === 'organizer' && (
                        <Link href="/organizer/create" className={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                          <Plus size={16} /> Deploy New Experience
                        </Link>
                      )}
                      <Link href="/settings" className={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                        <Settings size={16} /> Protocol Settings
                      </Link>
                    </div>
                    
                    <div className={styles.dropdownDivider} />

                    <div className={styles.dropdownSection}>
                      <div className={styles.sectionLabel}>Switch Perspective</div>
                      {Object.entries(ROLE_CONFIG).filter(([r]) => r !== role).map(([key, cfg]) => (
                        <button key={key} className={styles.dropdownItem} onClick={() => { setRole(key); setProfileOpen(false); }}>
                          <div className={styles.roleDot} style={{ background: cfg.color }} />
                          {cfg.label} Portal
                        </button>
                      ))}
                    </div>

                    <div className={styles.dropdownDivider} />

                    <div className={styles.dropdownSection}>
                      <button className={`${styles.dropdownItem} ${styles.danger}`} onClick={logout}>
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>

                  </div>
                )}
              </>
            )}
          </div>
          
        </div>
      </header>
    </>
  );
}
