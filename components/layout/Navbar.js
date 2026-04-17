'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Bell, Search, Menu, X, ChevronDown, LogOut,
  User, Settings, Zap, Globe, Shield, Plus, Award, Users
} from 'lucide-react';

const ROLE_CONFIG = {
  student: { color: 'var(--primary)', icon: <User size={14} />, label: 'Student' },
  organizer: { color: 'var(--secondary)', icon: <Globe size={14} />, label: 'Organizer' },
  admin: { color: 'var(--accent)', icon: <Shield size={14} />, label: 'Admin' },
  staff: { color: '#fbbf24', icon: <Zap size={14} />, label: 'Staff' },
};

export default function Navbar({ onMenuToggle }) {
  const { user, role, setRole } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const config = ROLE_CONFIG[role] || ROLE_CONFIG.student;

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <div className="nav-left">
          <button className="btn btn-ghost btn-icon mobile-menu-toggle" onClick={onMenuToggle}>
            <Menu size={20} />
          </button>
          
          <Link href="/" className="nav-logo">
            <div className="logo-icon-wrap">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="logo-text">EventSphere</span>
          </Link>
        </div>

        <div className="nav-center">
          <div className="nav-search">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search experiences..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && <X size={14} className="search-clear" onClick={() => setSearchQuery('')} />}
          </div>
        </div>

        <div className="nav-right">
          {/* Notifications */}
          <div className="nav-dropdown-wrap">
            <button 
              className={`btn btn-ghost btn-icon nav-icon-btn ${notifOpen ? 'active' : ''}`}
              onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            >
              <Bell size={20} />
              <div className="notif-badge" />
            </button>
            
            {notifOpen && (
              <div className="nav-dropdown glass-card animate-fadeInUp">
                <div className="dropdown-header">
                  <h3>Notifications</h3>
                  <button className="btn-text">Clear all</button>
                </div>
                <div className="notif-list">
                  {[
                    { id: 1, title: 'Check-in Successful', desc: 'You have checked into the AI Summit.', time: '2m ago' },
                    { id: 2, title: 'New Badge Earned', desc: 'You received the "Early Bird" badge.', time: '1h ago' }
                  ].map(n => (
                    <div key={n.id} className="notif-item">
                      <div className="notif-icon"><Zap size={14} /></div>
                      <div className="notif-content">
                        <p className="notif-title">{n.title}</p>
                        <p className="notif-desc">{n.desc}</p>
                        <span className="notif-time">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="nav-dropdown-wrap">
            <button 
              className={`nav-profile-trigger ${profileOpen ? 'active' : ''}`}
              onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            >
              <div className="avatar avatar-md" style={{ background: `linear-gradient(135deg, ${config.color}, #000)` }}>
                {user.avatar}
              </div>
              <div className="nav-profile-meta">
                <span className="nav-profile-name">{user.name.split(' ')[0]}</span>
                <span className="nav-profile-role" style={{ color: config.color }}>{config.label}</span>
              </div>
              <ChevronDown size={14} className={`chevron ${profileOpen ? 'open' : ''}`} />
            </button>

            {profileOpen && (
              <div className="nav-dropdown glass-card animate-fadeInUp profile-dropdown">
                <div className="dropdown-user-header">
                  <div className="avatar avatar-lg" style={{ background: `linear-gradient(135deg, ${config.color}, #000)` }}>
                    {user.avatar}
                  </div>
                  <div className="dropdown-user-info">
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                  </div>
                </div>

                <div className="dropdown-section">
                  <label>Tools & Experiences</label>
                  {role === 'student' && (
                    <>
                      <Link href="/student/networking" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                        <Users size={16} /> <span>Smart Networking</span>
                      </Link>
                      <Link href="/student/achievements" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                        <Award size={16} /> <span>Achievements</span>
                      </Link>
                    </>
                  )}
                  {role === 'organizer' && (
                    <Link href="/organizer/create" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                      <Plus size={16} /> <span>Deploy New Experience</span>
                    </Link>
                  )}
                  <Link href="/settings" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                    <Settings size={16} /> <span>Protocol Settings</span>
                  </Link>
                </div>

                <div className="dropdown-section">
                  <label>Switch Perspective</label>
                  {Object.entries(ROLE_CONFIG).filter(([r]) => r !== role).map(([key, cfg]) => (
                    <button key={key} className="dropdown-item" onClick={() => { setRole(key); setProfileOpen(false); }}>
                      <div className="item-icon-circle" style={{ color: cfg.color }}>{cfg.icon}</div>
                      <span>{cfg.label} Portal</span>
                    </button>
                  ))}
                </div>

                <div className="dropdown-footer">
                  <button className="dropdown-item danger">
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: var(--navbar-height);
          z-index: 1000;
          transition: var(--transition);
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          background: transparent;
        }

        .navbar.scrolled {
          background: rgba(3, 4, 11, 0.8);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
        }

        .navbar-inner {
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        .nav-left, .nav-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: var(--text);
        }

        .logo-icon-wrap {
          width: 38px;
          height: 38px;
          background: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          color: white;
          box-shadow: var(--shadow-primary);
        }

        .logo-text {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 1.25rem;
          letter-spacing: -0.02em;
        }

        .nav-center {
          flex: 1;
          max-width: 600px;
        }

        .nav-search {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
        }

        .nav-search input {
          width: 100%;
          background: var(--bg-glass);
          border: 1px solid var(--border);
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          border-radius: var(--radius-md);
          color: var(--text);
          font-size: 0.9375rem;
          outline: none;
          transition: var(--transition);
        }

        .nav-search input:focus {
          border-color: var(--primary);
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 0 0 4px var(--primary-glow);
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-muted);
        }

        .search-clear {
          position: absolute;
          right: 1rem;
          color: var(--text-faint);
          cursor: pointer;
        }

        .nav-icon-btn {
          position: relative;
          color: var(--text-muted);
        }

        .nav-icon-btn:hover, .nav-icon-btn.active {
          color: var(--text);
          background: var(--bg-glass);
        }

        .notif-badge {
          position: absolute;
          top: 8px; right: 8px;
          width: 8px; height: 8px;
          background: var(--accent);
          border-radius: 50%;
          border: 2px solid var(--bg);
        }

        .nav-profile-trigger {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          border-radius: var(--radius-md);
          transition: var(--transition);
          cursor: pointer;
          border: 1px solid transparent;
        }

        .nav-profile-trigger:hover, .nav-profile-trigger.active {
          background: var(--bg-glass);
          border-color: var(--border);
        }

        .nav-profile-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1.2;
        }

        .nav-profile-name {
          font-weight: 600;
          font-size: 0.9375rem;
          color: var(--text);
        }

        .nav-profile-role {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .chevron { transition: var(--transition); color: var(--text-faint); }
        .chevron.open { transform: rotate(180deg); }

        .nav-dropdown-wrap {
          position: relative;
        }

        .nav-dropdown {
          position: absolute;
          top: calc(100% + 1rem);
          right: 0;
          width: 320px;
          z-index: 1001;
        }

        .dropdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border);
        }

        .notif-item {
          display: flex;
          gap: 1rem;
          padding: 0.75rem;
          border-radius: var(--radius-md);
          transition: var(--transition);
          cursor: pointer;
        }

        .notif-item:hover {
          background: var(--bg-glass);
        }

        .notif-icon {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: var(--bg-glass);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }

        .notif-title { font-weight: 600; font-size: 0.875rem; margin-bottom: 2px; }
        .notif-desc { font-size: 0.8125rem; color: var(--text-muted); line-height: 1.4; }
        .notif-time { font-size: 0.75rem; color: var(--text-faint); margin-top: 4px; display: block; }

        .profile-dropdown {
          width: 280px;
        }

        .dropdown-user-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .dropdown-user-info h4 { font-size: 1rem; margin-bottom: 2px; }
        .dropdown-user-info p { font-size: 0.8125rem; color: var(--text-muted); }

        .dropdown-section label {
          display: block;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--text-faint);
          margin-bottom: 0.5rem;
          letter-spacing: 0.05em;
        }

        .dropdown-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem;
          border-radius: var(--radius-md);
          color: var(--text-muted);
          transition: var(--transition);
          font-size: 0.875rem;
          font-weight: 500;
        }

        .dropdown-item:hover {
          background: var(--bg-glass);
          color: var(--text);
          transform: translateX(4px);
        }

        .dropdown-item.danger { color: #fb7185; }
        .dropdown-item.danger:hover { background: rgba(244, 63, 94, 0.1); }

        .item-icon-circle {
          width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          background: currentColor;
          color: inherit;
          border-radius: 50%;
        }

        .item-icon-circle > :global(svg) { color: white; }

        @media (max-width: 1024px) {
          .nav-center { display: none; }
          .logo-text { display: none; }
        }
      `}</style>
    </nav>
  );
}
