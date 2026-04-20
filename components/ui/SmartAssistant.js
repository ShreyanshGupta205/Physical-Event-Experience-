'use client';
import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, Zap, Minimize2, Loader2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function SmartAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { role, user } = useApp();
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Identity Verified. I am Eventra AI. How can I assist with your experience coordinates today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    const newMessages = [...messages, { role: 'user', text: userMsg }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: newMessages,
          role: role,
          name: user?.name
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'bot', text: data.text }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: "Error: " + (data.error || "System telemetry gap detected.") }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Critical: AI connection lost. Please check your data link." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="smart-assistant-wrap">
      {/* Pulse button */}
      {!isOpen && (
        <button className="assistant-trigger shadow-lg" onClick={() => setIsOpen(true)}>
          <div className="trigger-icon">
            <Bot size={24} />
            <div className="pulse-ring" />
          </div>
          <span className="trigger-label">ASK EVENTRA AI</span>
        </button>
      )}

      {/* Chat interface */}
      {isOpen && (
        <div className="assistant-window glass-card animate-scaleUp">
          <header className="assistant-header">
            <div className="bot-info">
              <div className="bot-avatar">
                <Bot size={18} />
                <div className="online-dot" />
              </div>
              <div className="bot-meta">
                <strong>EVENTRA AI</strong>
                <span>Active Core</span>
              </div>
            </div>
            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setIsOpen(false)}><Minimize2 size={16} /></button>
          </header>

          <div className="chat-body" ref={scrollRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`message-row ${msg.role}`}>
                <div className="message-bubble">
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message-row bot animate-pulse">
                <div className="message-bubble typing-indicator">
                  <Loader2 size={16} className="animate-spin" />
                  <span>AI is thinking...</span>
                </div>
              </div>
            )}
          </div>

          <form className="chat-footer" onSubmit={handleSend}>
            <input 
              placeholder="Query the system..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="send-btn" disabled={loading}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </form>

          <div className="bot-backdrop">
             <div className="glow-circle" />
          </div>
        </div>
      )}

      <style jsx>{`
        .smart-assistant-wrap { position: fixed; bottom: 2rem; right: 2rem; z-index: 2000; }
        
        .assistant-trigger { 
          display: flex; align-items: center; gap: 1rem; padding: 0.5rem 1.5rem 0.5rem 0.5rem; 
          background: var(--bg-card); border: 1px solid var(--secondary); border-radius: var(--radius-full);
          color: var(--text); cursor: pointer; transition: var(--transition);
        }
        .assistant-trigger:hover { transform: scale(1.05); background: var(--secondary-glow); }
        
        .trigger-icon { 
          width: 44px; height: 44px; background: var(--secondary); border-radius: 50%;
          display: flex; align-items: center; justify-content: center; color: black; position: relative;
        }
        .pulse-ring { position: absolute; inset: -4px; border: 2px solid var(--secondary); border-radius: 50%; opacity: 0; animation: pulse-ring 2s infinite; }
        @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1.3); opacity: 0; } }

        .trigger-label { font-size: 0.75rem; font-weight: 900; letter-spacing: 0.1em; color: var(--secondary); }

        .assistant-window { 
          width: 360px; height: 500px; display: flex; flex-direction: column; overflow: hidden; 
          padding: 0 !important; box-shadow: 0 30px 60px rgba(0,0,0,0.5);
        }
        
        .assistant-header { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem; border-bottom: 1px solid var(--border); background: var(--bg-glass); position: relative; z-index: 2; }
        .bot-info { display: flex; align-items: center; gap: 1rem; }
        .bot-avatar { width: 36px; height: 36px; border-radius: 10px; background: var(--secondary-glow); color: var(--secondary); display: flex; align-items: center; justify-content: center; position: relative; }
        .online-dot { position: absolute; top: -2px; right: -2px; width: 8px; height: 8px; background: #4ade80; border-radius: 50%; border: 2px solid var(--bg); }
        .bot-meta strong { font-size: 0.8125rem; letter-spacing: 0.05em; display: block; }
        .bot-meta span { font-size: 0.65rem; color: #4ade80; font-weight: 800; }

        .chat-body { flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; position: relative; z-index: 2; }
        .message-row { display: flex; width: 100%; }
        .message-row.user { justify-content: flex-end; }
        .message-bubble { 
          max-width: 80%; padding: 0.875rem 1.25rem; border-radius: 16px; font-size: 0.875rem; line-height: 1.5;
        }
        .bot .message-bubble { background: var(--bg-card2); border: 1px solid var(--border); color: var(--text); border-bottom-left-radius: 4px; }
        .user .message-bubble { background: var(--secondary); color: black; font-weight: 500; border-bottom-right-radius: 4px; }
        
        .typing-indicator { 
          display: flex; align-items: center; gap: 0.5rem; 
          font-size: 0.75rem; font-weight: 800; color: var(--secondary); 
          background: var(--bg-card2);
        }

        .chat-footer { padding: 1rem; background: var(--bg-glass); display: flex; gap: 0.75rem; border-top: 1px solid var(--border); position: relative; z-index: 2; }
        .chat-footer input { flex: 1; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 0.75rem 1rem; color: var(--text); font-size: 0.875rem; outline: none; }
        .chat-footer input:focus { border-color: var(--secondary); }
        .send-btn { width: 44px; height: 44px; border-radius: 10px; background: var(--secondary); color: black; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: var(--transition); }
        .send-btn:hover { transform: scale(1.05); }

        .bot-backdrop { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
        .glow-circle { position: absolute; top: 10%; left: 10%; width: 300px; height: 300px; background: radial-gradient(circle, var(--secondary-glow) 0%, transparent 70%); opacity: 0.1; }

        @media (max-width: 640px) {
          .assistant-window { width: calc(100vw - 2rem); height: calc(100vh - 8rem); bottom: 1rem; right: 1rem; }
        }
      `}</style>
    </div>
  );
}
