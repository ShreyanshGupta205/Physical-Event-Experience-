'use client';
import { MoreHorizontal } from 'lucide-react';

export default function ZoneMatrix({ zones }) {
  return (
    <>
      <section className="zone-matrix glass-card animate-fadeIn">
        <div className="card-header">
          <div className="title-group">
            <h3>Venue Saturation Matrix</h3>
            <p>Real-time occupancy density across synchronized sectors.</p>
          </div>
          <div className="matrix-legend">
            <span className="dot safe">Safe</span>
            <span className="dot busy">Busy</span>
            <span className="dot critical">Critical</span>
          </div>
        </div>

        <div className="matrix-grid">
          {zones.map((zone, i) => {
            const occ = Math.round(zone.occupancy * 100);
            const status = occ > 85 ? 'critical' : occ > 65 ? 'busy' : 'safe';
            
            return (
              <div key={zone.id} className={`zone-tile ${status} animate-fadeInUp`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="zone-progress" style={{ height: `${occ}%` }} />
                <div className="zone-meta">
                  <span className="z-name">{zone.name}</span>
                  <div className="z-stats">
                    <h4 className="z-occ">{occ}%</h4>
                    <span className="z-cap">{zone.capacity - Math.round(zone.capacity * (occ/100))} left</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <style jsx>{`
        .zone-matrix { padding: 2rem !important; margin-bottom: 3rem; }
        .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
        .title-group h3 { font-size: 1rem; font-weight: 800; margin-bottom: 0.25rem; }
        .title-group p { font-size: 0.75rem; color: var(--text-faint); }
        
        .matrix-legend { display: flex; gap: 1rem; }
        .dot { display: flex; align-items: center; gap: 0.4rem; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; }
        .dot::before { content: ''; width: 8px; height: 8px; border-radius: 50%; }
        .dot.safe::before { background: var(--secondary); box-shadow: 0 0 10px var(--secondary); }
        .dot.busy::before { background: #fbbf24; box-shadow: 0 0 10px #fbbf24; }
        .dot.critical::before { background: var(--accent); box-shadow: 0 0 10px var(--accent); }

        .matrix-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        
        .zone-tile { 
          position: relative; height: 140px; background: var(--bg-card2); 
          border: 1px solid var(--border); border-radius: var(--radius-md); 
          overflow: hidden; display: flex; align-items: flex-end;
          transition: var(--transition);
        }
        .zone-tile:hover { border-color: var(--text-faint); transform: translateY(-2px); }
        
        .zone-progress { 
          position: absolute; width: 100%; bottom: 0; left: 0; 
          opacity: 0.15; transition: height 1s cubic-bezier(0.4, 0, 0.2, 1); 
        }
        .safe .zone-progress { background: var(--secondary); }
        .busy .zone-progress { background: #fbbf24; }
        .critical .zone-progress { background: var(--accent); }
        .critical { border-color: var(--accent-glow); }

        .zone-meta { position: relative; z-index: 2; padding: 1.25rem; width: 100%; }
        .z-name { font-size: 0.75rem; font-weight: 800; color: var(--text-faint); display: block; margin-bottom: 0.5rem; }
        .z-stats { display: flex; justify-content: space-between; align-items: flex-end; }
        .z-occ { font-size: 1.75rem; font-weight: 800; font-family: 'Space Grotesk', sans-serif; line-height: 1; }
        .z-cap { font-size: 0.6rem; font-weight: 900; color: var(--text-faint); text-transform: uppercase; }

        @media (max-width: 1024px) {
          .matrix-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .matrix-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
