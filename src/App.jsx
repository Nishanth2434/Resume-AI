import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { FileText, BarChart, Settings, Home as HomeIcon, Zap, LogIn, LogOut } from 'lucide-react';
import { supabase } from './lib/supabase';
import Home from './pages/Home';
import Analyzer from './pages/Analyzer';
import Builder from './pages/Builder';
import Login from './pages/Login';
import './index.css';

// Create Authentication Context
export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  if (!session) {
    // Redirect them to the /login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function Navbar() {
  const { session, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="app-header">
      <div className="glass-panel navbar-panel">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)', textDecoration: 'none' }}>
          <div style={{ background: 'var(--gradient-mesh)', padding: '0.4rem', borderRadius: '50%', display: 'flex', alignItems: 'center', boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)' }}>
            <img src="/logo.jpg" alt="Logo" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
          </div>
          <span className="brand-text">SmartResume<span className="text-gradient">AI</span></span>
        </Link>
        
        <nav className="nav-container">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, color: isActive('/') ? 'var(--accent-primary)' : 'var(--text-secondary)', transition: 'color 0.2s', textDecoration: 'none' }} className="nav-link">
            <HomeIcon size={16} /> <span className="nav-desktop-text">Home</span>
          </Link>
          <Link to="/analyze" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, color: isActive('/analyze') ? 'var(--accent-primary)' : 'var(--text-secondary)', transition: 'color 0.2s', textDecoration: 'none' }} className="nav-link">
            <BarChart size={16} /> <span className="nav-desktop-text">Analyzer</span>
          </Link>
          <Link to="/build" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, color: isActive('/build') ? 'var(--accent-primary)' : 'var(--text-secondary)', transition: 'color 0.2s', textDecoration: 'none' }} className="nav-link">
            <FileText size={16} /> <span className="nav-desktop-text">Builder</span>
          </Link>
          
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }}></div>
          
          {session ? (
            <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="nav-link">
              <LogOut size={16} /> <span className="nav-desktop-text">Sign Out</span>
            </button>
          ) : (
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link">
              <LogIn size={16} /> <span className="nav-desktop-text">Sign In</span>
            </Link>
          )}

          {!session && (
            <Link to="/analyze" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem', borderRadius: 'var(--radius-pill)', textDecoration: 'none' }}>
              <span className="nav-desktop-text">Get Started</span>
              <span className="hidden-mobile" style={{ display: 'none' }}>Go</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer-section" style={{ background: 'rgba(10, 10, 15, 0.8)', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 'auto', backdropFilter: 'blur(20px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
        
        {/* Brand Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src="/logo.jpg" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
            <span style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>SmartResume<span className="text-gradient">AI</span></span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Decode your resume, optimize for Applicant Tracking Systems, and build a recruiter-approved profile with the power of Gemini AI.
          </p>
        </div>

        {/* Links Column 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Product</h4>
          <Link to="/analyze" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} className="nav-link">AI Analyzer</Link>
          <Link to="/build" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} className="nav-link">Resume Builder</Link>
          <Link to="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} className="nav-link">ATS Templates</Link>
          <Link to="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} className="nav-link">Pricing (Free)</Link>
        </div>

        {/* Links Column 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Resources</h4>
          <Link to="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} className="nav-link">Blog & Tips</Link>
          <Link to="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} className="nav-link">Help Center</Link>
          <Link to="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} className="nav-link">Career Guide</Link>
          <a href="https://github.com/Nishanth2434/Resume-AI" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} className="nav-link">GitHub Repo</a>
        </div>

        {/* Links Column 3 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Legal</h4>
          <Link to="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} className="nav-link">Privacy Policy</Link>
          <Link to="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} className="nav-link">Terms of Service</Link>
          <Link to="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} className="nav-link">Cookie Policy</Link>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', margin: 0 }}>
          © {new Date().getFullYear()} SmartResume AI. Designed by Nishanth B.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="https://linkedin.com/in/nishanth-b-24b2006a" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-tertiary)', transition: 'color 0.2s' }} className="nav-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
          <a href="https://github.com/Nishanth2434" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-tertiary)', transition: 'color 0.2s' }} className="nav-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
          <a href="mailto:nishanthbnishu24@gmail.com" style={{ color: 'var(--text-tertiary)', transition: 'color 0.2s' }} className="nav-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

function BackgroundEffects() {
  return (
    <div className="bg-effects">
      <div className="bg-grid"></div>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, loading, logout }}>
      <Router>
        <div className="app-container">
          <BackgroundEffects />
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes */}
              <Route path="/analyze" element={
                <ProtectedRoute>
                  <Analyzer />
                </ProtectedRoute>
              } />
              
              <Route path="/build" element={
                <ProtectedRoute>
                  <Builder />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
