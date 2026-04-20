'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LandingNavbar, LandingFooter } from '@/components/landing/LandingLayout';
import Counter from '@/components/ui/Counter';
import Reveal from '@/components/ui/Reveal';
import { 
  ArrowRight, Zap, Shield, Users, Map, 
  Search, CheckCircle, BarChart3, QrCode, 
  Activity, AlertTriangle, Layers, Smartphone, Clock, Play
} from 'lucide-react';
import styles from '@/components/landing/Landing.module.css';
import { useApp } from '@/context/AppContext';


// Enhanced Section Component with Reveal
const Section = ({ id, tag, title, desc, children, delay = 0 }) => (
  <section id={id} className={styles.section}>
    <Reveal delay={delay}>
      <div className={styles.sectionHeader}>
        {tag && <span className={styles.sectionTag}>{tag}</span>}
        <h2 className={styles.sectionTitle}>{title}</h2>
        <p className={styles.sectionDesc}>{desc}</p>
      </div>
    </Reveal>
    <Reveal delay={delay + 0.2}>
      {children}
    </Reveal>
  </section>
);

export default function SaaSPageV2() {
  const { isLoggedIn, role } = useApp();
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [activeTab, setActiveTab] = useState(0);

  const dashboardLink = role === 'student' ? '/student/events' : `/${role}`;


  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (clientX / innerWidth) * 100,
      y: (clientY / innerHeight) * 100
    });
  };

  return (
    <div className="landing-bg" onMouseMove={handleMouseMove} style={{ '--mouse-x': `${mousePos.x}%`, '--mouse-y': `${mousePos.y}%` }}>
      <LandingNavbar />

      <main>
        {/* HERO SECTION 2.0 */}
        <section className={styles.hero}>
          <div className={styles.heroGlow} />
          
          <Reveal>
             <div className="live-badge animate-pulse">
                <span className="pulse-dot" />
                Connectivity: Advanced AI Venue Orchestration
             </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className={styles.heroTitle}>
              Smarter Events.<br />
              <span className="gradient-text">Seamless Experiences.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className={styles.heroSub}>
              Eventra is the world's most advanced AI-orchestration layer for physical events. Reduce friction, eliminate queues, and unlock absolute coordination.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className={styles.heroActions}>
              {isLoggedIn ? (
                <Link href={dashboardLink} className="btn btn-primary btn-lg shine">
                   Go to My Dashboard <ArrowRight size={18} />
                </Link>
              ) : (
                <div className="cta-group">
                  <div className="cta-column">
                    <span className="cta-label">Experience as Attendee</span>
                    <Link href="/auth" className="btn btn-primary btn-lg shine">
                       Join as Explorer <ArrowRight size={18} />
                    </Link>
                  </div>
                  <div className="cta-column">
                    <span className="cta-label">Manage as Organizer</span>
                    <Link href="/auth" className="btn btn-secondary btn-lg">
                       Partner Access
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </Reveal>


          <Reveal delay={0.5}>
            <div className="hero-product-preview-v2">
              <div className="mockup-v2 glass-card">
                 <Image 
                   src="/eventra_dashboard_mockup_1776458173220.png" 
                   alt="Eventra Global Dashboard" 
                   className="mockup-img-v2"
                   width={1100}
                   height={618}
                   priority
                 />
                 <div className="preview-overlay" />
                 
                 {/* Floating Interactive Elements */}
                 <div className="floating-card c-1 blur-glass">
                    <Activity size={14} color="#10b981" />
                    <div>
                       <small>Current Flow</small>
                       <strong>Normal</strong>
                    </div>
                 </div>
                 <div className="floating-card c-2 blur-glass">
                    <Users size={14} color="#6366f1" />
                    <div>
                       <small>Total Density</small>
                       <strong>84%</strong>
                    </div>
                 </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* PROBLEM SECTION */}
        <Section 
          tag="The Conflict" 
          title="Events are breaking at scale" 
          desc="Legacy systems can't handle the physics of modern crowds. Friction isn't just annoying—it's expensive."
        >
          <div className={styles.grid}>
            {[
              { icon: AlertTriangle, title: "Crowd Friction", text: "Linear growth in attendees leads to exponential growth in chaos." },
              { icon: Clock, title: "Dead Time", text: "Attendees spend 30% of their event experience waiting in queues." },
              { icon: BarChart3, title: "Operational Dark", text: "Most organizers have zero visibility into venue health until it's too late." }
            ].map((p, i) => (
              <div key={i} className={styles.card}>
                <div className={styles.cardIcon}><p.icon size={28} /></div>
                <h3 className={styles.cardTitle}>{p.title}</h3>
                <p className={styles.cardText}>{p.text}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* STATS STRIP V2 */}
        <section className="stats-v2 container">
            <Reveal>
               <div className="stats-grid glass-card">
                  <div className="s-item">
                     <h3><Counter end={0} suffix="+" /></h3>
                     <p>Global Attendees</p>
                  </div>
                  <div className="v-div" />
                  <div className="s-item">
                     <h3><Counter end={0} /></h3>
                     <p>Live Venues</p>
                  </div>
                  <div className="v-div" />
                  <div className="s-item">
                     <h3><Counter end={100} suffix="%" /></h3>
                     <p>System Uptime</p>
                  </div>
               </div>
            </Reveal>
        </section>


        {/* FINAL CTA V2 */}
        <section className="final-cta-v2 container">
            <div className="cta-banner glass-card shine-grid">
               <Reveal>
                  <h2>Ready for the Smart Era?</h2>
                  <p>Join the future of physical event management with Eventra intelligence.</p>
                  <div className={styles.heroActions}>
                    {isLoggedIn ? (
                      <Link href={dashboardLink} className="btn btn-primary btn-lg">Back to Dashboard</Link>
                    ) : (
                      <Link href="/auth" className="btn btn-primary btn-lg">Start Free Now</Link>
                    )}
                    <Link href="/contact" className="btn btn-secondary btn-lg">Contact Enterprise</Link>
                  </div>

               </Reveal>
            </div>
        </section>
      </main>

      <LandingFooter />

      <style jsx>{`
        .container { max-width: 1300px; margin: 0 auto; padding: 0 2rem; }
        .live-badge { display: inline-flex; align-items: center; gap: 0.75rem; padding: 0.5rem 1.25rem; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: var(--radius-full); color: var(--secondary-light); font-size: 0.75rem; font-weight: 700; margin-bottom: 2.5rem; }
        .pulse-dot { width: 8px; height: 8px; background: var(--secondary); border-radius: 50%; display: block; box-shadow: 0 0 10px var(--secondary); }

        .cta-group { display: flex; gap: 2rem; align-items: flex-end; }
        .cta-column { display: flex; flex-direction: column; gap: 0.75rem; text-align: left; }
        .cta-label { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--text-faint); letter-spacing: 0.1em; margin-left: 0.25rem; }
        
        @media (max-width: 768px) {
          .cta-group { flex-direction: column; align-items: stretch; gap: 1.5rem; }
          .cta-column { text-align: center; }
          .cta-label { text-align: center; margin-left: 0; }
        }

        .hero-product-preview-v2 { position: relative; margin-top: 4rem; perspective: 1000px; }
        .mockup-v2 { position: relative; max-width: 1100px; margin: 0 auto; padding: 0.75rem !important; border-radius: 20px; animation: hero-float 6s ease-in-out infinite; }
        @keyframes hero-float { 0%, 100% { transform: translateY(0) rotateX(2deg); } 50% { transform: translateY(-20px) rotateX(0deg); } }
        .mockup-img-v2 { width: 100%; border-radius: 12px; display: block; filter: brightness(0.9); transition: filter 0.3s; }
        .mockup-v2:hover .mockup-img-v2 { filter: brightness(1); }
        .preview-overlay { position: absolute; inset: 0; background: linear-gradient(to top, var(--bg) 0%, transparent 40%); pointer-events: none; }

        .floating-card { position: absolute; padding: 1rem 1.5rem; display: flex; align-items: center; gap: 1rem; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); z-index: 10; font-size: 0.875rem; text-align: left; }
        .floating-card strong { display: block; font-size: 1.125rem; }
        .c-1 { top: 20%; left: -50px; }
        .c-2 { bottom: 30%; right: -50px; }

        .stats-v2 { padding: 4rem 0; }
        .stats-grid { display: flex; justify-content: space-around; padding: 4rem !important; background: linear-gradient(135deg, rgba(255,255,255,0.03), transparent); }
        .s-item { text-align: center; }
        .s-item h3 { font-size: 3rem; margin-bottom: 0.5rem; color: var(--primary-light); }
        .s-item p { color: var(--text-faint); font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; }
        .v-div { width: 1px; height: 60px; background: var(--border); }

        .audience-v2 { padding: 0 !important; overflow: hidden; }
        .a-tabs { display: flex; border-bottom: 1px solid var(--border); }
        .a-tab { flex: 1; padding: 1.5rem; background: none; border: none; color: var(--text-muted); font-weight: 700; cursor: pointer; transition: all 0.3s; border-right: 1px solid var(--border); }
        .a-tab:last-child { border-right: none; }
        .a-tab.active { background: rgba(99, 102, 241, 0.05); color: var(--primary-light); border-bottom: 2px solid var(--primary); }
        .a-content { padding: 4rem; text-align: left; min-height: 240px; }
        .a-pane h3 { font-size: 2rem; margin-bottom: 1.5rem; }
        .a-pane p { font-size: 1.125rem; color: var(--text-muted); line-height: 1.7; max-width: 800px; }

        .final-cta-v2 { padding: 10rem 0; }
        .cta-banner { padding: 6rem !important; text-align: center; background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent); }
        .cta-banner h2 { font-size: 4rem; margin-bottom: 1.5rem; }
        .cta-banner p { font-size: 1.25rem; color: var(--text-muted); margin-bottom: 3.5rem; }

        @media (max-width: 1024px) {
           .stats-grid { flex-direction: column; gap: 3rem; }
           .v-div { width: 100%; height: 1px; }
           .floating-card { display: none; }
           .cta-banner h2 { font-size: 2.5rem; }
        }
      `}</style>
    </div>
  );
}
