'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PEERS } from '@/data/mockData';
import { 
  Users, Search, Filter, MessageSquare, 
  UserPlus, ExternalLink, Zap, Sparkles,
  ArrowUpRight, Target, Share2
} from 'lucide-react';

export default function NetworkingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sentRequests, setSentRequests] = useState([]);
  const [aiMatches, setAiMatches] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(true);

  const filteredPeers = PEERS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.interests.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch('/api/ai/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId: 'current-user', registeredEvents: ['Future Tech Summit', 'AI Workshop'] })
        });
        if (res.ok) {
          const data = await res.json();
          setAiMatches(data);
        }
      } catch (e) {
        console.error("Match fail:", e);
      } finally {
        setIsAiLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const toggleRequest = (id) => {
    if (sentRequests.includes(id)) {
      setSentRequests(prev => prev.filter(reqId => reqId !== id));
    } else {
      setSentRequests(prev => [...prev, id]);
    }
  };

  return (
    <DashboardLayout>
      <div className="discovery-hub animate-fadeIn">
        
        {/* Header */}
        <header className="discovery-header">
          <div className="discovery-title">
            <div className="discovery-badge">
              <Target size={14} /> SMART MATCHMAKING
            </div>
            <h1 className="Hub-heading">Connect with Peers</h1>
            <p className="HUB-lead">AI-powered discovery based on your skill-profile and interests.</p>
          </div>

          <div className="discovery-controls">
            <div className="search-wrap glass-card">
              <Search size={18} />
              <input 
                placeholder="Search skills, roles, or names..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn btn-ghost btn-icon"><Filter size={18} /></button>
          </div>
        </header>

        {/* AI Recommendations Section */}
        {!isAiLoading && aiMatches.length > 0 && (
          <section className="ai-recommendations animate-fadeIn">
            <div className="section-header">
              <Sparkles size={18} className="text-secondary" />
               <h3>Recommended for You</h3>
            </div>
            <div className="recommendations-grid">
               {aiMatches.map((match, i) => {
                 const peer = PEERS.find(p => p.id === match.peerId);
                 if (!peer) return null;
                 return (
                   <div key={peer.id} className="match-card glass-card animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
                      <div className="match-user">
                         <div className="match-avatar" style={{ background: `linear-gradient(135deg, ${peer.color}, #000)` }}>
                            {peer.avatar}
                         </div>
                         <div className="match-info">
                            <strong>{peer.name}</strong>
                            <span>{peer.role}</span>
                         </div>
                      </div>
                      <div className="match-logic">
                         <Zap size={12} fill="currentColor" />
                         <p>{match.matchReason}</p>
                      </div>
                      <button className="btn btn-secondary btn-sm" onClick={() => toggleRequest(peer.id)}>
                         {sentRequests.includes(peer.id) ? 'Request Sent' : 'Fast Connect'}
                      </button>
                   </div>
                 );
               })}
            </div>
          </section>
        )}

        {/* Categories / Intersts */}
        <div className="interest-chips animate-fadeInUp">
          {['All Peers', 'AI & ML', 'UI/UX Design', 'Cloud Arch', 'Web3', 'Product'].map((cat, i) => (
            <button key={cat} className={`chip ${i === 0 ? 'active' : ''}`}>{cat}</button>
          ))}
        </div>

        {/* Peers Grid */}
        <div className="peers-grid">
          {filteredPeers.map((peer, idx) => (
            <div 
              key={peer.id} 
              className="peer-card glass-card animate-fadeInUp"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="peer-top">
                <div className="peer-avatar-wrap">
                  <div className="peer-avatar" style={{ background: `linear-gradient(135deg, ${peer.color}, #000)` }}>
                    {peer.avatar}
                  </div>
                  <div className="match-badge">
                    <Zap size={10} fill="currentColor" /> {peer.matching}%
                  </div>
                </div>
                
                <div className="peer-meta">
                  <h3>{peer.name}</h3>
                  <p>{peer.role} @ {peer.company}</p>
                </div>
                
                <button className="btn btn-ghost btn-icon m-left-auto"><Share2 size={16} /></button>
              </div>

              <div className="peer-interests">
                {peer.interests.map(int => (
                  <span key={int} className="int-tag">{int}</span>
                ))}
              </div>

              <div className="peer-actions">
                <button 
                  className={`btn ${sentRequests.includes(peer.id) ? 'btn-ghost' : 'btn-primary'} flex-1`}
                  onClick={() => toggleRequest(peer.id)}
                >
                  {sentRequests.includes(peer.id) ? 'Request Sent' : <><UserPlus size={16} /> Connect</>}
                </button>
                <button className="btn btn-ghost btn-icon"><MessageSquare size={16} /></button>
              </div>
            </div>
          ))}
        </div>

        {/* Pulse of the Community */}
        <section className="community-pulse glass-card animate-fadeInUp">
          <div className="pulse-header">
            <div className="pulse-title">
              <Sparkles size={20} className="text-secondary" />
              <h3>Community Pulse</h3>
            </div>
            <span className="live-tag">LIVE FEED</span>
          </div>
          <div className="pulse-grid">
            {[
              { user: 'Ishan S.', action: 'shared a React resource', time: '2m ago' },
              { user: 'Ananya R.', action: 'is looking for a Hackathon team', time: '12m ago' },
              { user: 'Kabir S.', action: 'started a thread on #GenerativeAI', time: '1h ago' },
            ].map((p, i) => (
              <div key={i} className="pulse-item">
                <div className="p-dot" />
                <div className="p-content">
                  <strong>{p.user}</strong> {p.action}
                  <span>{p.time}</span>
                </div>
                <ArrowUpRight size={14} className="p-arrow" />
              </div>
            ))}
          </div>
        </section>
      </div>

      <style jsx>{`
        .discovery-hub { max-width: 1200px; margin: 0 auto; padding: 1rem 0; }
        
        .discovery-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; }
        .discovery-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.3rem 0.8rem; background: var(--secondary-glow); 
          color: var(--secondary); border-radius: 4px; font-size: 0.65rem; font-weight: 800;
          letter-spacing: 0.05em; margin-bottom: 0.75rem;
        }

        .discovery-controls { display: flex; gap: 1rem; }
        .search-wrap { 
          display: flex; align-items: center; gap: 1rem; padding: 0.5rem 1.5rem !important; 
          width: 320px; border-radius: var(--radius-md) !important;
        }
        .search-wrap input { background: transparent; border: none; color: var(--text); outline: none; width: 100%; font-size: 0.875rem; }
        .search-wrap svg { color: var(--text-faint); }

        .interest-chips { display: flex; gap: 0.75rem; margin-bottom: 3rem; overflow-x: auto; padding-bottom: 0.5rem; }
        .chip { 
          padding: 0.5rem 1.25rem; border-radius: var(--radius-full); 
          background: var(--bg-card2); border: 1px solid var(--border);
          color: var(--text-muted); font-size: 0.8125rem; font-weight: 600; 
          transition: var(--transition); cursor: pointer; white-space: nowrap;
        }
        .chip:hover { border-color: var(--secondary); color: var(--text); }
        .chip.active { background: var(--secondary); color: black; border-color: var(--secondary); }

        .ai-recommendations { margin-bottom: 3.5rem; }
        .section-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
        .section-header h3 { font-size: 0.875rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-faint); }
        
        .recommendations-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .match-card { 
          padding: 1.5rem !important; display: flex; flex-direction: column; gap: 1.25rem; 
          border-left: 3px solid var(--secondary); background: linear-gradient(90deg, var(--secondary-glow) 0%, transparent 100%);
        }
        .match-user { display: flex; gap: 1rem; align-items: center; }
        .match-avatar { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 800; color: white; }
        .match-info { display: flex; flex-direction: column; }
        .match-info strong { font-size: 1rem; }
        .match-info span { font-size: 0.7rem; color: var(--text-faint); font-weight: 600; }
        
        .match-logic { display: flex; gap: 0.75rem; background: var(--bg-card2); padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border); }
        .match-logic p { font-size: 0.75rem; color: var(--text-muted); font-style: italic; line-height: 1.4; }
        .match-logic svg { color: var(--secondary); flex-shrink: 0; }

        .peers-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-bottom: 4rem; }
        
        .peer-card { display: flex; flex-direction: column; gap: 1.5rem; padding: 1.5rem !important; transition: var(--transition); }
        .peer-card:hover { transform: translateY(-5px); border-color: var(--secondary-glow); }

        .peer-top { display: flex; align-items: center; gap: 1.25rem; }
        .peer-avatar-wrap { position: relative; }
        .peer-avatar { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 800; color: white; }
        .match-badge { 
          position: absolute; bottom: -8px; right: -8px; 
          background: #000; color: #4ade80; border: 1px solid rgba(74, 222, 128, 0.4);
          font-size: 0.65rem; font-weight: 800; padding: 0.1rem 0.4rem; border-radius: 4px;
          display: flex; align-items: center; gap: 0.2rem;
        }

        .peer-meta h3 { font-size: 1.125rem; margin-bottom: 0.25rem; }
        .peer-meta p { font-size: 0.75rem; color: var(--text-faint); }
        .m-left-auto { margin-left: auto; }

        .peer-interests { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .int-tag { font-size: 0.65rem; font-weight: 700; color: var(--text-faint); background: var(--bg-card2); padding: 0.25rem 0.6rem; border-radius: 4px; border: 1px solid var(--border); }

        .peer-actions { display: flex; gap: 0.75rem; margin-top: auto; }

        .community-pulse { padding: 2rem !important; display: flex; flex-direction: column; gap: 2rem; }
        .pulse-header { display: flex; justify-content: space-between; align-items: center; }
        .pulse-title { display: flex; align-items: center; gap: 0.75rem; }
        .live-tag { font-size: 0.65rem; background: var(--secondary); color: black; padding: 0.1rem 0.5rem; border-radius: 2px; font-weight: 900; }

        .pulse-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .pulse-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--bg-card2); border-radius: var(--radius-md); border: 1px solid var(--border); }
        .p-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--secondary); }
        .p-content { flex: 1; font-size: 0.8125rem; }
        .p-content strong { color: var(--text); }
        .p-content span { display: block; font-size: 0.65rem; color: var(--text-faint); margin-top: 0.2rem; }
        .p-arrow { color: var(--text-faint); }

        @media (max-width: 1024px) {
          .peers-grid { grid-template-columns: repeat(2, 1fr); }
          .pulse-grid { grid-template-columns: 1fr; gap: 1rem; }
        }

        @media (max-width: 640px) {
          .peers-grid { grid-template-columns: 1fr; }
          .discovery-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
          .discovery-controls { width: 100%; }
          .search-wrap { width: 100%; }
        }
      `}</style>
    </DashboardLayout>
  );
}
