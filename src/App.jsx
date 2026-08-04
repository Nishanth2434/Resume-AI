import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { FileText, BarChart, Settings, Home as HomeIcon, Zap, LogIn, LogOut, Sun, Moon } from 'lucide-react';
import { supabase } from './lib/supabase';
import Home from './pages/Home';
import Analyzer from './pages/Analyzer';
import Builder from './pages/Builder';
import CoverLetter from './pages/CoverLetter';
import Login from './pages/Login';
import './index.css';

// Create Authentication Context
export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Create Theme Context
export const ThemeContext = createContext(null);
export const useTheme = () => useContext(ThemeContext);

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
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  if (location.pathname.includes('/login')) {
    return null;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="app-header">
        <div className="glass-panel navbar-panel">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)', textDecoration: 'none' }}>
            <div style={{ background: 'var(--gradient-mesh)', padding: '0.4rem', borderRadius: '50%', display: 'flex', alignItems: 'center', boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)' }}>
              <img src="/logo.jpg" alt="Logo" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
            </div>
            <span className="brand-text">SmartResume<span className="text-gradient">AI</span></span>
          </Link>
          
          <div className="top-actions-container">
            <nav className="desktop-nav-links">
              <Link to="/" className={`nav-link ${isActive('/') ? 'active-link' : ''}`}>
                <HomeIcon size={16} /> <span>Home</span>
              </Link>
              <Link to="/analyze" className={`nav-link ${isActive('/analyze') ? 'active-link' : ''}`}>
                <BarChart size={16} /> <span>Analyzer</span>
              </Link>
              <Link to="/build" className={`nav-link ${isActive('/build') ? 'active-link' : ''}`}>
                <FileText size={16} /> <span>Builder</span>
              </Link>
              <Link to="/cover-letter" className={`nav-link ${isActive('/cover-letter') ? 'active-link' : ''}`}>
                <FileText size={16} /> <span>Cover Letter</span>
              </Link>
            </nav>

            <div className="nav-divider"></div>
            
            <button onClick={toggleTheme} className="nav-link icon-btn" aria-label="Toggle Theme" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            {session ? (
              <button onClick={logout} className="nav-link icon-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                <LogOut size={16} /> <span className="nav-desktop-text">Sign Out</span>
              </button>
            ) : (
              <Link to="/login" className="nav-link icon-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)', textDecoration: 'none' }}>
                <LogIn size={16} /> <span className="nav-desktop-text">Sign In</span>
              </Link>
            )}

            {!session && (
              <Link to="/analyze" className="btn btn-gradient nav-desktop-text" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: 'var(--radius-pill)', textDecoration: 'none', marginLeft: '0.5rem' }}>
                Get Started
              </Link>
            )}
          </div>
        </div>
      </header>

      <nav className="mobile-bottom-nav">
        <Link to="/" className={`mobile-nav-item ${isActive('/') ? 'active-link' : ''}`}>
          <HomeIcon size={20} />
          <span>Home</span>
        </Link>
        <Link to="/analyze" className={`mobile-nav-item ${isActive('/analyze') ? 'active-link' : ''}`}>
          <BarChart size={20} />
          <span>Analyze</span>
        </Link>
        <Link to="/build" className={`mobile-nav-item ${isActive('/build') ? 'active-link' : ''}`}>
          <FileText size={20} />
          <span>Builder</span>
        </Link>
        <Link to="/cover-letter" className={`mobile-nav-item ${isActive('/cover-letter') ? 'active-link' : ''}`}>
          <FileText size={20} />
          <span>Cover</span>
        </Link>
      </nav>
    </>
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
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

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
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
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

                <Route path="/cover-letter" element={
                  <ProtectedRoute>
                    <CoverLetter />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
