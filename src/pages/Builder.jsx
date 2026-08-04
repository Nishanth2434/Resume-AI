import React, { useState, useRef, useEffect } from 'react';
import { User, Briefcase, GraduationCap, Code, Download, Eye, X, Trash2, Save, Wand2, Loader2, Link as LinkIcon } from 'lucide-react';
import Cropper from 'react-easy-crop';
import html2pdf from 'html2pdf.js';
import { getCroppedImg } from '../utils/cropImage';
import { supabase } from '../lib/supabase';
import { ModernTemplate, ClassicTemplate, CreativeTemplate } from '../components/ResumeTemplates';

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
  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  // Resume Data State
  const [resumeData, setResumeData] = useState({
    resumeType: 'fresher',
    hasInternship: null,
    personal: { name: '', title: '', email: '', phone: '', linkedin: '', location: '', summary: '', photoURL: 'https://via.placeholder.com/180' },
    experience: [ { role: '', company: '', startDate: '', endDate: '', bullets: '' } ],
    projects: [ { title: '', techStack: '', startDate: '', endDate: '', bullets: '', link: '' } ],
    education: [ { degree: '', institution: '', year: '', gpa: '', coursework: '' } ],
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
          setResumeData({
            resumeType: data.data.resumeType || 'fresher',
            hasInternship: data.data.hasInternship !== undefined ? data.data.hasInternship : null,
            personal: data.data.personal || { name: '', title: '', email: '', phone: '', linkedin: '', location: '', summary: '', photoURL: 'https://via.placeholder.com/180' },
            experience: data.data.experience || [ { role: '', company: '', startDate: '', endDate: '', bullets: '' } ],
            projects: data.data.projects || [ { title: '', techStack: '', startDate: '', endDate: '', bullets: '', link: '' } ],
            education: data.data.education || [ { degree: '', institution: '', year: '', gpa: '', coursework: '' } ],
            skills: data.data.skills || { primary: '', secondary: '' }
          });
        }
      } catch (err) {
        console.error('Error fetching saved resume:', err);
      }
    };
    fetchSavedResume();
  }, []);

  const getTabs = () => {
    let activeTabs = [ { id: 'personal', label: 'Personal Info', icon: <User size={18} /> } ];
    
    if (resumeData.resumeType === 'experienced') {
      activeTabs.push({ id: 'experience', label: 'Experience', icon: <Briefcase size={18} /> });
      activeTabs.push({ id: 'education', label: 'Education', icon: <GraduationCap size={18} /> });
      activeTabs.push({ id: 'skills', label: 'Skills', icon: <Code size={18} /> });
    } else {
      if (resumeData.hasInternship === true) {
        activeTabs.push({ id: 'experience', label: 'Internship', icon: <Briefcase size={18} /> });
      }
      if (resumeData.hasInternship !== null) {
        activeTabs.push({ id: 'projects', label: 'Projects', icon: <Code size={18} /> });
        activeTabs.push({ id: 'education', label: 'Education', icon: <GraduationCap size={18} /> });
        activeTabs.push({ id: 'skills', label: 'Skills', icon: <Code size={18} /> });
      }
    }
    return activeTabs;
  };

  const tabs = getTabs();

  const handleResumeTypeChange = (type) => {
    setResumeData(prev => ({ ...prev, resumeType: type, hasInternship: null }));
    setActiveTab('personal');
  };

  const handleInternshipToggle = (hasInternship) => {
    setResumeData(prev => {
      const newData = { ...prev, hasInternship };
      if (!hasInternship) {
        newData.experience = [];
      } else if (newData.experience.length === 0) {
        newData.experience = [{ role: '', company: '', startDate: '', endDate: '', bullets: '' }];
      }
      return newData;
    });
  };

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
      margin: 0,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { avoid: 'all' }
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

  const handleProjectChange = (index, field, value) => {
    const newProj = [...resumeData.projects];
    newProj[index][field] = value;
    setResumeData({ ...resumeData, projects: newProj });
  };

  const handleRewrite = async (index, type) => {
    const textToRewrite = type === 'experience' ? resumeData.experience[index].bullets : resumeData.projects[index].bullets;
    if (!textToRewrite) return;
    
    setIsRewriting(type + index);
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
        if (type === 'experience') handleExperienceChange(index, 'bullets', data.rewritten);
        else handleProjectChange(index, 'bullets', data.rewritten);
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

  const appendProject = () => {
    setResumeData({
      ...resumeData,
      projects: [...resumeData.projects, { title: '', techStack: '', startDate: '', endDate: '', bullets: '', link: '' }]
    });
  };

  const removeProject = (index) => {
    const newProj = resumeData.projects.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, projects: newProj });
  };

  const handleEducationChange = (index, field, value) => {
    const newEdu = [...resumeData.education];
    newEdu[index][field] = value;
    setResumeData({ ...resumeData, education: newEdu });
  };

  const appendEducation = () => {
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, { degree: '', institution: '', year: '', gpa: '', coursework: '' }]
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
          <select value={selectedTemplate} onChange={(e) => { setSelectedTemplate(e.target.value); setResumeData(prev => ({...prev, template: e.target.value})); }} style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)' }}>
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
        <div className="glass-panel animate-fade-in-up stagger-1 col-12 lg-col-3 bento-inner" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Fresher/Experienced Toggle */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', borderRadius: '0.75rem', padding: '0.3rem', marginBottom: '1rem' }}>
            <button 
              onClick={() => handleResumeTypeChange('fresher')}
              style={{ flex: 1, padding: '0.6rem', borderRadius: '0.5rem', background: resumeData.resumeType === 'fresher' ? 'var(--accent-primary)' : 'transparent', color: resumeData.resumeType === 'fresher' ? '#fff' : 'var(--text-secondary)', border: 'none', fontWeight: 600, transition: 'all 0.2s', cursor: 'pointer' }}
            >Fresher</button>
            <button 
              onClick={() => handleResumeTypeChange('experienced')}
              style={{ flex: 1, padding: '0.6rem', borderRadius: '0.5rem', background: resumeData.resumeType === 'experienced' ? 'var(--accent-primary)' : 'transparent', color: resumeData.resumeType === 'experienced' ? '#fff' : 'var(--text-secondary)', border: 'none', fontWeight: 600, transition: 'all 0.2s', cursor: 'pointer' }}
            >Experienced</button>
          </div>

          {/* Sidebar Tabs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
        </div>

        {/* Form Area */}
        <div className="glass-panel animate-fade-in-up stagger-2 col-12 lg-col-9 bento-inner-lg">
          
          {/* Internship Prompt for Freshers */}
          {resumeData.resumeType === 'fresher' && resumeData.hasInternship === null && (
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--accent-primary)', padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', marginBottom: '2rem' }}>
              <h3 style={{ margin: '0 0 1rem 0' }}>Have you completed any internships?</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>This helps us tailor your resume format to highlight the best aspects of your background.</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button className="btn btn-primary" onClick={() => handleInternshipToggle(true)} style={{ padding: '0.75rem 2rem' }}>Yes</button>
                <button className="btn btn-secondary" onClick={() => handleInternshipToggle(false)} style={{ padding: '0.75rem 2rem' }}>No</button>
              </div>
            </div>
          )}

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
                <h2 style={{ margin: 0, fontSize: '2rem' }}>{resumeData.resumeType === 'fresher' ? 'Internships' : 'Professional Trajectory'}</h2>
                <button className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }} onClick={appendExperience}>+ Append {resumeData.resumeType === 'fresher' ? 'Internship' : 'Role'}</button>
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
                      <FormGroup label={resumeData.resumeType === 'fresher' ? 'Intern Role' : 'Role Designation'} type="text" placeholder="Marketing Intern" value={exp.role} onChange={(e) => handleExperienceChange(index, 'role', e.target.value)} />
                      <FormGroup label="Organization" type="text" placeholder="Borcelle Studio" value={exp.company} onChange={(e) => handleExperienceChange(index, 'company', e.target.value)} />
                      <FormGroup label="Commencement" type="text" placeholder="e.g. Jan 2023" value={exp.startDate} onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)} />
                      <FormGroup label="Conclusion" type="text" placeholder="Present" value={exp.endDate} onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)} />
                    </div>
                    <div style={{ position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Impact & Deliverables (Bullet points)</span>
                        <button onClick={() => handleRewrite(index, 'experience')} disabled={isRewriting === 'experience' + index} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'var(--gradient-mesh)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {isRewriting === 'experience' + index ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />} 
                          {isRewriting === 'experience' + index ? 'Rewriting...' : 'AI Magic Rewrite'}
                        </button>
                      </div>
                      <FormGroup type="textarea" placeholder="- Developed and executed comprehensive strategies..." rows={6} value={exp.bullets} onChange={(e) => handleExperienceChange(index, 'bullets', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="animate-scale-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h2 style={{ margin: 0, fontSize: '2rem' }}>Projects</h2>
                <button className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }} onClick={appendProject}>+ Append Project</button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {resumeData.projects.map((proj, index) => (
                  <div key={index} style={{ background: 'rgba(255,255,255,0.02)', padding: '3rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                    {resumeData.projects.length > 1 && (
                      <button onClick={() => removeProject(index)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                        <Trash2 size={20} />
                      </button>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                      <FormGroup label="Project Title" type="text" placeholder="E-Commerce App" value={proj.title} onChange={(e) => handleProjectChange(index, 'title', e.target.value)} />
                      <FormGroup label="Tech Stack" type="text" placeholder="React, Node.js, MongoDB" value={proj.techStack} onChange={(e) => handleProjectChange(index, 'techStack', e.target.value)} />
                      <FormGroup label="Commencement" type="text" placeholder="e.g. Jan 2023" value={proj.startDate} onChange={(e) => handleProjectChange(index, 'startDate', e.target.value)} />
                      <FormGroup label="Conclusion" type="text" placeholder="Present" value={proj.endDate} onChange={(e) => handleProjectChange(index, 'endDate', e.target.value)} />
                      <div style={{ gridColumn: '1 / -1' }}>
                        <FormGroup label="Live Link / GitHub URL" type="url" placeholder="https://github.com/my-project" value={proj.link} onChange={(e) => handleProjectChange(index, 'link', e.target.value)} />
                      </div>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>What did you build? (Bullet points)</span>
                        <button onClick={() => handleRewrite(index, 'project')} disabled={isRewriting === 'project' + index} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'var(--gradient-mesh)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {isRewriting === 'project' + index ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />} 
                          {isRewriting === 'project' + index ? 'Rewriting...' : 'AI Magic Rewrite'}
                        </button>
                      </div>
                      <FormGroup type="textarea" placeholder="- Developed a scalable backend..." rows={6} value={proj.bullets} onChange={(e) => handleProjectChange(index, 'bullets', e.target.value)} />
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
                      
                      {resumeData.resumeType === 'fresher' && (
                        <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                          <FormGroup label="Relevant Coursework" type="textarea" placeholder="Data Structures, Algorithms, Machine Learning..." rows={3} value={edu.coursework || ''} onChange={(e) => handleEducationChange(index, 'coursework', e.target.value)} />
                        </div>
                      )}
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
          <ResumePreview data={resumeData} photoURL={resumeData.personal.photoURL} template={selectedTemplate} />
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
                <ResumePreview data={resumeData} photoURL={resumeData.personal.photoURL} template={selectedTemplate} />
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
  switch (template) {
    case 'classic':
      return <ClassicTemplate data={data} photoURL={photoURL} />;
    case 'creative':
      return <CreativeTemplate data={data} photoURL={photoURL} />;
    case 'modern':
    default:
      return <ModernTemplate data={data} photoURL={photoURL} />;
  }
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
