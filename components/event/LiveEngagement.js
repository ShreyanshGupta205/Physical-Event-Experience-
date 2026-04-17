'use client';
import { useState, useEffect } from 'react';
import { MessageCircle, ThumbsUp, Send, BarChart3, Radio, User, Sparkles, Zap, CheckCircle2 } from 'lucide-react';

export default function LiveEngagement() {
  const [activeTab, setActiveTab] = useState('polls');
  const [questions, setQuestions] = useState([
    { id: 1, text: "Will there be a recording for the Generative AI session?", user: "Aryan K.", votes: 12, status: 'answered' },
    { id: 2, text: "Is the mentorship hub open during lunch?", user: "Sanya G.", votes: 8, status: 'live' },
  ]);
  const [newQuestion, setNewQuestion] = useState('');
  const [poll, setPoll] = useState({
    question: "Which technology are you most excited to explore?",
    options: [
      { id: 'a', label: 'Large Language Models', votes: 145 },
      { id: 'b', label: 'AI Agents & Autonomy', votes: 89 },
      { id: 'c', label: 'Computer Vision', votes: 42 },
    ],
    voted: null
  });

  const handleVote = (id) => {
    if (poll.voted) return;
    setPoll(prev => ({
      ...prev,
      voted: id,
      options: prev.options.map(opt => opt.id === id ? { ...opt, votes: opt.votes + 1 } : opt)
    }));
  };

  const handleAsk = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setQuestions(prev => [
      { id: Date.now(), text: newQuestion, user: "You", votes: 0, status: 'pending' },
      ...prev
    ]);
    setNewQuestion('');
  };

  const totalVotes = poll.options.reduce((s, o) => s + o.votes, 0);

  return (
    <div className="live-engagement glass-card">
      <div className="engagement-header">
        <div className="live-pulse">
          <div className="dot" />
          <span>LIVE ENGAGEMENT</span>
        </div>
        <div className="tab-switcher">
          <button className={activeTab === 'polls' ? 'active' : ''} onClick={() => setActiveTab('polls')}>POLLS</button>
          <button className={activeTab === 'qa' ? 'active' : ''} onClick={() => setActiveTab('qa')}>Q&A</button>
        </div>
      </div>

      <div className="engagement-content">
        {activeTab === 'polls' ? (
          <div className="polls-view animate-fadeIn">
            <h4 className="poll-question">{poll.question}</h4>
            <div className="poll-options">
              {poll.options.map(opt => {
                const percent = Math.round((opt.votes / totalVotes) * 100);
                return (
                  <button 
                    key={opt.id} 
                    className={`poll-option ${poll.voted === opt.id ? 'voted' : ''}`}
                    onClick={() => handleVote(opt.id)}
                    disabled={poll.voted !== null}
                  >
                    <div className="option-bg" style={{ width: `${percent}%` }} />
                    <div className="option-info">
                      <span className="label">{opt.label}</span>
                      <span className="percent">{percent}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
            {poll.voted && <div className="voted-msg"><CheckCircle2 size={14} /> Interaction Logged. +10 <Zap size={10} fill="currentColor" /></div>}
          </div>
        ) : (
          <div className="qa-view animate-fadeIn">
            <form className="qa-input" onSubmit={handleAsk}>
              <input 
                placeholder="Ask a question anonymously..." 
                value={newQuestion}
                onChange={e => setNewQuestion(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-icon"><Send size={16} /></button>
            </form>

            <div className="questions-list">
              {questions.map((q, idx) => (
                <div key={q.id} className="qa-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="qa-card-top">
                    <User size={14} className="text-secondary" />
                    <strong>{q.user}</strong>
                    <span className={`status-tag ${q.status}`}>{q.status.toUpperCase()}</span>
                  </div>
                  <p className="qa-text">{q.text}</p>
                  <div className="qa-footer">
                    <button className="vote-btn">
                      <ThumbsUp size={14} /> {q.votes}
                    </button>
                    <button className="btn-text">Reply</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .live-engagement { padding: 0 !important; overflow: hidden; display: flex; flex-direction: column; height: 500px; }
        
        .engagement-header { 
          padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); 
          display: flex; justify-content: space-between; align-items: center;
          background: var(--bg-glass);
        }
        .live-pulse { display: flex; align-items: center; gap: 0.6rem; font-size: 0.65rem; font-weight: 800; color: var(--accent); }
        .live-pulse .dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; box-shadow: 0 0 10px var(--accent); animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

        .tab-switcher { display: flex; gap: 0.5rem; background: var(--bg-card2); padding: 0.2rem; border-radius: var(--radius-sm); }
        .tab-switcher button { 
          padding: 0.3rem 0.8rem; border: none; background: transparent; 
          color: var(--text-faint); font-size: 0.7rem; font-weight: 800; border-radius: 4px; 
          cursor: pointer; transition: var(--transition);
        }
        .tab-switcher button.active { background: var(--bg-card); color: var(--text); }

        .engagement-content { flex: 1; overflow-y: auto; padding: 1.5rem; }

        /* Polls */
        .poll-question { font-size: 1rem; margin-bottom: 1.5rem; line-height: 1.4; color: var(--text); }
        .poll-options { display: flex; flex-direction: column; gap: 0.75rem; }
        .poll-option { 
          position: relative; padding: 1rem; border: 1px solid var(--border); 
          background: var(--bg-card2); border-radius: var(--radius-md); text-align: left;
          cursor: pointer; overflow: hidden; transition: var(--transition);
        }
        .poll-option:hover:not(:disabled) { border-color: var(--secondary); background: var(--bg-glass); }
        .poll-option.voted { border-color: var(--secondary); }
        .option-bg { position: absolute; left: 0; top: 0; bottom: 0; background: var(--secondary-glow); transition: width 1s cubic-bezier(0.175, 0.885, 0.32, 1.275); z-index: 1; }
        .option-info { position: relative; z-index: 2; display: flex; justify-content: space-between; font-weight: 700; font-size: 0.875rem; }
        .voted-msg { margin-top: 1.5rem; font-size: 0.75rem; font-weight: 800; color: var(--secondary); display: flex; align-items: center; gap: 0.4rem; justify-content: center; }

        /* QA */
        .qa-input { display: flex; gap: 0.75rem; margin-bottom: 2rem; position: sticky; top: 0; background: var(--bg-card); z-index: 10; padding-bottom: 1rem; }
        .qa-input input { 
          flex: 1; background: var(--bg-card2); border: 1px solid var(--border); 
          padding: 0.75rem 1rem; border-radius: var(--radius-md); color: var(--text);
          font-size: 0.875rem; outline: none;
        }
        .qa-input input:focus { border-color: var(--primary); }
        
        .questions-list { display: flex; flex-direction: column; gap: 1.25rem; }
        .qa-card { padding: 1.25rem; background: var(--bg-card2); border-radius: var(--radius-md); border: 1px solid var(--border); display: flex; flex-direction: column; gap: 0.75rem; animation: fadeInUp 0.4s ease-out forwards; }
        .qa-card-top { display: flex; align-items: center; gap: 0.6rem; font-size: 0.75rem; }
        .qa-card-top strong { color: var(--text); }
        .status-tag { font-size: 0.6rem; font-weight: 900; padding: 0.1rem 0.4rem; border-radius: 2px; margin-left: auto; }
        .status-tag.answered { background: var(--secondary-glow); color: var(--secondary); }
        .status-tag.live { background: #f8717122; color: #f87171; animation: flash 1s infinite; }
        @keyframes flash { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        
        .qa-text { font-size: 0.875rem; line-height: 1.5; color: var(--text-muted); }
        .qa-footer { display: flex; gap: 1.5rem; align-items: center; }
        .vote-btn { background: transparent; border: none; color: var(--text-faint); display: flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; font-weight: 800; cursor: pointer; transition: var(--transition); }
        .vote-btn:hover { color: var(--primary); }
      `}</style>
    </div>
  );
}
