'use client';
import { LandingNavbar, LandingFooter } from '@/components/landing/LandingLayout';
import { Zap, Shield, Map, QrCode } from 'lucide-react';
import styles from '@/components/landing/Landing.module.css';

export default function FeaturesPage() {
  return (
    <div className="landing-bg">
      <LandingNavbar />
      <main style={{ paddingTop: '150px', minHeight: '80vh', paddingBottom: '100px', maxWidth: 1300, margin: '0 auto', padding: '150px 2rem 100px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Platform Capabilities</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', maxWidth: 700, marginBottom: '5rem', lineHeight: 1.6 }}>Discover how Eventra re-engineers human movement inside physical environments.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {[
            { icon: Zap, title: "Predictive Flow", text: "AI anticipates bottlenecks before they form, redirecting staff automatically to maintain low density." },
            { icon: Shield, title: "Unified Command", text: "A single source of truth for security personnel, support staff, and VIP coordination." },
            { icon: Map, title: "Spatial Intelligence", text: "X-ray vision into your venue. Know exactly where your high-value audiences are concentrated." },
            { icon: QrCode, title: "Hyper-Scan Technology", text: "Process up to 50 attendees per minute per gate with dynamic biometric-ready scanning." }
          ].map((f, i) => (
            <div key={i} className="glass-card" style={{ padding: '2.5rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-glow)', color: 'var(--primary-light)', marginBottom: '1.5rem' }}>
                <f.icon size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.text}</p>
            </div>
          ))}
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
