'use client';
import { MoreHorizontal } from 'lucide-react';

export default function ZoneMatrix({ zones }) {
  return (
    <>
      <section className="glass-card zone-matrix animate-fadeInUp">
        <div className="card-header">
          <h3 className="section-title small">Zone Saturation Matrix</h3>
          <div className="matrix-matrix-controls">
            <button className="btn btn-ghost btn-sm">Audit Zones</button>
          </div>
        </div>
        <div className="matrix-grid">
          {zones.map(zone => (
            <div key={zone.id} className="matrix-item glass-card">
              <div className="m-header">
                <div className="z-tag" style={{ background: zone.color + '22', color: zone.color }}>{zone.name}</div>
                <MoreHorizontal size={16} />
              </div>
              <div className="m-body">
                <div className="m-val">{Math.round(zone.occupancy * 100)}%</div>
                <div className="progress-bar mini">
                  <div className="progress-fill" style={{ width: `${zone.occupancy * 100}%`, background: zone.color }} />
                </div>
              </div>
              <div className="m-footer">
                <span>CAPACITY: {zone.capacity}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <style jsx>{`
        .zone-matrix { padding: 2rem !important; margin-bottom: 3rem; }
        .matrix-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-top: 2rem; }
        .matrix-item { padding: 1.25rem !important; display: flex; flex-direction: column; gap: 1rem; }
        .m-header { display: flex; justify-content: space-between; align-items: center; }
        .z-tag { font-size: 0.65rem; font-weight: 900; padding: 0.1rem 0.6rem; border-radius: 4px; }
        .m-val { font-size: 1.5rem; font-weight: 700; font-family: 'Space Grotesk', sans-serif; }
        .m-footer { font-size: 0.65rem; color: var(--text-faint); letter-spacing: 0.05em; font-weight: 800; }
        .card-header { display: flex; justify-content: space-between; align-items: center; }
        .section-title.small { font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-faint); margin-bottom: 0; }
        
        @media (max-width: 1024px) {
          .matrix-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </>
  );
}
