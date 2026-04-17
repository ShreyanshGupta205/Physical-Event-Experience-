'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ACHIEVEMENTS } from '@/data/mockData';
import { 
  Trophy, Star, Zap, Lock, Filter, 
  ChevronRight, Award, Flame, Target,
  TrendingUp, Activity, BarChart3
} from 'lucide-react';

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredAchievements = ACHIEVEMENTS.filter(a => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unlocked') return !a.locked;
    if (activeTab === 'locked') return a.locked;
    return true;
  });

  const totalPoints = ACHIEVEMENTS.filter(a => !a.locked).reduce((s, a) => s + a.points, 0);

  return (
    <DashboardLayout>
      <div className="gamification-hub animate-fadeIn">
        
        {/* Header Stats */}
        <header className="gamification-header">
          <div className="header-intel">
            <div className="discovery-badge">
              <Award size={14} /> LEVEL 12 EXPLORER
            </div>
            <h1 className="Hub-heading">Your Achievements</h1>
            <p className="HUB-lead">Unlock badges and earn Sparkle points by engaging with the event ecosystem.</p>
          </div>

          <div className="global-stats glass-card">
            <div className="g-stat">
              <Zap size={24} className="text-secondary" />
              <div className="g-stat-body">
                <span>TOTAL SPARKLES</span>
                <strong>{totalPoints.toLocaleString()}</strong>
              </div>
            </div>
            <div className="g-stat-divider" />
            <div className="g-stat">
              <Trophy size={24} style={{ color: '#fbbf24' }} />
              <div className="g-stat-body">
                <span>BADGES EARNED</span>
                <strong>{ACHIEVEMENTS.filter(a => !a.locked).length}/{ACHIEVEMENTS.length}</strong>
              </div>
            </div>
          </div>
        </header>

        {/* Progress Overview */}
        <section className="progress-section glass-card animate-fadeInUp">
          <div className="progress-header">
            <h3>Seasonal Progress</h3>
            <span className="p-rank">Rank: Top 12%</span>
          </div>
          <div className="progress-track">
            <div className="track-fill" style={{ width: '65%' }}>
              <div className="track-glow" />
            </div>
          </div>
          <div className="progress-labels">
             <span>Novice</span>
             <span className="text-secondary">Pathfinder</span>
             <span>Elite</span>
          </div>
        </section>

        {/* Filters */}
        <div className="achievement-filters animate-fadeInUp">
          {['all', 'unlocked', 'locked'].map(tab => (
            <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Achievement Grid */}
        <div className="achievement-grid">
          {filteredAchievements.map((ach, idx) => (
            <div 
              key={ach.id} 
              className={`achievement-card glass-card ${ach.locked ? 'locked' : ''} animate-fadeInUp`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="ach-icon-wrap">
                <span className="ach-emoji">{ach.icon}</span>
                {ach.locked && <Lock size={16} className="lock-icon" />}
              </div>
              
              <div className="ach-body">
                <div className="ach-header">
                  <h3>{ach.title}</h3>
                  <span className="points">+{ach.points} <Zap size={10} fill="currentColor" /></span>
                </div>
                <p>{ach.desc}</p>
                {ach.date && <span className="ach-date">Earned on {new Date(ach.date).toLocaleDateString()}</span>}
              </div>

              {!ach.locked && <div className="unlocked-glow" />}
            </div>
          ))}
        </div>

        {/* Leaderboard Teaser */}
        <section className="leaderboard-teaser glass-card animate-fadeInUp">
           <div className="teaser-head">
              <BarChart3 size={20} className="text-accent" />
              <h3>Global Leaderboard</h3>
              <button className="btn btn-ghost btn-sm">Full Rankings <ChevronRight size={14} /></button>
           </div>
           <div className="leader-list">
             {[
               { id: 1, name: 'Aniketh P.', points: 14200, rank: 1, avatar: 'AP' },
               { id: 2, name: 'Suhail M.', points: 12850, rank: 2, avatar: 'SM' },
               { id: 3, name: 'Ishita K.', points: 12100, rank: 3, avatar: 'IK' },
             ].map(leader => (
               <div key={leader.id} className="leader-row">
                 <span className="rank-num">#{leader.rank}</span>
                 <div className="leader-avatar">{leader.avatar}</div>
                 <span className="leader-name">{leader.name}</span>
                 <span className="leader-points">{leader.points.toLocaleString()}</span>
               </div>
             ))}
           </div>
        </section>
      </div>

      <style jsx>{`
        .gamification-hub { max-width: 1200px; margin: 0 auto; padding: 1rem 0; }
        
        .gamification-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; }
        .discovery-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.3rem 0.8rem; background: var(--secondary-glow); 
          color: var(--secondary); border-radius: 4px; font-size: 0.65rem; font-weight: 800;
          letter-spacing: 0.05em; margin-bottom: 0.75rem;
        }

        .global-stats { 
          display: flex; align-items: center; gap: 2rem; padding: 1.5rem 2.5rem !important; 
          border-radius: var(--radius-lg) !important;
        }
        .g-stat { display: flex; align-items: center; gap: 1.25rem; }
        .g-stat-body { display: flex; flex-direction: column; gap: 0.25rem; }
        .g-stat-body span { font-size: 0.65rem; font-weight: 800; color: var(--text-faint); }
        .g-stat-body strong { font-size: 1.5rem; font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: var(--text); }
        .g-stat-divider { width: 1px; height: 40px; background: var(--border); }

        .progress-section { padding: 2rem !important; margin-bottom: 3rem; }
        .progress-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .p-rank { font-size: 0.75rem; font-weight: 800; color: var(--secondary); background: var(--secondary-glow); padding: 0.25rem 0.75rem; border-radius: var(--radius-sm); }
        
        .progress-track { width: 100%; height: 12px; background: var(--bg-card2); border-radius: 6px; overflow: hidden; margin-bottom: 1rem; position: relative; }
        .track-fill { height: 100%; background: linear-gradient(90deg, var(--primary), var(--secondary)); position: relative; border-radius: 6px; }
        .track-glow { position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); animation: sweep 2s infinite; }
        @keyframes sweep { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

        .progress-labels { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 800; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.05em; }

        .achievement-filters { display: flex; gap: 1rem; margin-bottom: 2rem; }
        .tab-btn { 
          background: transparent; border: none; color: var(--text-faint); 
          font-size: 0.75rem; font-weight: 800; letter-spacing: 0.1em; 
          padding: 0.5rem 1rem; cursor: pointer; border-bottom: 2px solid transparent;
          transition: var(--transition);
        }
        .tab-btn:hover { color: var(--text); }
        .tab-btn.active { color: var(--secondary); border-bottom-color: var(--secondary); }

        .achievement-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 4rem; }
        
        .achievement-card { 
          display: flex; gap: 1.5rem; padding: 2rem !important; 
          position: relative; overflow: hidden; transition: var(--transition);
        }
        .achievement-card:not(.locked):hover { border-color: var(--secondary-glow); transform: translateY(-3px); }
        .achievement-card.locked { opacity: 0.5; filter: grayscale(0.8); }

        .ach-icon-wrap { 
          width: 72px; height: 72px; border-radius: 20px; 
          background: var(--bg-card2); border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          position: relative; flex-shrink: 0;
        }
        .ach-emoji { font-size: 2.5rem; }
        .lock-icon { position: absolute; bottom: -4px; right: -4px; background: var(--bg-card); padding: 4px; border-radius: 50%; color: var(--text-faint); }

        .ach-body { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
        .ach-header { display: flex; justify-content: space-between; align-items: center; }
        .ach-header h3 { font-size: 1.25rem; font-weight: 700; color: var(--text); }
        .points { font-size: 0.8125rem; font-weight: 800; color: var(--secondary); display: flex; align-items: center; gap: 0.25rem; }
        .ach-body p { font-size: 0.875rem; color: var(--text-muted); line-height: 1.5; }
        .ach-date { font-size: 0.7rem; color: var(--text-faint); margin-top: auto; }

        .unlocked-glow { 
          position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; 
          background: radial-gradient(circle, var(--secondary) 0%, transparent 70%); 
          opacity: 0.03; pointer-events: none;
        }

        .leaderboard-teaser { padding: 2rem !important; display: flex; flex-direction: column; gap: 2rem; background: linear-gradient(135deg, rgba(255, 71, 87, 0.05), transparent) !important; }
        .teaser-head { display: flex; align-items: center; gap: 1rem; }
        .teaser-head h3 { flex: 1; font-size: 1.125rem; }

        .leader-list { display: flex; flex-direction: column; gap: 1rem; }
        .leader-row { 
          display: flex; align-items: center; gap: 1.5rem; padding: 1rem 1.5rem; 
          background: var(--bg-card2); border: 1px solid var(--border); border-radius: var(--radius-md);
        }
        .rank-num { font-size: 0.875rem; font-weight: 900; color: var(--text-faint); width: 30px; }
        .leader-avatar { width: 36px; height: 36px; border-radius: 10px; background: var(--bg-glass); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 0.875rem; font-weight: 800; color: var(--accent); }
        .leader-name { flex: 1; font-weight: 600; font-size: 0.9375rem; }
        .leader-points { font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: var(--accent); }

        @media (max-width: 1024px) {
          .achievement-grid { grid-template-columns: 1fr; }
          .gamification-header { flex-direction: column; align-items: flex-start; gap: 2rem; }
          .global-stats { width: 100%; justify-content: center; }
        }
      `}</style>
    </DashboardLayout>
  );
}
