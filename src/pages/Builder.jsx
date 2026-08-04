import React, { useState, useRef, useEffect } from 'react';
import { User, Briefcase, GraduationCap, Code, Download, Eye, X, Trash2, Save, Wand2, Loader2 } from 'lucide-react';
import Cropper from 'react-easy-crop';
import html2pdf from 'html2pdf.js';
import { getCroppedImg } from '../utils/cropImage';
import { supabase } from '../lib/supabase';

function Builder() {
  const [activeTab, setActiveTab] = useState('personal');
  const [showPreview, setShowPreview] = useState(false);
  
  // Photo & Cropping State
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRewriting, setIsRewriting] = useState(null);
  const [template, setTemplate] = useState('modern');

  // Resume Data State
  const [resumeData, setResumeData] = useState({
    personal: { name: '', title: '', email: '', phone: '', linkedin: '', location: '', summary: '', photoURL: 'https://via.placeholder.com/180' },
    experience: [ { role: '', company: '', startDate: '', endDate: '', bullets: '' } ],
    education: [ { degree: '', institution: '', year: '', gpa: '' } ],
    skills: { primary: '', secondary: '' }
  });

  const previewRef = useRef(null);

  useEffect(() => {
    const fetchSavedResume = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      try {
        const { data, error } = await supabase
          .from('resumes')
          .select('data')
          .eq('user_id', session.user.id)
          .single();
          
        if (data && data.data) {
          setResumeData(data.data);
        }
      } catch (err) {
        console.error('Error fetching saved resume:', err);
      }
    };
    fetchSavedResume();
  }, []);

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <User size={18} /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase size={18} /> },
    { id: 'education', label: 'Education', icon: <GraduationCap size={18} /> },
    { id: 'skills', label: 'Skills', icon: <Code size={18} /> },
  ];

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result);
        setIsCropping(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setResumeData({ ...resumeData, personal: { ...resumeData.personal, photoURL: croppedImage } });
      setIsCropping(false);
    } catch (e) {
      console.error(e);
    }
  };

  const saveResume = async () => {
    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Please log in to save your resume.");
        return;
      }
      
      const { error } = await supabase.from('resumes').upsert({
        user_id: session.user.id,
        data: resumeData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      
      if (error) throw error;
      alert("Resume saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Error saving resume: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const exportPDF = () => {
    const element = previewRef.current;
    
    const opt = {
      margin:       0,
      filename:     'Resume.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const handlePersonalChange = (field, value) => {
    setResumeData({ ...resumeData, personal: { ...resumeData.personal, [field]: value } });
  };

  const handleExperienceChange = (index, field, value) => {
    const newExp = [...resumeData.experience];
    newExp[index][field] = value;
    setResumeData({ ...resumeData, experience: newExp });
  };

  const handleRewrite = async (index) => {
    const textToRewrite = resumeData.experience[index].bullets;
    if (!textToRewrite) return;
    
    setIsRewriting(index);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session ? session.access_token : '';
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${apiUrl}/api/rewrite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bullet: textToRewrite })
      });
      
      if (response.ok) {
        const data = await response.json();
        handleExperienceChange(index, 'bullets', data.rewritten);
      } else {
        alert("Rewrite failed. Check your login and try again.");
      }
    } catch (e) {
      console.error(e);
      alert("Error: " + e.message);
    } finally {
      setIsRewriting(null);
    }
  };

  const appendExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, { role: '', company: '', startDate: '', endDate: '', bullets: '' }]
    });
  };

  const removeExperience = (index) => {
    const newExp = resumeData.experience.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, experience: newExp });
  };

  const handleEducationChange = (index, field, value) => {
    const newEdu = [...resumeData.education];
    newEdu[index][field] = value;
    setResumeData({ ...resumeData, education: newEdu });
  };

  const appendEducation = () => {
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, { degree: '', institution: '', year: '', gpa: '' }]
    });
  };

  const removeEducation = (index) => {
    const newEdu = resumeData.education.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, education: newEdu });
  };

  const handleSkillsChange = (field, value) => {
    setResumeData({ ...resumeData, skills: { ...resumeData.skills, [field]: value } });
  };

  return (
    <div className="container" style={{ padding: '2rem' }}>
      
      {/* Photo Crop Modal */}
      {isCropping && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.9)', zIndex: 9999,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ position: 'relative', width: '100%', height: '70vh' }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button className="btn btn-secondary" onClick={() => setIsCropping(false)}>Cancel</button>
            <button className="btn btn-gradient" onClick={showCroppedImage}>Apply Crop</button>
          </div>
        </div>
      )}

      <div className="animate-fade-in-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '3rem', margin: 0, letterSpacing: '-0.03em' }}>Resume <span className="text-gradient">Studio</span></h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Engineer a recruiter-approved document.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select value={template} onChange={(e) => setTemplate(e.target.value)} style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <option value="modern" style={{color:'black'}}>Modern Template</option>
            <option value="classic" style={{color:'black'}}>Classic Executive</option>
            <option value="creative" style={{color:'black'}}>Creative Template</option>
          </select>
          <button className="btn btn-secondary" onClick={saveResume} disabled={isSaving} style={{ padding: '0.75rem 1.5rem' }}>
            <Save size={18} style={{ marginRight: '0.5rem' }} /> {isSaving ? 'Saving...' : 'Save Resume'}
          </button>
          <button className="btn btn-secondary" onClick={() => setShowPreview(true)}><Eye size={18} /> View Template</button>
          <button className="btn btn-gradient" onClick={exportPDF}><Download size={18} /> Export PDF</button>
        </div>
      </div>

      <div className="bento-grid" style={{ minHeight: '700px' }}>
        {/* Sidebar Tabs */}
        <div className="glass-panel animate-fade-in-up stagger-1 col-12 lg-col-3 bento-inner" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1.25rem', borderRadius: '1rem',
                background: activeTab === tab.id ? 'var(--gradient-glass)' : 'transparent',
                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: activeTab === tab.id ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                textAlign: 'left',
                transition: 'all 0.3s var(--ease-spring)',
                fontWeight: activeTab === tab.id ? 600 : 500,
                boxShadow: activeTab === tab.id ? '0 10px 20px rgba(0,0,0,0.2)' : 'none'
              }}
            >
              <div style={{ color: activeTab === tab.id ? 'var(--accent-cyan)' : 'inherit' }}>
                {tab.icon}
              </div>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Area */}
        <div className="glass-panel animate-fade-in-up stagger-2 col-12 lg-col-9 bento-inner-lg">
          {activeTab === 'personal' && (
            <div className="animate-scale-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h2 style={{ margin: 0, fontSize: '2rem' }}>Personal Identity</h2>
                <div>
                  <input type="file" id="photo-upload" accept="image/*" style={{ display: 'none' }} onChange={onFileChange} />
                  <label htmlFor="photo-upload" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', cursor: 'pointer' }}>
                    + Upload Headshot
                  </label>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <FormGroup label="Legal Name" type="text" placeholder="Richard Sanchez" value={resumeData.personal.name} onChange={(e) => handlePersonalChange('name', e.target.value)} />
                <FormGroup label="Target Designation" type="text" placeholder="Marketing Manager" value={resumeData.personal.title} onChange={(e) => handlePersonalChange('title', e.target.value)} />
                <FormGroup label="Primary Email" type="email" placeholder="hello@reallygreatsite.com" value={resumeData.personal.email} onChange={(e) => handlePersonalChange('email', e.target.value)} />
                <FormGroup label="Contact Number" type="tel" placeholder="+1 (555) 123-4567" value={resumeData.personal.phone} onChange={(e) => handlePersonalChange('phone', e.target.value)} />
                <FormGroup label="Professional Network (LinkedIn)" type="url" placeholder="linkedin.com/in/richardsanchez" value={resumeData.personal.linkedin} onChange={(e) => handlePersonalChange('linkedin', e.target.value)} />
                <FormGroup label="Geographic Location" type="text" placeholder="123 Anywhere St., Any City" value={resumeData.personal.location} onChange={(e) => handlePersonalChange('location', e.target.value)} />
                <div style={{ gridColumn: '1 / -1' }}>
                  <FormGroup label="Executive Summary" type="textarea" placeholder="Craft a compelling narrative of your professional journey..." rows={5} value={resumeData.personal.summary} onChange={(e) => handlePersonalChange('summary', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="animate-scale-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h2 style={{ margin: 0, fontSize: '2rem' }}>Professional Trajectory</h2>
                <button className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }} onClick={appendExperience}>+ Append Role</button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {resumeData.experience.map((exp, index) => (
                  <div key={index} style={{ background: 'rgba(255,255,255,0.02)', padding: '3rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                    {resumeData.experience.length > 1 && (
                      <button onClick={() => removeExperience(index)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                        <Trash2 size={20} />
                      </button>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                      <FormGroup label="Role Designation" type="text" placeholder="Marketing Manager" value={exp.role} onChange={(e) => handleExperienceChange(index, 'role', e.target.value)} />
                      <FormGroup label="Organization" type="text" placeholder="Borcelle Studio" value={exp.company} onChange={(e) => handleExperienceChange(index, 'company', e.target.value)} />
                      <FormGroup label="Commencement" type="month" value={exp.startDate} onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)} />
                      <FormGroup label="Conclusion" type="text" placeholder="Present" value={exp.endDate} onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)} />
                    </div>
                      <div style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Impact & Deliverables (Bullet points)</span>
                          <button onClick={() => handleRewrite(index)} disabled={isRewriting === index} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'var(--gradient-mesh)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            {isRewriting === index ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />} 
                            {isRewriting === index ? 'Rewriting...' : 'AI Magic Rewrite'}
                          </button>
                        </div>
                        <FormGroup type="textarea" placeholder="- Developed and executed comprehensive marketing strategies..." rows={6} value={exp.bullets} onChange={(e) => handleExperienceChange(index, 'bullets', e.target.value)} />
                      </div>
                    </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="animate-scale-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h2 style={{ margin: 0, fontSize: '2rem' }}>Academic Credentials</h2>
                <button className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }} onClick={appendEducation}>+ Append Credential</button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {resumeData.education.map((edu, index) => (
                  <div key={index} style={{ background: 'rgba(255,255,255,0.02)', padding: '3rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                    {resumeData.education.length > 1 && (
                      <button onClick={() => removeEducation(index)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                        <Trash2 size={20} />
                      </button>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                      <FormGroup label="Degree Classification" type="text" placeholder="Master of Business Management" value={edu.degree} onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} />
                      <FormGroup label="Academic Institution" type="text" placeholder="Wardiere University" value={edu.institution} onChange={(e) => handleEducationChange(index, 'institution', e.target.value)} />
                      <FormGroup label="Conferral Year" type="number" placeholder="2031" value={edu.year} onChange={(e) => handleEducationChange(index, 'year', e.target.value)} />
                      <FormGroup label="Academic Standing (GPA)" type="text" placeholder="3.8 / 4.0" value={edu.gpa} onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="animate-scale-in">
              <h2 style={{ margin: 0, fontSize: '2rem', marginBottom: '1rem' }}>Technical & Core Competencies</h2>
              <p style={{ color: 'var(--text-tertiary)', marginBottom: '3rem', fontSize: '1.1rem' }}>
                Delineate your skills using comma separation.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                <FormGroup label="Primary Competencies" type="textarea" placeholder="Project Management, Public Relations, Digital Marketing..." rows={4} value={resumeData.skills.primary} onChange={(e) => handleSkillsChange('primary', e.target.value)} />
                <FormGroup label="Secondary Competencies" type="textarea" placeholder="Teamwork, Leadership, Critical Thinking..." rows={4} value={resumeData.skills.secondary} onChange={(e) => handleSkillsChange('secondary', e.target.value)} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* HIDDEN RENDER FOR PDF EXPORT */}
      <div style={{ position: 'fixed', top: '-9999px', left: '-9999px', visibility: 'hidden' }}>
        <div ref={previewRef}>
          <ResumePreview data={resumeData} photoURL={resumeData.personal.photoURL} template={template} />
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: '2rem'
        }}>
          <div className="glass-panel animate-slide-up" style={{ width: '100%', maxWidth: '850px', height: '90vh', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Resume Preview</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-gradient" onClick={exportPDF} style={{ padding: '0.5rem 1rem' }}><Download size={16} /> Export PDF</button>
                <button className="btn btn-outline" onClick={() => setShowPreview(false)} style={{ padding: '0.5rem 1rem' }}><X size={16} /> Close</button>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', background: '#d1d5db', display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
              <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center', marginBottom: '-15%' }}>
                <ResumePreview data={resumeData} photoURL={resumeData.personal.photoURL} template={template} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Extracted Component for Resume Rendering
function ResumePreview({ data, photoURL, template }) {
  const p = data.personal;
  const primarySkills = data.skills.length > 0 ? data.skills.filter(s => s.trim()) : ['Project Management', 'Public Relations', 'Teamwork', 'Time Management', 'Leadership', 'Effective Communication'];
  
  const themeConfig = {
    modern: { sidebar: '#e5e7eb', sidebarText: '#475569', mainHeader: '#353945', headerText: '#ffffff', font: '""Inter"", sans-serif', accent: '#3b82f6', rightBg: '#ffffff' },
    classic: { sidebar: '#ffffff', sidebarText: '#000000', mainHeader: '#ffffff', headerText: '#000000', font: '""Times New Roman"", serif', accent: '#000000', border: '1px solid #ccc', rightBg: '#ffffff' },
    creative: { sidebar: '#fce7f3', sidebarText: '#831843', mainHeader: '#db2777', headerText: '#ffffff', font: '""Outfit"", sans-serif', accent: '#db2777', rightBg: '#fff1f2' }
  };
  const t = themeConfig[template] || themeConfig.modern;

  return (
    <div id="resume-preview-container" style={{ 
      width: '794px', minHeight: '1123px', background: t.rightBg, color: '#333',
      display: 'flex', fontFamily: t.font, overflow: 'hidden',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)', boxSizing: 'border-box'
    }}>

      {/* Left Sidebar */}
      <div style={{
        width: '32%', backgroundColor: t.sidebar, padding: '40px 2rem 2rem 2rem',
        borderRight: t.border || 'none', display: 'flex', flexDirection: 'column', gap: '2rem'
      }}>
        {photoURL ? (
          <div style={{
            width: '180px', height: '180px', borderRadius: '50%', backgroundColor: '#fff',
            margin: '0 auto', border: "6px solid " + t.sidebar, boxShadow: '0 4px 10px rgba(0,0,0,0.1)', overflow: 'hidden',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            <img src={photoURL} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ) : (
          <div style={{ height: '140px' }}></div>
        )}

        <div style={{ marginTop: photoURL ? '10px' : '0' }}>
          <h3 style={{ fontSize: '1rem', letterSpacing: '2px', color: t.accent, borderBottom: "2px solid " + t.accent, paddingBottom: '0.5rem', marginBottom: '1rem', fontWeight: 700 }}>CONTACT</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: t.sidebarText }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><span style={{color: t.accent}}>&#9742;</span> {p.phone || '+123-456-7890'}</div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', wordBreak: 'break-all' }}><span style={{color: t.accent}}>&#9993;</span> {p.email || 'hello@reallygreatsite.com'}</div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><span style={{color: t.accent}}>&#9906;</span> {p.location || '123 Anywhere St., Any City'}</div>
            {p.linkedin && <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', wordBreak: 'break-all' }}><span style={{color: t.accent}}>in</span> {p.linkedin}</div>}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1rem', letterSpacing: '2px', color: t.accent, borderBottom: "2px solid " + t.accent, paddingBottom: '0.5rem', marginBottom: '1rem', fontWeight: 700 }}>SKILLS</h3>
          <ul style={{ listStylePosition: 'inside', fontSize: '0.85rem', color: t.sidebarText, display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: 0, padding: 0 }}>
            {primarySkills.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Main Content */}
      <div style={{ width: '68%', display: 'flex', flexDirection: 'column' }}>
        {/* Header Block */}
        <div style={{ 
          backgroundColor: t.mainHeader, padding: '50px 3rem 40px 2rem', 
          borderBottom: t.border ? '1px solid #ccc' : 'none'
        }}>
          <h1 style={{ margin: 0, fontSize: '2.8rem', letterSpacing: '2px', color: t.headerText, textTransform: 'uppercase', fontWeight: 800 }}>
            {p.name || 'RICHARD SANCHEZ'}
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.2rem', letterSpacing: '3px', textTransform: 'uppercase', color: t.accent, fontWeight: 600 }}>
            {p.title || 'Marketing Manager'}
          </p>
        </div>

        {/* Content Block */}
        <div style={{ padding: '3rem 3rem 3rem 2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.2rem', letterSpacing: '2px', marginBottom: '0.5rem', color: t.accent, fontWeight: 700, borderBottom: "1px solid " + t.accent, paddingBottom: '0.5rem' }}>PROFILE</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#333', whiteSpace: 'pre-line', marginTop: '1rem' }}>
                {p.summary || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.2rem', letterSpacing: '2px', marginBottom: '1rem', color: t.accent, fontWeight: 700, borderBottom: "1px solid " + t.accent, paddingBottom: '0.5rem' }}>WORK EXPERIENCE</h3>
              
              {data.experience.length === 1 && !data.experience[0].role ? (
                <div style={{ marginBottom: '1.5rem', marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', color: '#111', fontWeight: 700 }}>Borcelle Studio</h4>
                    <span style={{ fontSize: '0.85rem', color: t.accent, fontWeight: 600 }}>2030 - PRESENT</span>
                  </div>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#444', fontStyle: 'italic' }}>Marketing Manager & Specialist</p>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#333', lineHeight: 1.5 }}>
                    <li>Develop and execute comprehensive marketing strategies and campaigns.</li>
                    <li>Lead, mentor, and manage a high-performing marketing team.</li>
                  </ul>
                </div>
              ) : (
                data.experience.map((exp, idx) => (
                  <div key={idx} style={{ marginBottom: '1.5rem', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: '#111', fontWeight: 700 }}>{exp.company || 'Company'}</h4>
                      <span style={{ fontSize: '0.85rem', color: t.accent, fontWeight: 600 }}>{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#444', fontStyle: 'italic' }}>{exp.role}</p>
                    {exp.bullets && (
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#333', lineHeight: 1.5 }}>
                        {exp.bullets.split('\n').filter(b => b.trim()).map((bullet, bIdx) => (
                          <li key={bIdx}>{bullet.replace(/^-/, '').trim()}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.2rem', letterSpacing: '2px', marginBottom: '1rem', color: t.accent, fontWeight: 700, borderBottom: "1px solid " + t.accent, paddingBottom: '0.5rem' }}>EDUCATION</h3>
              
              {data.education.length === 1 && !data.education[0].degree ? (
                <div style={{ marginBottom: '1rem', marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', color: '#111', fontWeight: 700 }}>Master of Business Management</h4>
                    <span style={{ fontSize: '0.85rem', color: t.accent, fontWeight: 600 }}>2031</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#333' }}>Wardiere University<br/>GPA: 3.8 / 4.0</p>
                </div>
              ) : (
                data.education.map((edu, idx) => (
                  <div key={idx} style={{ marginBottom: '1rem', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: '#111', fontWeight: 700 }}>{edu.degree || 'Degree'}</h4>
                      <span style={{ fontSize: '0.85rem', color: t.accent, fontWeight: 600 }}>{edu.year}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#333' }}>{edu.institution}{edu.gpa ? <><br/>GPA: {edu.gpa}</> : null}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


function FormGroup({ label, type, placeholder, rows, value, onChange }) {
  const inputStyle = {
    width: '100%', padding: '0.8rem 1rem', background: 'rgba(0,0,0,0.2)',
    border: '1px solid var(--border-color)', borderRadius: '0.5rem',
    color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.95rem',
    outline: 'none', transition: 'border-color 0.2s',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</label>
      {type === 'textarea' ? (
        <textarea 
          placeholder={placeholder} rows={rows || 3} 
          style={{ ...inputStyle, resize: 'vertical' }}
          value={value} onChange={onChange}
          onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
        />
      ) : (
        <input 
          type={type} placeholder={placeholder} style={inputStyle} 
          value={value} onChange={onChange}
          onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
        />
      )}
    </div>
  );
}

export default Builder;
