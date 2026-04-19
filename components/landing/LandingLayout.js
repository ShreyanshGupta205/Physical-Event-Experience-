'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Menu, X, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import styles from './Landing.module.css';

export function LandingNavbar() {
  const { isLoggedIn, role, sessionLoading } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dashboardLink = role === 'student' ? '/student/events' : `/${role}`;

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}><Zap size={18} fill="currentColor" /></div>
          <span>Eventra</span>
        </Link>

        {/* Desktop Nav */}
        <div className={styles.navLinks}>
          <Link href="#features">Features</Link>
          <Link href="#how-it-works">How It Works</Link>
          <Link href="#who-it-is-for">Solutions</Link>
          <div className={styles.divider} />
          {!sessionLoading && (
            isLoggedIn ? (
              <Link href={dashboardLink} className="btn btn-primary btn-sm">Dashboard <ArrowRight size={14} /></Link>
            ) : (
              <>
                <Link href="/auth" className={styles.navLogin}>Login</Link>
                <Link href="/auth" className="btn btn-primary btn-sm">Sign Up <ArrowRight size={14} /></Link>
              </>
            )
          )}
        </div>


        {/* Mobile Toggle */}
        <button className={styles.menuToggle} onClick={() => setMobileMenu(!mobileMenu)}>
          {mobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className={styles.mobileMenu}>
          <Link href="#features" onClick={() => setMobileMenu(false)}>Features</Link>
          <Link href="#how-it-works" onClick={() => setMobileMenu(false)}>How It Works</Link>
          {isLoggedIn ? (
             <Link href={dashboardLink} className="btn btn-primary" onClick={() => setMobileMenu(false)}>Dashboard</Link>
          ) : (
            <>
              <Link href="/auth" onClick={() => setMobileMenu(false)}>Login</Link>
              <Link href="/auth" className="btn btn-primary" onClick={() => setMobileMenu(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}


export function LandingFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerBrand}>
          <div className={styles.logo}>
             <div className={styles.logoIcon}><Zap size={18} fill="currentColor" /></div>
             <span>Eventra</span>
          </div>
          <p>The AI-powered frontier for physical event intelligence and management.</p>
        </div>
        
        <div className={styles.footerCols}>
          <div className={styles.footerCol}>
            <h4>Platform</h4>
            <Link href="#features">Features</Link>
            <Link href="/discover">Event Discovery</Link>
            <Link href="/organizer">Organizers</Link>
          </div>
          <div className={styles.footerCol}>
            <h4>Company</h4>
            <Link href="#">About</Link>
            <Link href="#">Contact</Link>
          </div>
          <div className={styles.footerCol}>
            <h4>Legal</h4>
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>© 2026 Eventra Operations. All rights reserved.</p>
      </div>
    </footer>
  );
}
