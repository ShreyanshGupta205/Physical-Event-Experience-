'use client';
import { LandingNavbar, LandingFooter } from '@/components/landing/LandingLayout';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="landing-bg">
      <LandingNavbar />
      <main style={{ paddingTop: '150px', minHeight: '80vh', maxWidth: 900, margin: '0 auto', padding: '150px 2rem 100px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Get in Touch</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '4rem' }}>
          Interested in transitioning your venue to the smart era? Our enterprise experts are ready to assist you.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {[
            { icon: Mail, title: "Email Support", desc: "enterprise@eventra.ai" },
            { icon: Phone, title: "Direct Line", desc: "+1 (800) 555-0199" },
            { icon: MapPin, title: "Headquarters", desc: "Silicon Valley, CA" }
          ].map((c, i) => (
            <div key={i} className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <c.icon size={32} style={{ margin: '0 auto 1.5rem', color: 'var(--primary)' }} />
              <h4 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{c.title}</h4>
              <p style={{ color: 'var(--text-muted)' }}>{c.desc}</p>
            </div>
          ))}
        </div>

        <div className="glass-card" style={{ padding: '3rem' }}>
          <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Send a Message</h3>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={e => { e.preventDefault(); alert('Message sent!'); }}>
             <div className="input-group">
                <input className="input" placeholder="Your Name" required />
             </div>
             <div className="input-group">
                <input type="email" className="input" placeholder="Company Email" required />
             </div>
             <div className="input-group">
                <textarea className="input" placeholder="How can we help?" rows="4" required style={{ fontFamily: 'inherit', resize: 'vertical' }} />
             </div>
             <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Submit Inquiry</button>
          </form>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
