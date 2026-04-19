'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Zap, Calendar, MapPin, Users, Clock, 
  ChevronRight, ChevronLeft, Upload, Plus,
  Info, ShieldCheck, Rocket, Image as ImageIcon,
  Tag, BarChart
} from 'lucide-react';

export default function CreateEventPage() {
  const router = useRouter();
  const { user } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Hackathon',
    category: 'tech',
    description: '',
    venue: '',
    date: '',
    time: '09:00',
    capacity: 100,
    color: '#6C63FF',
    tags: []
  });
  const [isMagicLoading, setIsMagicLoading] = useState(false);

  const handleMagicGenerate = async () => {
    if (!formData.title) return;
    setIsMagicLoading(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formData.title })
      });
      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({
          ...prev,
          description: data.description,
          type: data.type,
          category: data.category,
          color: data.color,
          tags: data.suggestedTags
        }));
      }
    } catch (e) {
      console.error("Magic fail:", e);
    } finally {
      setIsMagicLoading(false);
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        organizerId: user?.id || 'org-temp',
        organizerName: user?.name || 'Creator',
        date: formData.date || new Date().toISOString().slice(0, 10),
      };

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        router.push('/organizer');
      } else {
        const errorData = await res.json();
        alert('Failed to deploy: ' + (errorData.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Network error during deployment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="creation-flow animate-fadeIn">
        
        {/* Progress Header */}
        <header className="flow-header">
          <div className="flow-title">
            <div className="discovery-badge">
              <Rocket size={14} /> MISSION DEPLOYMENT
            </div>
            <h1 className="Hub-heading">Deploy New Experience</h1>
            <p className="HUB-lead">Initialize a smart physical event with integrated telemetry.</p>
          </div>

          <div className="step-indicator">
            {[1, 2, 3].map(s => (
              <div key={s} className={`step-dot ${s <= step ? 'active' : ''}`}>
                <div className="dot-inner">{s < step ? <ShieldCheck size={12} /> : s}</div>
                <span>{s === 1 ? 'Details' : s === 2 ? 'Logistics' : 'Review'}</span>
              </div>
            ))}
          </div>
        </header>

        <form onSubmit={handleSubmit} className="flow-form glass-card animate-fadeInUp">
          {step === 1 && (
            <div className={`form-step animate-fadeIn ${isMagicLoading ? 'magic-syncing' : ''}`}>
              <div className="step-header-with-magic">
                <h2 className="step-heading">Core Intelligence</h2>
                <button 
                  type="button" 
                  className={`btn btn-sm magic-btn ${!formData.title ? 'disabled' : ''}`}
                  onClick={handleMagicGenerate}
                  disabled={isMagicLoading || !formData.title}
                >
                  {isMagicLoading ? <Sparkles className="animate-spin" size={14} /> : <Zap size={14} />} 
                  <span>{isMagicLoading ? 'AI Manifesting...' : 'Magic Generate'}</span>
                </button>
              </div>

              <div className="input-group">
                <label>Event Name</label>
                <div className="input-wrap">
                  <Zap size={18} />
                  <input 
                    placeholder="e.g. Future Tech Summit 2026" 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>Experience Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    {['Hackathon', 'Conference', 'Workshop', 'Sports', 'Networking'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Brand Accent</label>
                  <div className="color-picker">
                    {['#6C63FF', '#00D4AA', '#FF4757', '#FFA502', '#A29BFE'].map(c => (
                      <button 
                        key={c} 
                        type="button"
                        className={`color-swatch ${formData.color === c ? 'active' : ''}`} 
                        style={{ background: c }}
                        onClick={() => setFormData({...formData, color: c})}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label>Mission Description</label>
                <textarea 
                  rows="4" 
                  placeholder="Define the objectives and value proposition..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>

              {formData.tags?.length > 0 && (
                <div className="input-group">
                   <label>System-Suggested Tags</label>
                   <div className="tags-preview">
                      {formData.tags.map(tag => <span key={tag} className="s-tag">#{tag}</span>)}
                   </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="form-step animate-fadeIn">
              <h2 className="step-heading">Deployment Logistics</h2>
              
              <div className="input-group">
                <label>Venue Coordinates</label>
                <div className="input-wrap">
                  <MapPin size={18} />
                  <input 
                    placeholder="Enter physical address or virtual link" 
                    value={formData.venue}
                    onChange={e => setFormData({...formData, venue: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>Launch Date</label>
                  <div className="input-wrap">
                    <Calendar size={18} />
                    <input 
                      type="date" 
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label>Target Capacity</label>
                  <div className="input-wrap">
                    <Users size={18} />
                    <input 
                      type="number" 
                      value={formData.capacity}
                      onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})}
                      placeholder="e.g. 500"
                    />
                  </div>
                </div>
              </div>

              <div className="upload-zone">
                <ImageIcon size={32} />
                <p>Upload Experience Banner</p>
                <span>Recommended: 1920x1080 (Max 5MB)</span>
                <input type="file" className="file-input" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step animate-fadeIn">
              <h2 className="step-heading">Final Verification</h2>
              <div className="preview-card glass-card" style={{ borderColor: formData.color }}>
                <div className="preview-badge" style={{ background: formData.color }}>{formData.type}</div>
                <div className="preview-body">
                   <h3>{formData.title || 'Untitled Experience'}</h3>
                   <div className="preview-meta">
                      <span><Calendar size={14} /> {formData.date || 'TBD'}</span>
                      <span><MapPin size={14} /> {formData.venue || 'No Venue'}</span>
                      <span><Users size={14} /> {formData.capacity} slots</span>
                   </div>
                </div>
              </div>

              <div className="policy-check">
                <ShieldCheck size={20} className="text-secondary" />
                <p>I confirm that this experience adheres to the <strong>Smart Protocol Governance</strong> and <strong>Safe Entry Guidelines</strong>.</p>
              </div>
            </div>
          )}

          <div className="form-actions">
            {step > 1 && (
              <button type="button" className="btn btn-ghost" onClick={prevStep}>
                <ChevronLeft size={18} /> BACK
              </button>
            )}
            <div className="m-left-auto">
              {step < 3 ? (
                <button type="button" className="btn btn-primary lg" onClick={nextStep}>
                  CONTINUE <ChevronRight size={18} />
                </button>
              ) : (
                <button type="submit" className="btn btn-primary lg shadow-lg" style={{ background: formData.color }} disabled={isSubmitting}>
                  {isSubmitting ? 'DEPLOYING...' : 'DEPLOY EXPERIENCE'} <Rocket size={18} />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .creation-flow { max-width: 800px; margin: 0 auto; padding: 1rem 0; }
        
        .step-header-with-magic { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
        .magic-btn { 
          display: flex; align-items: center; gap: 0.6rem; 
          background: var(--bg-glass); border: 1px solid var(--secondary-glow);
          color: var(--secondary); font-weight: 800; border-radius: 8px;
          cursor: pointer; transition: var(--transition);
        }
        .magic-btn:hover:not(:disabled) { background: var(--secondary-glow); transform: scale(1.05); }
        .magic-btn.disabled { opacity: 0.3; cursor: not-allowed; }

        .magic-syncing { position: relative; }
        .magic-syncing::after { 
           content: ''; position: absolute; inset: -10px; 
           border: 2px solid var(--secondary); border-radius: var(--radius-lg); 
           animation: magic-border 2s infinite; pointer-events: none;
        }
        @keyframes magic-border { 0% { opacity: 0; transform: scale(0.98); } 50% { opacity: 0.5; } 100% { opacity: 0; transform: scale(1.02); } }

        .tags-preview { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .s-tag { font-size: 0.7rem; font-weight: 800; color: var(--secondary); background: var(--secondary-glow); padding: 0.2rem 0.6rem; border-radius: 4px; }
        
        .flow-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3.5rem; }
        .discovery-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.3rem 0.8rem; background: var(--secondary-glow); 
          color: var(--secondary); border-radius: 4px; font-size: 0.65rem; font-weight: 800;
          letter-spacing: 0.05em; margin-bottom: 0.75rem;
        }

        .step-indicator { display: flex; gap: 2.5rem; }
        .step-dot { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; opacity: 0.4; transition: var(--transition); }
        .step-dot.active { opacity: 1; }
        .dot-inner { 
          width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--border); 
          display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800;
          background: var(--bg-card2); transition: var(--transition);
        }
        .step-dot.active .dot-inner { border-color: var(--secondary); color: var(--secondary); background: var(--secondary-glow); }
        .step-dot span { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }

        .flow-form { padding: 3rem !important; }
        .step-heading { font-size: 1.5rem; font-weight: 800; margin-bottom: 2.5rem; }

        .input-group { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem; }
        .input-group label { font-size: 0.75rem; font-weight: 800; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.05em; }
        
        .input-wrap { 
          display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1.25rem; 
          background: var(--bg-card2); border: 1px solid var(--border); border-radius: var(--radius-md);
          transition: var(--transition);
        }
        .input-wrap:focus-within { border-color: var(--secondary); box-shadow: 0 0 0 4px var(--secondary-glow); }
        .input-wrap input { background: transparent; border: none; color: var(--text); outline: none; width: 100%; font-size: 0.9375rem; }
        .input-wrap svg { color: var(--text-faint); }

        .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        
        select { 
          background: var(--bg-card2); border: 1px solid var(--border); color: var(--text); 
          padding: 0.75rem 1.25rem; border-radius: var(--radius-md); outline: none;
          font-weight: 600; font-size: 0.9375rem;
        }

        textarea { 
          background: var(--bg-card2); border: 1px solid var(--border); color: var(--text); 
          padding: 1.25rem; border-radius: var(--radius-md); outline: none;
          font-family: inherit; font-size: 0.9375rem; line-height: 1.6;
        }
        textarea:focus { border-color: var(--secondary); }

        .color-picker { display: flex; gap: 1rem; align-items: center; height: 100%; }
        .color-swatch { 
          width: 32px; height: 32px; border-radius: 50%; border: 2px solid transparent; 
          cursor: pointer; transition: var(--transition); padding: 0;
        }
        .color-swatch.active { border-color: white; transform: scale(1.15); box-shadow: 0 0 15px rgba(255,255,255,0.2); }

        .upload-zone { 
          border: 2px dashed var(--border); border-radius: var(--radius-lg); 
          padding: 3rem; text-align: center; display: flex; flex-direction: column; 
          align-items: center; gap: 1rem; transition: var(--transition);
          position: relative;
        }
        .upload-zone:hover { border-color: var(--secondary); background: var(--secondary-glow); }
        .upload-zone p { font-weight: 700; color: var(--text); }
        .upload-zone span { font-size: 0.75rem; color: var(--text-faint); }
        .file-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

        .preview-card { padding: 2.5rem !important; border-width: 2px !important; margin-bottom: 2rem; }
        .preview-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.65rem; font-weight: 900; color: black; margin-bottom: 1.5rem; }
        .preview-body h3 { font-size: 1.75rem; margin-bottom: 1rem; }
        .preview-meta { display: flex; gap: 2rem; color: var(--text-faint); font-weight: 600; font-size: 0.8125rem; }
        .preview-meta span { display: flex; align-items: center; gap: 0.5rem; }

        .policy-check { display: flex; gap: 1.25rem; align-items: center; padding: 1.5rem; background: var(--bg-card2); border-radius: var(--radius-md); }
        .policy-check p { font-size: 0.875rem; color: var(--text-muted); line-height: 1.5; }
        .policy-check strong { color: var(--text); }

        .form-actions { display: flex; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--border); }
        .m-left-auto { margin-left: auto; }

        @media (max-width: 640px) {
          .input-row { grid-template-columns: 1fr; }
          .flow-header { flex-direction: column; align-items: flex-start; gap: 2rem; }
        }
      `}</style>
    </DashboardLayout>
  );
}
