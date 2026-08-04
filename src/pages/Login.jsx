import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Zap, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("Registration successful! Check your email or try logging in.");
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        // Redirect on success
        const from = location.state?.from?.pathname || '/analyze';
        navigate(from, { replace: true });
      }
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '6rem 2rem', minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel animate-fade-in-up" style={{ padding: '4rem', width: '100%', maxWidth: '450px', position: 'relative', overflow: 'hidden' }}>
        
        <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, var(--accent-blue), transparent 60%)', filter: 'blur(80px)', opacity: 0.1, zIndex: 0, pointerEvents: 'none' }}></div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ background: 'var(--gradient-mesh)', padding: '0.75rem', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' }}>
              <Zap size={32} color="white" />
            </div>
            <h1 style={{ fontSize: '2.5rem', margin: 0, letterSpacing: '-0.03em' }}>
              {isSignUp ? 'Create ' : 'Welcome '} 
              <span className="text-gradient">{isSignUp ? 'Account' : 'Back'}</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              {isSignUp ? 'Sign up to start analyzing your resume.' : 'Enter your credentials to access your dashboard.'}
            </p>
          </div>

          {errorMsg && (
            <div className="animate-scale-in" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '0.5rem', color: '#ef4444', marginBottom: '1.5rem' }}>
              <AlertCircle size={20} />
              <span style={{ fontSize: '0.9rem' }}>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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

            <button type="submit" disabled={loading} className="btn btn-gradient" style={{ width: '100%', marginTop: '1rem', padding: '1rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')} <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <button 
                onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(null); }} 
                style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
              >
                {isSignUp ? 'Sign in' : 'Create one'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
