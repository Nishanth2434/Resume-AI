import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Target, TrendingUp, Sparkles, Upload, FileText, ChevronRight, Zap } from 'lucide-react';

function Home() {
  return (
    <div className="container hero-section">
      {/* Hero Section */}
      <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto 8rem auto', position: 'relative' }}>
        <div className="animate-fade-in-up stagger-1" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.5rem 1rem', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-pill)', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '2rem', fontSize: '0.9rem' }}>
          <Sparkles size={16} style={{ marginRight: '0.5rem', color: 'var(--accent-cyan)' }} />
          <span>Next-Generation Career Intelligence</span>
        </div>
        
        <h1 className="animate-fade-in-up stagger-2" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.05, letterSpacing: '-0.04em' }}>
          Craft the ultimate <br/>
          <span className="text-gradient" style={{ paddingBottom: '0.2em' }}>professional narrative</span>
        </h1>
        
        <p className="animate-fade-in-up stagger-3" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', color: 'var(--text-secondary)', marginBottom: '3.5rem', maxWidth: '650px', margin: '0 auto 3.5rem auto', lineHeight: 1.7 }}>
          AI-driven insights that surgically analyze your resume against ATS algorithms, exposing critical gaps and supercharging your job prospects.
        </p>
        
        <div className="animate-fade-in-up stagger-4" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <Link to="/analyze" className="btn btn-gradient" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            <Upload size={20} /> Analyze Resume
          </Link>
          <Link to="/build" className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            <FileText size={20} /> Build from Scratch
          </Link>
        </div>
      </div>

      {/* Bento Box Features Section */}
      <div style={{ marginBottom: '8rem' }}>
        <h2 className="animate-fade-in-up" style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '4rem', letterSpacing: '-0.03em' }}>Unfair Advantage.</h2>
        
        <div className="bento-grid">
          {/* Main Feature - Large */}
          <div className="glass-panel glass-panel-hover col-12 md-col-8 bento-inner-lg" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, var(--accent-cyan), transparent 60%)', filter: 'blur(60px)', opacity: 0.2, zIndex: 0 }}></div>
            <div style={{ zIndex: 1, position: 'relative' }}>
              <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.2)', display: 'inline-flex', padding: '1.2rem', borderRadius: '1.2rem', marginBottom: '2rem' }}>
                <ShieldCheck size={40} color="var(--accent-cyan)" />
              </div>
              <h3 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Surgical ATS Compatibility</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '500px', lineHeight: 1.6 }}>
                Our deep learning models simulate enterprise Applicant Tracking Systems. We parse your resume precisely how recruiters see it, guaranteeing you pass the automated screens.
              </p>
            </div>
          </div>

          {/* Side Feature 1 - Medium */}
          <div className="glass-panel glass-panel-hover col-12 md-col-4 bento-inner" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', display: 'inline-flex', padding: '1rem', borderRadius: '1rem', alignSelf: 'flex-start', marginBottom: '1.5rem' }}>
              <Target size={32} color="var(--accent-purple)" />
            </div>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Keyword Gap Analysis</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              Discover the exact industry keywords missing from your content compared to top job descriptions.
            </p>
          </div>

          {/* Side Feature 2 - Medium */}
          <div className="glass-panel glass-panel-hover col-12 md-col-5 bento-inner" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.2)', display: 'inline-flex', padding: '1rem', borderRadius: '1rem', alignSelf: 'flex-start', marginBottom: '1.5rem' }}>
              <TrendingUp size={32} color="var(--accent-pink)" />
            </div>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Skills Topography</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              Identify key skills you need to acquire or highlight to align perfectly with high-tier roles.
            </p>
          </div>

          {/* Wide Feature - Medium */}
          <div className="glass-panel glass-panel-hover col-12 md-col-7 bento-inner" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '3rem' }}>
            <div>
              <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>AI-Powered Builder</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                Don't have a resume? Build a breathtaking, recruiter-approved document from scratch in minutes.
              </p>
              <Link to="/build" style={{ color: 'var(--accent-blue)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                Launch Builder <ChevronRight size={18} />
              </Link>
            </div>
            <div className="hidden-mobile" style={{ justifyContent: 'center', alignItems: 'center', width: '120px', height: '120px', background: 'var(--gradient-glass)', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Zap size={48} color="white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
