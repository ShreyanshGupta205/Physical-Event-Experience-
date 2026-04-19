'use client';
import { useState, useEffect } from 'react';
import { BrainCircuit, Loader2, AlertCircle, ShieldAlert } from 'lucide-react';

export default function AiInsights({ eventId }) {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    const fetchInsight = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/ai/predict?eventId=${eventId}`);
        if (res.ok) {
          const data = await res.json();
          setInsight(data.suggestion);
        }
      } catch (error) {
        console.error('Failed to fetch AI insight:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
    const interval = setInterval(fetchInsight, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [eventId]);

  return (
    <div className={`ai-insight-card glass-card ${loading ? 'syncing' : ''}`}>
      <div className="card-header">
        <div className="ai-label">
          <BrainCircuit size={16} className="text-secondary" />
          <span>TACTICAL INTELLIGENCE</span>
        </div>
        {!loading && <div className="status-dot animate-pulse" />}
      </div>

      <div className="insight-body">
        {loading ? (
          <div className="insight-loading">
            <Loader2 className="animate-spin" size={18} />
            <span>Analyzing Telemetry...</span>
          </div>
        ) : (
          <>
            <p className="insight-text">{insight}</p>
            <div className="tactical-actions">
              <button className="btn btn-ghost btn-xs"><ShieldAlert size={12} /> Divert Flow</button>
              <button className="btn btn-ghost btn-xs"><AlertCircle size={12} /> Alert Staff</button>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .ai-insight-card { 
          padding: 1.5rem !important; 
          border-left: 3px solid var(--secondary);
          transition: var(--transition);
        }
        .ai-insight-card.syncing { opacity: 0.7; }
        
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .ai-label { display: flex; align-items: center; gap: 0.6rem; }
        .ai-label span { font-size: 0.7rem; font-weight: 900; letter-spacing: 0.1em; color: var(--secondary); }
        .status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--secondary); box-shadow: 0 0 10px var(--secondary); }

        .insight-body { min-height: 80px; display: flex; flex-direction: column; justify-content: center; }
        .insight-text { font-size: 0.875rem; line-height: 1.6; color: var(--text); font-style: italic; }
        
        .insight-loading { display: flex; align-items: center; gap: 0.75rem; color: var(--text-faint); font-size: 0.8rem; }
        
        .tactical-actions { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
        
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
