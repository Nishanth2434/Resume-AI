import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '../App';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    login(); // Set authenticated state to true
    
    // Redirect to the page they tried to visit, or default to /analyze
    const from = location.state?.from?.pathname || '/analyze';
    navigate(from, { replace: true });
  };

  return (
    <div className="container" style={{ padding: '6rem 2rem', minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel animate-fade-in-up" style={{ padding: '4rem', width: '100%', maxWidth: '450px', position: 'relative', overflow: 'hidden' }}>
        
        {/* Background ambient glow inside the panel */}
        <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, var(--accent-blue), transparent 60%)', filter: 'blur(80px)', opacity: 0.1, zIndex: 0, pointerEvents: 'none' }}></div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ background: 'var(--gradient-mesh)', padding: '0.75rem', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' }}>
              <Zap size={32} color="white" />
            </div>
            <h1 style={{ fontSize: '2.5rem', margin: 0, letterSpacing: '-0.03em' }}>Welcome <span className="text-gradient">Back</span></h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Enter your credentials to access your dashboard.</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <Mail size={20} color="var(--text-tertiary)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1.25rem' }} />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '3rem' }}
              />
            </div>
            
            <div style={{ position: 'relative' }}>
              <Lock size={20} color="var(--text-tertiary)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1.25rem' }} />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '3rem' }}
              />
            </div>

            <button type="submit" className="btn btn-gradient" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
              Sign In <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
              Don't have an account? <Link to="#" style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
