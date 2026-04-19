'use client';
import { LandingNavbar, LandingFooter } from '@/components/landing/LandingLayout';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="landing-bg">
      <LandingNavbar />
      <main style={{ paddingTop: '150px', minHeight: '80vh', maxWidth: 900, margin: '0 auto', padding: '150px 2rem 100px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>About Eventra</h1>
        <div className="glass-card" style={{ padding: '3rem', lineHeight: 1.8, color: 'var(--text-muted)' }}>
          <p style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>
            Eventra was founded on a simple premise: physical events are computationally broken. As gatherings scale, the entropy in queuing, access control, and density management scales exponentially.
          </p>
          <p style={{ marginBottom: '1.5rem' }}>
            We've built an AI-native orchestration layer that maps the physics of crowds and turns chaotic environments into structured, predictable data models. By equipping organizers with <strong>Overseer</strong> capabilities and arming staff with <strong>Guardian</strong> tactical scanners, we eliminate the friction between attendees and the experiences they seek.
          </p>
          <h3 style={{ color: 'var(--text)', marginTop: '3rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Our Mission</h3>
          <p style={{ marginBottom: '2rem' }}>
            To build the digital infrastructure for physical human connection, ensuring every event is perfectly coordinated from registration to final exit.
          </p>
          <Link href="/contact" className="btn btn-primary">
            Contact the Team <ArrowRight size={16} />
          </Link>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
