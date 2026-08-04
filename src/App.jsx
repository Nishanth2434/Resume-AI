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

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, padding: '1rem 2rem' }}>
      <div className="glass-panel" style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0.75rem 1.5rem', 
        borderRadius: 'var(--radius-pill)',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)' }}>
          <div style={{ background: 'var(--gradient-mesh)', padding: '0.4rem', borderRadius: '50%', display: 'flex', alignItems: 'center', boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)' }}>
            <img src="https://github.com/user-attachments/assets/76906dbc-343d-4267-ace5-048d428fff42" alt="Logo" style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>SmartResume</span>
        </Link>
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }} className="nav-link">
            Home
          </Link>
          <Link to="/analyze" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }} className="nav-link">
            Analyzer
          </Link>
          <Link to="/build" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }} className="nav-link">
            Builder
          </Link>
          
          {session ? (
            <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }} className="nav-link">
              Sign Out
            </button>
          ) : (
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }} className="nav-link">
              Sign In
            </Link>
          )}

          <Link to="/analyze" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ padding: '4rem 2rem', textAlign: 'center', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'var(--gradient-mesh)', padding: '0.4rem', borderRadius: '50%', display: 'flex', alignItems: 'center', opacity: 0.5 }}>
          <img src="https://github.com/user-attachments/assets/76906dbc-343d-4267-ace5-048d428fff42" alt="Logo" style={{ width: '20px', height: '20px', filter: 'brightness(0) invert(1)' }} />
        </div>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
          © {new Date().getFullYear()} SmartResume AI. Elevate your career.
        </p>
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
