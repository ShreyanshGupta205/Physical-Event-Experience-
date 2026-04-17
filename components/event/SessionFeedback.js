'use client';
import { useState } from 'react';
import { Star, Send, MessageSquare, Zap, CheckCircle } from 'lucide-react';

export default function SessionFeedback() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setComment('');
    }, 5000);
  };

  if (submitted) {
    return (
      <div className="feedback-submitted glass-card animate-scaleUp">
        <CheckCircle size={40} className="text-secondary" />
        <h3>Feedback Logged</h3>
        <p>Your insight has been synchronized with the speaker's dashboard.</p>
        <div className="sparkle-bonus">+25 <Zap size={10} fill="currentColor" /></div>
      </div>
    );
  }

  return (
    <div className="session-feedback glass-card">
      <div className="feedback-head">
        <MessageSquare size={18} className="text-secondary" />
        <h3>Session Insight</h3>
      </div>
      
      <p className="feedback-label">How valuable is this session so far?</p>
      
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`star-btn ${(hover || rating) >= star ? 'active' : ''}`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            <Star size={24} fill={(hover || rating) >= star ? 'currentColor' : 'none'} />
          </button>
        ))}
      </div>

      <form className="feedback-form" onSubmit={handleSubmit}>
        <textarea 
          placeholder="Optional: What's your key takeaway?" 
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows="2"
        />
        <button type="submit" className="btn btn-primary full-btn" disabled={rating === 0}>
          LOG INSIGHT <Send size={14} />
        </button>
      </form>

      <style jsx>{`
        .session-feedback { padding: 2rem !important; display: flex; flex-direction: column; gap: 1.25rem; }
        .feedback-head { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
        .feedback-head h3 { font-size: 1rem; }
        .feedback-label { font-size: 0.8125rem; color: var(--text-muted); font-weight: 600; }

        .star-rating { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
        .star-btn { background: transparent; border: none; padding: 0; cursor: pointer; color: var(--text-faint); transition: var(--transition); }
        .star-btn.active { color: #fbbf24; }
        .star-btn:hover { transform: scale(1.1); }

        .feedback-form { display: flex; flex-direction: column; gap: 1rem; }
        .feedback-form textarea { 
          background: var(--bg-card2); border: 1px solid var(--border); border-radius: var(--radius-md); 
          padding: 0.75rem; color: var(--text); font-size: 0.8125rem; outline: none; line-height: 1.5;
        }
        .feedback-form textarea:focus { border-color: var(--secondary); }

        .feedback-submitted { 
          padding: 3rem !important; text-align: center; display: flex; flex-direction: column; 
          align-items: center; gap: 1rem; border-color: var(--secondary-glow) !important;
        }
        .feedback-submitted h3 { font-size: 1.25rem; }
        .feedback-submitted p { font-size: 0.875rem; color: var(--text-faint); line-height: 1.6; }
        .sparkle-bonus { font-size: 0.8125rem; font-weight: 800; color: var(--secondary); display: flex; align-items: center; gap: 0.25rem; }
      `}</style>
    </div>
  );
}
