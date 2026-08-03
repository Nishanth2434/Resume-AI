import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FileText, BarChart, Settings, Home as HomeIcon, Zap } from 'lucide-react';
import Home from './pages/Home';
import Analyzer from './pages/Analyzer';
import Builder from './pages/Builder';
import './index.css';

function Navbar() {
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
  return (
    <Router>
      <div className="app-container">
        <BackgroundEffects />
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyze" element={<Analyzer />} />
            <Route path="/build" element={<Builder />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
