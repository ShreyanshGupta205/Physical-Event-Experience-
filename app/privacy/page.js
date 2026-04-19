'use client';
import { LandingNavbar, LandingFooter } from '@/components/landing/LandingLayout';

export default function PrivacyPage() {
  return (
    <div className="landing-bg">
      <LandingNavbar />
      <main style={{ paddingTop: '150px', minHeight: '80vh', maxWidth: 900, margin: '0 auto', padding: '150px 2rem 100px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Privacy Policy</h1>
        <div className="glass-card" style={{ padding: '3rem', lineHeight: 1.8, color: 'var(--text-muted)' }}>
          <p style={{ marginBottom: '1.5rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Updated: October 2026</p>
          
          <h3 style={{ color: 'var(--text)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>1. Data Collection</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            Eventra collects essential registration data necessary to provision digital entry passes. This includes identifiers such as name, email address, and generated QR codes. We do not collect persistent location data outside of specific event coordinates during the duration of your registered experience.
          </p>
          
          <h3 style={{ color: 'var(--text)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>2. Use of Telemetry</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            Our orchestration tools rely on anonymous aggregate density metrics. When you scan into a Zone or Gate, a macroscopic datapoint is added to the Organizer's heatmap to manage crowd friction. This data is fully anonymized and cannot be traced back to your individual identity matrix.
          </p>

          <h3 style={{ color: 'var(--text)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>3. Data Security</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            All operations are secured via enterprise-grade encryption. Platform-wide operations are monitored via the Eventra Security Protocol v2.4, ensuring your data remains protected against unauthorized access.
          </p>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
