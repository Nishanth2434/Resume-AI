import React, { useState } from 'react';
import { UploadCloud, File, CheckCircle, AlertCircle, BarChart2, PieChart, Activity, Zap } from 'lucide-react';

function Analyzer() {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [resultsReady, setResultsReady] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const startAnalysis = async () => {
    if (!file) return;
    setAnalyzing(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed. Ensure the backend server is running.');
      }

      const data = await response.json();
      setAnalysisData(data);
      setResultsReady(true);
    } catch (error) {
      console.error(error);
      alert('Error connecting to backend: ' + error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 2rem 10rem 2rem' }}>
      {!resultsReady ? (
        <div className="animate-fade-in-up" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', letterSpacing: '-0.03em' }}>
            Resume <span className="text-gradient">Intelligence</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '4rem' }}>Upload your resume and let our AI engine decode it.</p>
          
          <div 
            className="glass-panel" 
            style={{ 
              padding: '6rem 3rem', 
              textAlign: 'center', 
              border: '2px dashed ' + (file ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.1)'),
              background: file ? 'rgba(6, 182, 212, 0.05)' : 'var(--bg-surface)',
              transition: 'all 0.4s var(--ease-spring)',
              cursor: 'pointer'
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload').click()}
          >
            <div style={{ background: 'var(--gradient-glass)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto', border: '1px solid rgba(255,255,255,0.1)' }}>
              {analyzing ? (
                <Zap size={36} color="var(--accent-cyan)" className="animate-pulse" />
              ) : (
                <UploadCloud size={36} color="var(--text-primary)" />
              )}
            </div>
            
            {!file ? (
              <>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Drop your resume here</h3>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '1rem' }}>PDF or Word document (Max 5MB)</p>
              </>
            ) : (
              <div className="animate-scale-in" style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1rem 2rem', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <File size={24} color="var(--accent-cyan)" />
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{file.name}</span>
                <CheckCircle size={20} color="#10b981" />
              </div>
            )}
            
            <input 
              type="file" 
              id="file-upload" 
              style={{ display: 'none' }} 
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </div>
          
          <div className="animate-fade-in-up stagger-2" style={{ marginTop: '3rem' }}>
            <button 
              className="btn btn-gradient" 
              disabled={!file || analyzing} 
              onClick={(e) => { e.stopPropagation(); startAnalysis(); }}
              style={{ padding: '1.25rem 4rem', fontSize: '1.2rem', opacity: (!file || analyzing) ? 0.5 : 1, width: '100%', maxWidth: '400px' }}
            >
              {analyzing ? 'Running Deep Analysis...' : 'Commence Analysis'}
            </button>
          </div>
        </div>
      ) : (
        <ResultsDashboard 
          data={analysisData} 
          onReset={() => { setResultsReady(false); setFile(null); setAnalysisData(null); }} 
        />
      )}
    </div>
  );
}

function ResultsDashboard({ data, onReset }) {
  if (!data) return null;

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', margin: 0, letterSpacing: '-0.03em' }}>Diagnostic <span className="text-gradient">Report</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.5rem' }}>AI-generated insights based on current market trends.</p>
        </div>
        <button className="btn btn-secondary" onClick={onReset}>Analyze New File</button>
      </div>
      
      <div className="bento-grid">
        {/* Score Card - Large */}
        <div className="glass-panel glass-panel-hover animate-fade-in-up stagger-1" style={{ gridColumn: 'span 12 / span 12', padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '3rem', color: 'var(--text-secondary)' }}>ATS Match Score</h3>
          <div style={{ 
            width: '240px', height: '240px', 
            borderRadius: '50%', 
            background: 'conic-gradient(#10b981 82%, rgba(255,255,255,0.05) 0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 50px rgba(16, 185, 129, 0.15)',
            position: 'relative'
          }}>
            <div style={{ 
              width: '200px', height: '200px', 
              borderRadius: '50%', 
              background: 'var(--bg-base)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.5)'
            }}>
              <span style={{ fontSize: '4rem', fontWeight: 800, color: 'transparent', background: 'linear-gradient(135deg, #10b981, #34d399)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>{data.ats_score}<span style={{fontSize: '2rem'}}>%</span></span>
              <span style={{ color: '#10b981', fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{data.score_label}</span>
            </div>
          </div>
        </div>

        {/* Small metric cards */}
        <div style={{ gridColumn: 'span 12 / span 12', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <DashboardCard 
            icon={<BarChart2 color="var(--accent-cyan)" size={28} />}
            title="Keyword Synergy"
            value={data.keyword_synergy.value}
            desc={data.keyword_synergy.description}
            status={data.keyword_synergy.status}
            delay="stagger-2"
          />
          <DashboardCard 
            icon={<Activity color="var(--accent-blue)" size={28} />}
            title="Structural Integrity"
            value={data.structural_integrity.value}
            desc={data.structural_integrity.description}
            status={data.structural_integrity.status}
            delay="stagger-2"
          />
          <DashboardCard 
            icon={<PieChart color="var(--accent-pink)" size={28} />}
            title="Action Velocity"
            value={data.action_velocity.value}
            desc={data.action_velocity.description}
            status={data.action_velocity.status}
            delay="stagger-3"
          />
          <DashboardCard 
            icon={<CheckCircle color="#10b981" size={28} />}
            title="Metadata"
            value={data.metadata.value}
            desc={data.metadata.description}
            status={data.metadata.status}
            delay="stagger-3"
          />
        </div>

        {/* Wide Recommendations Panel */}
        <div className="glass-panel animate-fade-in-up stagger-4" style={{ gridColumn: 'span 12 / span 12', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--gradient-mesh)' }}></div>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Zap color="var(--accent-purple)" size={28} /> Actionable Directives
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {data.actionable_directives.map((directive, index) => (
              <RecommendationItem 
                key={index}
                title={directive.title} 
                desc={directive.description}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ icon, title, value, desc, status, delay }) {
  const statusColors = {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  };
  
  return (
    <div className={`glass-panel glass-panel-hover animate-fade-in-up ${delay}`} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ background: 'var(--gradient-glass)', padding: '1rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          {icon}
        </div>
        <span style={{ fontSize: '1.5rem', fontWeight: 700, color: statusColors[status], textShadow: `0 0 10px ${statusColors[status]}40` }}>{value}</span>
      </div>
      <div>
        <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{title}</h4>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</p>
      </div>
    </div>
  );
}

function RecommendationItem({ title, desc }) {
  return (
    <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem' }}>
      <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{title}</h4>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}

export default Analyzer;
