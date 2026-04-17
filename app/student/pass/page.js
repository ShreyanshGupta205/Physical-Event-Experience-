'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { QrCode, Download, Share2, CheckCircle, Clock, Calendar, MapPin, ChevronLeft, ChevronRight, Zap, ShieldCheck, Info, Globe } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function EntryPassPage() {
  const { registrations, user } = useApp();
  const [activeIdx, setActiveIdx] = useState(0);

  const confirmedRegs = registrations.filter(r => r.status === 'confirmed');

  if (confirmedRegs.length === 0) {
    return (
      <DashboardLayout>
        <div className="empty-passes animate-fadeIn">
          <div className="empty-icon-wrap">
            <QrCode size={48} className="text-secondary" />
          </div>
          <h2>Registry Vacant</h2>
          <p>You haven't authorized any entry credentials yet.</p>
          <a href="/" className="btn btn-primary">RETRIEVE MISSIONS</a>
        </div>
        <style jsx>{`
          .empty-passes { height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.5rem; text-align: center; }
          .empty-icon-wrap { width: 100px; height: 100px; border-radius: 30px; background: var(--bg-card2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
          .empty-passes h2 { font-size: 2rem; }
          .empty-passes p { color: var(--text-faint); }
        `}</style>
      </DashboardLayout>
    );
  }

  const active = confirmedRegs[activeIdx];

  return (
    <DashboardLayout>
      <div className="credential-hub animate-fadeIn">
        
        {/* Hub Header */}
        <header className="hub-header">
          <div className="hub-title">
            <div className="hub-badge">
               <ShieldCheck size={14} /> AUTHORIZED CRYPTO-PASS
            </div>
            <h1 className="Hub-heading">Entry Credentials</h1>
            <p className="HUB-lead">Synchronized digital access tokens for physical entry protocols.</p>
          </div>

          <div className="hub-pagination">
             <button 
               className="page-btn" 
               onClick={() => setActiveIdx(i => Math.max(0, i - 1))}
               disabled={activeIdx === 0}
             >
               <ChevronLeft size={20} />
             </button>
             <div className="page-dots">
               {confirmedRegs.map((_, i) => (
                 <div key={i} className={`dot ${i === activeIdx ? 'active' : ''}`} style={{ '--color': active.color }} />
               ))}
             </div>
             <button 
               className="page-btn"
               onClick={() => setActiveIdx(i => Math.min(confirmedRegs.length - 1, i + 1))}
               disabled={activeIdx === confirmedRegs.length - 1}
             >
               <ChevronRight size={20} />
             </button>
          </div>
        </header>

        <div className="hub-grid">
          {/* Futuristic Passport */}
          <section className="passport-container animate-scaleUp">
            <div className="digital-passport glass-card" style={{ '--accent': active.color }}>
              <div className="passport-head">
                 <div className="p-brand">
                    <Zap size={18} />
                    <span>EVENTSPHERE</span>
                 </div>
                 <div className="p-tier">{active.type.toUpperCase()} ACCESS</div>
              </div>

              <div className="passport-body">
                <h2 className="p-event-title">{active.eventTitle}</h2>
                
                <div className="p-telem-grid">
                  <div className="p-telem">
                    <label>COORDINATES</label>
                    <span>{active.venue}</span>
                  </div>
                  <div className="p-telem">
                    <label>TIMESTAMP</label>
                    <span>{new Date(active.date).toLocaleDateString()} • {active.time || '09:00 AM'}</span>
                  </div>
                  <div className="p-telem">
                    <label>PASSENGER</label>
                    <span>{user.name.toUpperCase()}</span>
                  </div>
                  <div className="p-telem">
                    <label>TOKEN ID</label>
                    <span className="text-secondary">{active.passId}</span>
                  </div>
                </div>

                {/* Cyberpunk Divider */}
                <div className="cyber-divider">
                  <div className="c-punch l" /><div className="c-line" /><div className="c-punch r" />
                </div>

                <div className="p-qr-bay">
                   <div className="qr-optics" style={{ background: active.color + '11', borderColor: active.color + '33' }}>
                      <QRCodeSVG
                        value={active.qrCode}
                        size={180}
                        fgColor={active.color}
                        bgColor="transparent"
                        level="H"
                      />
                   </div>
                   <p className="qr-memo">SCAN TO AUTHORIZE ENTRY</p>
                   <div className="qr-teletype">{active.qrCode.slice(0, 16)}...</div>
                </div>

                <div className="p-status-strip">
                   <div className="status-item active">
                      <div className="s-dot" /> 
                      VALID CREDENTIAL
                   </div>
                   <div className="s-icon"><Globe size={14} /></div>
                </div>
              </div>
            </div>
          </section>

          {/* Practical Operations */}
          <aside className="ops-aside">
             <div className="glass-card section-card animate-fadeInUp">
                <h3 className="section-title small">Protocol Instructions</h3>
                <div className="ops-timeline">
                  {[
                    { lab: 'PHASE 01', txt: 'Arrive at designated coordinates 15m early.', icon: Clock },
                    { lab: 'PHASE 02', txt: 'Present digital optic-pass at gate scanner.', icon: QrCode },
                    { lab: 'PHASE 03', txt: 'Verified unit will grant secure physical access.', icon: ShieldCheck },
                  ].map((op, i) => (
                    <div key={i} className="op-row">
                      <div className="op-icon"><op.icon size={16} /></div>
                      <div className="op-txt">
                        <label>{op.lab}</label>
                        <p>{op.txt}</p>
                      </div>
                    </div>
                  ))}
                </div>
             </div>

             <div className="glass-card section-card animate-fadeInUp">
                <h3 className="section-title small">Vault Archive</h3>
                <div className="vault-stack">
                  {confirmedRegs.map((r, i) => (
                    <button key={r.id} onClick={() => setActiveIdx(i)} className={`vault-item ${i === activeIdx ? 'active' : ''}`}>
                      <div className="v-dot" style={{ background: r.color }} />
                      <div className="v-info">
                        <strong>{r.eventTitle}</strong>
                        <span>ID: {r.passId}</span>
                      </div>
                      <CheckCircle size={14} className="v-check" />
                    </button>
                  ))}
                </div>
             </div>

             <div className="ops-actions">
                <button className="btn btn-ghost full-btn"><Download size={16} /> EXPORT TO PDF</button>
                <button className="btn btn-ghost full-btn"><Share2 size={16} /> BROADCAST ACCESS</button>
             </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        .credential-hub { max-width: 1200px; margin: 0 auto; padding: 1rem 0; }
        
        .hub-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3.5rem; }
        .hub-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.3rem 0.8rem; background: var(--secondary-glow); 
          color: var(--secondary); border-radius: 4px; font-size: 0.65rem; font-weight: 800;
          letter-spacing: 0.05em; margin-bottom: 0.75rem;
        }

        .hub-pagination { display: flex; align-items: center; gap: 1.5rem; }
        .page-btn { background: var(--bg-card2); border: 1px solid var(--border); color: var(--text); width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition); }
        .page-btn:hover:not(:disabled) { border-color: var(--secondary); background: var(--secondary-glow); }
        .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .page-dots { display: flex; gap: 0.6rem; }
        .page-dots .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border); transition: var(--transition); }
        .page-dots .dot.active { width: 20px; border-radius: 4px; background: var(--color); box-shadow: 0 0 10px var(--color); }

        .hub-grid { display: grid; grid-template-columns: 1fr 380px; gap: 3rem; }

        .passport-container { perspective: 1000px; }
        .digital-passport { 
          position: relative; padding: 0 !important; border-radius: 30px !important; overflow: hidden;
          background: linear-gradient(180deg, var(--bg-card) 0%, #0a0a0f 100%) !important;
          border: 1px solid var(--accent) !important; box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px var(--accent)22 !important;
        }
        
        .passport-head { 
          display: flex; justify-content: space-between; align-items: center; 
          padding: 1.5rem 2rem; background: linear-gradient(90deg, var(--accent) 0%, var(--accent)88 100%);
          color: black;
        }
        .p-brand { display: flex; align-items: center; gap: 0.6rem; font-family: 'Space Grotesk', sans-serif; font-weight: 900; font-size: 0.875rem; }
        .p-tier { font-size: 0.65rem; font-weight: 900; background: rgba(0,0,0,0.1); padding: 0.2rem 0.6rem; border-radius: 4px; }

        .passport-body { padding: 2.5rem; position: relative; }
        .p-event-title { font-size: 2rem; font-family: 'Space Grotesk', sans-serif; font-weight: 800; margin-bottom: 2.5rem; line-height: 1.1; }
        
        .p-telem-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; margin-bottom: 2.5rem; }
        .p-telem label { display: block; font-size: 0.6rem; font-weight: 800; color: var(--text-faint); margin-bottom: 0.4rem; letter-spacing: 0.1em; }
        .p-telem span { font-size: 0.875rem; font-weight: 700; color: var(--text); }

        .cyber-divider { position: relative; height: 40px; margin: 2rem -2.5rem; display: flex; align-items: center; }
        .c-punch { width: 30px; height: 30px; background: var(--bg); border-radius: 50%; border: 1px solid var(--accent); position: absolute; z-index: 1; }
        .c-punch.l { left: -15px; }
        .c-punch.r { right: -15px; }
        .c-line { flex: 1; height: 2px; border-top: 2px dashed var(--accent)44; }

        .p-qr-bay { display: flex; flex-direction: column; align-items: center; gap: 1.25rem; padding: 1rem 0; }
        .qr-optics { 
          padding: 1.5rem; border: 1px solid; border-radius: 24px; 
          background: rgba(255,255,255,0.02); display: flex; align-items: center; justify-content: center;
        }
        .qr-memo { font-size: 0.7rem; font-weight: 800; color: var(--text-faint); letter-spacing: 0.2em; }
        .qr-teletype { font-size: 0.65rem; color: var(--text-faint); font-family: monospace; background: var(--bg-card2); padding: 0.3rem 0.8rem; border-radius: 6px; }

        .p-status-strip { display: flex; justify-content: space-between; align-items: center; margin-top: 3rem; border-top: 1px solid var(--border); pt: 1.5rem; }
        .status-item { display: flex; align-items: center; gap: 0.6rem; font-size: 0.7rem; font-weight: 800; color: #4ade80; }
        .s-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 10px #4ade80; }
        .s-icon { opacity: 0.3; }

        .ops-aside { display: flex; flex-direction: column; gap: 2rem; }
        .section-card { padding: 2rem !important; }
        
        .ops-timeline { display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1.5rem; }
        .op-row { display: flex; gap: 1.25rem; }
        .op-icon { width: 36px; height: 36px; border-radius: 10px; background: var(--bg-card2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--secondary); flex-shrink: 0; }
        .op-txt label { font-size: 0.65rem; font-weight: 900; color: var(--text-faint); display: block; margin-bottom: 0.25rem; }
        .op-txt p { font-size: 0.8125rem; color: var(--text-muted); line-height: 1.5; }

        .vault-stack { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.5rem; }
        .vault-item { 
          display: flex; align-items: center; gap: 1rem; padding: 0.75rem; 
          background: var(--bg-card2); border: 1px solid var(--border); border-radius: 12px;
          cursor: pointer; transition: var(--transition); text-align: left;
        }
        .vault-item.active { border-color: var(--secondary); background: var(--secondary-glow); }
        .v-dot { width: 8px; height: 8px; border-radius: 50%; }
        .v-info { flex: 1; display: flex; flex-direction: column; }
        .v-info strong { font-size: 0.8125rem; }
        .v-info span { font-size: 0.65rem; color: var(--text-faint); }
        .v-check { color: #4ade80; opacity: 0; transition: var(--transition); }
        .vault-item.active .v-check { opacity: 1; }

        .ops-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        @media (max-width: 1024px) {
          .hub-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </DashboardLayout>
  );
}
  );
}
