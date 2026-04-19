'use client';
import { LandingNavbar, LandingFooter } from '@/components/landing/LandingLayout';

export default function TermsPage() {
  return (
    <div className="landing-bg">
      <LandingNavbar />
      <main style={{ paddingTop: '150px', minHeight: '80vh', maxWidth: 900, margin: '0 auto', padding: '150px 2rem 100px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Terms of Service</h1>
        <div className="glass-card" style={{ padding: '3rem', lineHeight: 1.8, color: 'var(--text-muted)' }}>
          <p style={{ marginBottom: '1.5rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Updated: October 2026</p>
          
          <h3 style={{ color: 'var(--text)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>1. Agreement Overview</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            By utilizing the Eventra platform, including the Explorer portals, Creator suites, and Overseer interfaces, you agree to comply with our global enterprise terms of service. You must be at least the legal age of majority in your jurisdiction to provision a Creator or Overseer account.
          </p>
          
          <h3 style={{ color: 'var(--text)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>2. Event Governance</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            Creators are solely responsible for the physical safety, regulatory compliance, and accuracy of events deployed on the Eventra platform. The platform operates primarily as an orchestration and telemetry engine. The platform administration reserves the right to reject or suspend event deployments that violate security protocols.
          </p>

          <h3 style={{ color: 'var(--text)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>3. Service Availability</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            While Eventra strives for 99.9% uptime, access to the platform may occasionally be suspended for maintenance or due to unforeseeable circumstances. Eventra is not liable for temporary localized disruptions during physical deployments.
          </p>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
