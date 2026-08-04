import React, { useState } from 'react';
import { FileText, Send, Download, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import html2pdf from 'html2pdf.js';

function CoverLetter() {
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session ? session.access_token : '';
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${apiUrl}/api/cover-letter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ job_description: jobDescription })
      });
      
      const data = await response.json();
      if (response.ok) {
        setCoverLetter(data.cover_letter);
      } else {
        setError(data.detail || "Failed to generate cover letter.");
      }
    } catch (e) {
      console.error(e);
      setError("Error connecting to server.");
    } finally {
      setIsGenerating(false);
    }
  };

  const exportPDF = () => {
    const element = document.getElementById('cover-letter-preview');
    if (!element) return;
    
    const opt = {
      margin: 1,
      filename: 'Cover_Letter.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', margin: 0, letterSpacing: '-0.03em' }}>Cover Letter <span className="text-gradient">Generator</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Paste a job description to instantly generate a tailored cover letter using your saved resume data.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
        
        {/* Left Side: Input */}
        <div className="glass-panel animate-scale-in" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={24} className="text-gradient" /> Target Job Description
          </h2>
          <textarea
            placeholder="Paste the full job description here..."
            rows={15}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            style={{
              width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.2)',
              border: '1px solid var(--glass-border)', borderRadius: '0.5rem',
              color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.95rem',
              outline: 'none', transition: 'border-color 0.2s', resize: 'vertical'
            }}
          />
          {error && <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}
          <button 
            className="btn btn-gradient" 
            onClick={handleGenerate} 
            disabled={isGenerating || !jobDescription.trim()} 
            style={{ padding: '1rem', width: '100%', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', border: 'none', cursor: isGenerating ? 'not-allowed' : 'pointer' }}
          >
            {isGenerating ? <Loader2 className="animate-spin" /> : <Send />}
            {isGenerating ? 'Analyzing & Writing...' : 'Generate Cover Letter'}
          </button>
        </div>

        {/* Right Side: Output */}
        <div className="glass-panel animate-scale-in" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={24} className="text-gradient" /> Generated Letter
            </h2>
            <button className="btn btn-secondary" onClick={exportPDF} disabled={!coverLetter} style={{ padding: '0.5rem 1rem' }}>
              <Download size={18} style={{ marginRight: '0.5rem' }} /> Export PDF
            </button>
          </div>
          
          <div style={{ background: 'white', borderRadius: '0.5rem', padding: '2rem', height: '100%', minHeight: '500px', border: '1px solid var(--glass-border)' }}>
            {coverLetter ? (
              <textarea 
                id="cover-letter-preview"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                style={{ 
                  width: '100%', height: '100%', background: 'transparent', border: 'none', 
                  color: 'black', fontFamily: '"Times New Roman", serif', fontSize: '1rem', 
                  resize: 'none', outline: 'none', lineHeight: 1.6 
                }}
              />
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', textAlign: 'center', fontStyle: 'italic' }}>
                Your generated cover letter will appear here.<br/>Make sure you have saved a resume in the Builder first!
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default CoverLetter;
