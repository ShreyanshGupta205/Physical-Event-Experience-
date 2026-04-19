'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Zap, GraduationCap, LayoutDashboard, ShieldCheck, Users, Eye, EyeOff, ArrowRight, Check, Sparkles, Activity, AlertTriangle } from 'lucide-react';

const ROLES = [
  { id: 'student', label: 'Explorer', icon: GraduationCap, color: 'var(--primary)', glow: 'var(--primary-glow)', desc: 'Discover events and join webinars, workshops, and more. Secure your digital entry passes instantly.', publicSignup: true },
  { id: 'organizer', label: 'Creator', icon: LayoutDashboard, color: 'var(--secondary)', glow: 'var(--secondary-glow)', desc: 'Create and manage events, webinars, and workshops. View & request Guardians for your venue.', publicSignup: true },
  { id: 'admin', label: 'Overseer', icon: ShieldCheck, color: 'var(--accent)', glow: 'var(--accent-glow)', desc: 'Restricted access. System-wide governance — login only with authorized credentials.', publicSignup: false },
  { id: 'staff', label: 'Guardian', icon: Users, color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.1)', desc: 'On-ground gate control and QR scanning. Account created by Overseer admin only — login below.', publicSignup: false },
];

// Roles that cannot self-register
const LOGIN_ONLY_ROLES = ['admin', 'staff'];

export default function AuthPage() {
  const router = useRouter();
  const { login } = useApp();
  const [mode, setMode] = useState('login');
  const [selectedRole, setSelectedRole] = useState('student');

  const switchMode = (newMode) => {
    setMode(newMode);
    setError(null);
    // If switching to register mode with a restricted role, reset to Explorer
    if (newMode === 'register' && LOGIN_ONLY_ROLES.includes(selectedRole)) {
      setSelectedRole('student');
    }
  };
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const roleData = ROLES.find(r => r.id === selectedRole) || ROLES[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'register') {
        // Security: block restricted roles from self-registering
        if (LOGIN_ONLY_ROLES.includes(selectedRole)) {
          setError('This role cannot be registered publicly. Please contact your system administrator.');
          setLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await updateProfile(userCredential.user, { displayName: form.name });
        
        // Sync with MongoDB — onAuthStateChanged will also fire but we do it here
        // to get the role set immediately before the redirect
        const syncRes = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: form.name, 
            email: form.email,
            role: selectedRole
          })
        });
        
        const mongoUser = syncRes.ok ? await syncRes.json() : { role: selectedRole };
        login(mongoUser, mongoUser.role || selectedRole);
        
        const destination = mongoUser.role === 'student' ? '/student/events' : `/${mongoUser.role || selectedRole}`;
        router.push(destination);

      } else {
        // LOGIN flow
        await signInWithEmailAndPassword(auth, form.email, form.password);
        
        // Fetch MongoDB record for role
        const fetchRes = await fetch(`/api/users?email=${encodeURIComponent(form.email)}`);
        
        let destination = '/';
        if (fetchRes.ok) {
          const mongoUser = await fetchRes.json();
          login(mongoUser, mongoUser.role || 'student');
          destination = mongoUser.role === 'student' ? '/student/events' : `/${mongoUser.role}`;
        } else {
          // DB unavailable — still allow login based on Firebase, use selected role
          login({ email: form.email }, selectedRole);
          destination = selectedRole === 'student' ? '/student/events' : `/${selectedRole}`;
        }
        
        router.push(destination);
      }
    } catch (err) {
      console.error("Auth Error:", err);
      let message = err.message;
      if (err.code === 'auth/invalid-credential') {
        message = "Incorrect email or password. If you haven't registered yet, please use the 'Join' tab.";
      } else if (err.code === 'auth/email-already-in-use') {
        message = "This email is already registered. Please go to the 'Login' tab.";
      } else if (err.code === 'auth/weak-password') {
        message = "Password should be at least 6 characters.";
      } else if (err.code === 'auth/invalid-email') {
        message = "Please enter a valid email address.";
      }
      setError(message);
    } finally {
      setLoading(false);
    }
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
              <span className="logo-text">Eventra</span>
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
                <button className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>Login</button>
                {/* Hide Join tab for login-only roles */}
                {!LOGIN_ONLY_ROLES.includes(selectedRole) && (
                  <button className={mode === 'register' ? 'active' : ''} onClick={() => switchMode('register')}>Join</button>
                )}
                {LOGIN_ONLY_ROLES.includes(selectedRole) && (
                  <span className="restricted-badge">Login Only</span>
                )}
              </div>
              <h1 className="form-title">{mode === 'login' ? 'Sign in to Sphere' : 'Initialize Account'}</h1>
              <p className="form-subtitle">Welcome back! Please enter your credentials.</p>
            </header>

            {error && (
              <div className="form-error animate-slideIn">
                <AlertTriangle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Role Grid */}
            <div className="roles-tray">
               {ROLES
                 // In register mode, only show public signup roles
                 .filter(r => mode === 'login' || r.publicSignup)
                 .map(r => {
                   const Icon = r.icon;
                   const isLoginOnly = LOGIN_ONLY_ROLES.includes(r.id);
                   return (
                     <button 
                       key={r.id} 
                       className={`role-item ${selectedRole === r.id ? 'active' : ''} ${isLoginOnly ? 'login-only-role' : ''}`}
                       onClick={() => { setSelectedRole(r.id); setError(null); }}
                       style={{ '--r-col': r.color, '--r-glow': r.glow }}
                       title={isLoginOnly ? 'Login only — contact admin' : r.label}
                     >
                       <Icon size={18} />
                       <span>{r.label}</span>
                       {isLoginOnly && <span className="lock-tag">🔒</span>}
                     </button>
                   );
               })}
            </div>

            <div className="role-description animate-slideIn" style={{ '--accent': roleData.color }}>
               {roleData.desc}
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
               <p>Powered by Eventra Security Protocol v2.4</p>
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
          color: var(--text-faint);
          cursor: pointer; transition: var(--transition);
        }
        .role-item:hover { border-color: var(--text-muted); background: var(--bg-card2); color: var(--text-muted); }
        .role-item span { font-size: 0.8125rem; font-weight: 600; }
        .role-item.active { 
          border-color: var(--r-col); 
          background: var(--r-glow); 
          color: var(--r-col); 
          box-shadow: 0 0 20px var(--r-glow);
          opacity: 1;
        }

        .role-description {
          padding: 0.75rem 1rem;
          background: var(--bg-card2);
          border-left: 2px solid var(--accent);
          color: var(--text-muted);
          font-size: 0.75rem;
          font-style: italic;
          line-height: 1.5;
          margin-bottom: 2rem;
          border-radius: 0 4px 4px 0;
        }

        .restricted-badge {
          padding: 0.5rem 1.25rem;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: var(--radius-full);
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .login-only-role {
          opacity: 0.75;
          position: relative;
        }
        .login-only-role:hover { border-color: var(--r-col) !important; opacity: 1; }

        .lock-tag { 
          margin-left: auto; 
          font-size: 0.7rem; 
          opacity: 0.6;
        }

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

        .form-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
          padding: 1rem;
          border-radius: var(--radius-md);
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.8125rem;
          font-weight: 600;
        }

        @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
