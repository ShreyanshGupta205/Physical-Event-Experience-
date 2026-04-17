'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Zap, GraduationCap, LayoutDashboard, ShieldCheck, Users, Eye, EyeOff, ArrowRight, Check, Sparkles } from 'lucide-react';

const ROLES = [
  { id: 'student', label: 'Explorer', icon: GraduationCap, color: 'var(--primary)', glow: 'var(--primary-glow)', desc: 'Discover events and secure your digital entry passes.' },
  { id: 'organizer', label: 'Creator', icon: LayoutDashboard, color: 'var(--secondary)', glow: 'var(--secondary-glow)', desc: 'Design experiences and monitor your venue in real-time.' },
  { id: 'admin', label: 'Overseer', icon: ShieldCheck, color: 'var(--accent)', glow: 'var(--accent-glow)', desc: 'System-wide governance and high-level architectural control.' },
  { id: 'staff', label: 'Guardian', icon: Users, color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.1)', desc: 'On-ground execution, crowd control, and entry verification.' },
];

export default function AuthPage() {
  const router = useRouter();
  const { login } = useApp();
  const [mode, setMode] = useState('login');
  const [selectedRole, setSelectedRole] = useState('student');
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const roleData = ROLES.find(r => r.id === selectedRole) || ROLES[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    login({ id: 'user-1', name: form.name || 'John Doe', email: form.email }, selectedRole);
    router.push(selectedRole === 'student' ? '/' : `/${selectedRole}`);
  };

  return (
    <div className="auth-viewport animate-fadeIn">
      <div className="auth-card-layout glass-card">
        
        {/* Visual Brand Side */}
        <section className="brand-side" style={{ '--accent-role': roleData.color }}>
          <div className="brand-content">
            <div className="brand-logo">
              <div className="logo-box">
                <Zap fill="white" size={24} />
              </div>
              <span className="logo-text">EventSphere</span>
            </div>
            
            <div className="brand-message">
              <h2 className="brand-headline">Defining the<br />Future of Events.</h2>
              <p className="brand-subline">Immersive physical experiences powered by next-gen AI monitoring and seamless digital access.</p>
              
              <ul className="feature-list">
                {['Dynamic QR Entry', 'Crowd Intel Map', 'Real-time Coordination', 'Smart Insights'].map(f => (
                  <li key={f}><Check size={16} className="text-secondary" /> {f}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="brand-footer">
            <div className="brand-stat"><strong>42k</strong><span>Active Users</span></div>
            <div className="stat-sep" />
            <div className="brand-stat"><strong>99.9%</strong><span>Scan Rate</span></div>
          </div>
          
          <div className="dynamic-glow" style={{ background: roleData.glow }} />
        </section>

        {/* Interaction Side */}
        <section className="form-side">
          <div className="form-container">
            <header className="form-header">
              <div className="mode-pill">
                <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
                <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Join</button>
              </div>
              <h1 className="form-title">{mode === 'login' ? 'Sign in to Sphere' : 'Initialize Account'}</h1>
              <p className="form-subtitle">Welcome back! Please enter your credentials.</p>
            </header>

            {/* Role Grid */}
            <div className="roles-tray">
               {ROLES.map(r => {
                 const Icon = r.icon;
                 return (
                   <button 
                     key={r.id} 
                     className={`role-item ${selectedRole === r.id ? 'active' : ''}`}
                     onClick={() => setSelectedRole(r.id)}
                     style={{ '--r-col': r.color, '--r-glow': r.glow }}
                   >
                     <Icon size={18} />
                     <span>{r.label}</span>
                   </button>
                 );
               })}
            </div>

            <form className="auth-form-body" onSubmit={handleSubmit}>
              {mode === 'register' && (
                <div className="input-field">
                  <label>Display Name</label>
                  <input type="text" placeholder="John Doe" required onChange={e => setForm({...form, name: e.target.value})} />
                </div>
              )}
              
              <div className="input-field">
                <label>Access Email</label>
                <input type="email" placeholder="name@sphere.ai" required onChange={e => setForm({...form, email: e.target.value})} />
              </div>

              <div className="input-field">
                <div className="label-row">
                  <label>Master Password</label>
                  {mode === 'login' && <span className="forgot">Forgot?</span>}
                </div>
                <div className="pass-wrap">
                  <input type={showPass ? 'text' : 'password'} placeholder="••••••••" required onChange={e => setForm({...form, password: e.target.value})} />
                  <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button className="btn btn-primary btn-lg full-btn" type="submit" disabled={loading} style={{ background: roleData.color }}>
                {loading ? <Activity className="animate-spin" size={18} /> : (
                  <>
                    <span>{mode === 'login' ? 'Access Portal' : 'Create Identity'}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <footer className="form-footer">
               <p>Powered by EventSphere Security Protocol v2.4</p>
            </footer>
          </div>
        </section>

      </div>

      <style jsx>{`
        .auth-viewport {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: #020408;
          overflow: hidden;
        }

        .auth-card-layout {
          width: 100%;
          max-width: 1000px;
          min-height: 640px;
          display: grid;
          grid-template-columns: 400px 1fr;
          padding: 0 !important;
          overflow: hidden;
        }

        @media (max-width: 900px) {
          .auth-card-layout { grid-template-columns: 1fr; }
          .brand-side { display: none; }
        }

        /* Brand Side */
        .brand-side {
          background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%);
          padding: 3rem;
          display: flex;
          flex-direction: column;
          position: relative;
          border-right: 1px solid var(--border);
        }

        .brand-logo { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 5rem; }
        .logo-box { 
          width: 40px; height: 40px; 
          background: var(--accent-role); 
          border-radius: 10px; 
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 20px var(--accent-role);
        }
        .logo-text { font-size: 1.25rem; font-weight: 800; letter-spacing: -0.02em; }

        .brand-headline { font-size: 2.25rem; margin-bottom: 1.5rem; line-height: 1.1; }
        .brand-subline { font-size: 0.9375rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 2rem; }

        .feature-list { list-style: none; display: flex; flex-direction: column; gap: 1rem; }
        .feature-list li { display: flex; align-items: center; gap: 0.75rem; font-size: 0.875rem; font-weight: 600; color: var(--text-muted); }

        .brand-footer { margin-top: auto; display: flex; gap: 2rem; padding-top: 2rem; border-top: 1px solid var(--border); }
        .brand-stat { display: flex; flex-direction: column; gap: 0.25rem; }
        .brand-stat strong { font-size: 1.25rem; font-family: 'Space Grotesk', sans-serif; }
        .brand-stat span { font-size: 0.75rem; color: var(--text-faint); text-transform: uppercase; font-weight: 700; }
        .stat-sep { width: 1px; height: 32px; background: var(--border); }

        .dynamic-glow {
          position: absolute;
          bottom: -10%; left: -10%;
          width: 300px; height: 300px;
          filter: blur(80px);
          opacity: 0.15;
          z-index: -1;
          border-radius: 50%;
        }

        /* Form Side */
        .form-side { padding: 4rem; display: flex; align-items: center; justify-content: center; }
        .form-container { width: 100%; max-width: 400px; }

        .form-header { margin-bottom: 2.5rem; }
        .mode-pill {
          display: inline-flex;
          background: var(--bg-card);
          padding: 0.25rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border);
          margin-bottom: 1.5rem;
        }
        .mode-pill button {
          padding: 0.5rem 1.25rem;
          border: none; background: transparent;
          color: var(--text-muted); font-size: 0.8125rem; font-weight: 700;
          cursor: pointer; border-radius: var(--radius-full);
          transition: var(--transition);
        }
        .mode-pill button.active { background: var(--bg-card2); color: var(--text); box-shadow: var(--shadow-sm); }

        .form-title { font-size: 1.75rem; margin-bottom: 0.5rem; }
        .form-subtitle { font-size: 0.875rem; color: var(--text-faint); }

        .roles-tray {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-bottom: 2.5rem;
        }

        .role-item {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.875rem;
          border: 1px solid var(--border);
          background: var(--bg-card);
          border-radius: var(--radius-md);
          color: var(--text-muted);
          cursor: pointer; transition: var(--transition);
        }
        .role-item span { font-size: 0.8125rem; font-weight: 600; }
        .role-item.active { border-color: var(--r-col); background: var(--r-glow); color: var(--r-col); box-shadow: 0 0 15px var(--r-glow); }

        .auth-form-body { display: flex; flex-direction: column; gap: 1.5rem; }
        .input-field { display: flex; flex-direction: column; gap: 0.625rem; }
        .input-field label { font-size: 0.8125rem; font-weight: 700; color: var(--text-muted); }
        .input-field input {
          width: 100%;
          background: var(--bg-card2);
          border: 1px solid var(--border);
          padding: 0.875rem 1.125rem;
          border-radius: var(--radius-md);
          color: var(--text);
          font-size: 0.9375rem;
          outline: none;
          transition: var(--transition);
        }
        .input-field input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-glow); }

        .label-row { display: flex; justify-content: space-between; align-items: center; }
        .forgot { font-size: 0.75rem; color: var(--primary-light); cursor: pointer; }

        .pass-wrap { position: relative; }
        .eye-btn { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-faint); cursor: pointer; }

        .full-btn { width: 100%; margin-top: 1rem; }

        .form-footer { margin-top: 3rem; text-align: center; }
        .form-footer p { font-size: 0.7rem; color: var(--text-faint); text-transform: uppercase; font-weight: 700; letter-spacing: 0.1em; }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
