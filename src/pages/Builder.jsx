import React, { useState, useRef } from 'react';
import { User, Briefcase, GraduationCap, Code, Download, Eye, X } from 'lucide-react';
import Cropper from 'react-easy-crop';
import html2pdf from 'html2pdf.js';
import { getCroppedImg } from '../utils/cropImage';

function Builder() {
  const [activeTab, setActiveTab] = useState('personal');
  const [showPreview, setShowPreview] = useState(false);
  
  // Photo & Cropping State
  const [photoURL, setPhotoURL] = useState('https://via.placeholder.com/180');
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const previewRef = useRef(null);

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
      setPhotoURL(croppedImage);
      setIsCropping(false);
    } catch (e) {
      console.error(e);
    }
  };

  const exportPDF = () => {
    // If preview is closed, we temporarily open it off-screen? 
    // It's better if we tell the user to open the preview to export it, or we export it directly.
    // Let's just generate it from a hidden container or temporarily show it.
    // For reliability, we will render it hidden always.
    
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
        <div style={{ display: 'flex', gap: '1rem' }}>
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
                <FormGroup label="Legal Name" type="text" placeholder="Richard Sanchez" />
                <FormGroup label="Target Designation" type="text" placeholder="Marketing Manager" />
                <FormGroup label="Primary Email" type="email" placeholder="hello@reallygreatsite.com" />
                <FormGroup label="Contact Number" type="tel" placeholder="+1 (555) 123-4567" />
                <FormGroup label="Professional Network (LinkedIn)" type="url" placeholder="linkedin.com/in/richardsanchez" />
                <FormGroup label="Geographic Location" type="text" placeholder="123 Anywhere St., Any City" />
                <div style={{ gridColumn: '1 / -1' }}>
                  <FormGroup label="Executive Summary" type="textarea" placeholder="Craft a compelling narrative of your professional journey..." rows={5} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="animate-scale-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h2 style={{ margin: 0, fontSize: '2rem' }}>Professional Trajectory</h2>
                <button className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>+ Append Role</button>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '3rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                  <FormGroup label="Role Designation" type="text" placeholder="Marketing Manager & Specialist" />
                  <FormGroup label="Organization" type="text" placeholder="Borcelle Studio" />
                  <FormGroup label="Commencement" type="month" />
                  <FormGroup label="Conclusion" type="text" placeholder="Present" />
                </div>
                <FormGroup label="Impact & Deliverables (Bullet points)" type="textarea" placeholder="- Developed and executed comprehensive marketing strategies..." rows={6} />
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="animate-scale-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h2 style={{ margin: 0, fontSize: '2rem' }}>Academic Credentials</h2>
                <button className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>+ Append Credential</button>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '3rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                  <FormGroup label="Degree Classification" type="text" placeholder="Master of Business Management" />
                  <FormGroup label="Academic Institution" type="text" placeholder="Wardiere University" />
                  <FormGroup label="Conferral Year" type="number" placeholder="2031" />
                  <FormGroup label="Academic Standing (GPA)" type="text" placeholder="3.8 / 4.0" />
                </div>
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
                <FormGroup label="Primary Competencies" type="textarea" placeholder="Project Management, Public Relations, Digital Marketing..." rows={4} />
                <FormGroup label="Secondary Competencies" type="textarea" placeholder="Teamwork, Leadership, Critical Thinking..." rows={4} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 
        HIDDEN RENDER FOR PDF EXPORT 
        This is rendered offscreen so html2pdf can capture it even when preview is closed.
      */}
      <div style={{ position: 'fixed', top: '-9999px', left: '-9999px', visibility: 'hidden' }}>
        <div ref={previewRef} style={{ 
          width: '794px', /* A4 width */
          height: '1123px', /* A4 height */
          background: 'white', 
          color: '#333',
          display: 'flex',
          fontFamily: '"Inter", sans-serif',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          {/* Header Spacer (Absolute positioned to span full width at top) */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '160px',
            backgroundColor: 'white', zIndex: 1
          }}></div>

          {/* Left Sidebar */}
          <div style={{
            width: '32%',
            backgroundColor: '#f4f5f7',
            padding: '160px 2rem 2rem 2rem',
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
          }}>
            {/* Profile Photo */}
            <div style={{
              width: '180px', height: '180px', borderRadius: '50%',
              backgroundColor: '#fff',
              position: 'absolute', top: '40px', left: '50%', transform: 'translateX(-50%)',
              border: '5px solid #e5e7eb',
              overflow: 'hidden',
              display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}>
              <img src={photoURL} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* Contact Info */}
            <div style={{ marginTop: '40px' }}>
              <h3 style={{ fontSize: '1rem', letterSpacing: '2px', color: '#101c56', borderBottom: '2px solid #8ab4f8', paddingBottom: '0.5rem', marginBottom: '1rem' }}>CONTACT</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: '#334155' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><span style={{color: '#e91e63'}}>📞</span> +123-456-7890</div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><span style={{color: '#d8b4e2'}}>✉️</span> hello@reallygreatsite.com</div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><span style={{color: '#e91e63'}}>📍</span> 123 Anywhere St., Any City</div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><span style={{color: '#3b82f6'}}>🌐</span> www.reallygreatsite.com</div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 style={{ fontSize: '1rem', letterSpacing: '2px', color: '#101c56', borderBottom: '2px solid #8ab4f8', paddingBottom: '0.5rem', marginBottom: '1rem' }}>SKILLS</h3>
              <ul style={{ listStylePosition: 'inside', fontSize: '0.85rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: 0, padding: 0 }}>
                <li>Project Management</li>
                <li>Public Relations</li>
                <li>Teamwork</li>
                <li>Time Management</li>
                <li>Leadership</li>
                <li>Effective Communication</li>
              </ul>
            </div>

          </div>

          {/* Right Main Content */}
          <div style={{
            width: '68%',
            backgroundColor: '#ffffff',
            position: 'relative',
            zIndex: 2,
            padding: '50px 3rem 3rem 2rem'
          }}>
            {/* Name and Title (Over the white header) */}
            <div style={{ height: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h1 style={{ margin: 0, fontSize: '2.5rem', letterSpacing: '1px', color: '#f3f4f6', textShadow: '1px 1px 2px rgba(0,0,0,0.2), -1px -1px 2px rgba(255,255,255,0.8)' }}>RICHARD SANCHEZ</h1>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#a5c4f6', fontWeight: 600 }}>Marketing Manager</p>
            </div>

            {/* Main Content Area */}
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Profile */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '25px' }}>
                  <div style={{ width: '25px', height: '25px', borderRadius: '50%', backgroundColor: '#212975', color: '#b9514e', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px', border: '2px solid rgba(0,0,0,0.1)' }}>👤</div>
                  <div style={{ flex: 1, width: '1px', backgroundColor: '#e2e8f0', margin: '5px 0' }}></div>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', letterSpacing: '2px', marginBottom: '0.5rem', color: '#101c56', fontWeight: 700 }}>PROFILE</h3>
                  <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#475569' }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
                  </p>
                </div>
              </div>

              {/* Work Experience */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '25px' }}>
                  <div style={{ width: '25px', height: '25px', borderRadius: '50%', backgroundColor: '#212975', color: '#c97750', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px', border: '2px solid rgba(0,0,0,0.1)' }}>💼</div>
                  <div style={{ flex: 1, width: '1px', backgroundColor: '#e2e8f0', margin: '5px 0' }}></div>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', letterSpacing: '2px', marginBottom: '1rem', color: '#101c56', fontWeight: 700 }}>WORK EXPERIENCE</h3>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a' }}>Borcelle Studio</h4>
                      <span style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: 600 }}>2030 - PRESENT</span>
                    </div>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>Marketing Manager & Specialist</p>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                      <li>Develop and execute comprehensive marketing strategies and campaigns.</li>
                      <li>Lead, mentor, and manage a high-performing marketing team.</li>
                      <li>Monitor brand consistency across marketing channels.</li>
                    </ul>
                  </div>

                  <div style={{ marginBottom: '0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a' }}>Fauget Studio</h4>
                      <span style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: 600 }}>2025 - 2029</span>
                    </div>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>Marketing Manager & Specialist</p>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                      <li>Create and manage the marketing budget, optimizing ROI.</li>
                      <li>Oversee market research to identify emerging trends.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '25px' }}>
                  <div style={{ width: '25px', height: '25px', borderRadius: '50%', backgroundColor: '#212975', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px', border: '2px solid rgba(0,0,0,0.1)' }}>🎓</div>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', letterSpacing: '2px', marginBottom: '1rem', color: '#101c56', fontWeight: 700 }}>EDUCATION</h3>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a' }}>Master of Business Management</h4>
                      <span style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: 600 }}>2029 - 2031</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569' }}>School of business | Wardiere University<br/>GPA: 3.8 / 4.0</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
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
              
              {/* Clone the Resume Paper for visible Preview */}
              <div style={{ 
                width: '794px', /* A4 width */
                minHeight: '1123px', /* A4 height */
                background: 'white', 
                color: '#333',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                position: 'relative',
                display: 'flex',
                fontFamily: '"Inter", sans-serif',
                overflow: 'hidden',
                transform: 'scale(0.85)',
                transformOrigin: 'top center',
                marginBottom: '-15%'
              }}>
                
                {/* Header Spacer (Absolute positioned to span full width at top) */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '160px',
                  backgroundColor: 'white', zIndex: 1
                }}></div>

                {/* Left Sidebar */}
                <div style={{
                  width: '32%',
                  backgroundColor: '#f4f5f7',
                  padding: '160px 2rem 2rem 2rem',
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem'
                }}>
                  {/* Profile Photo */}
                  <div style={{
                    width: '180px', height: '180px', borderRadius: '50%',
                    backgroundColor: '#fff',
                    position: 'absolute', top: '40px', left: '50%', transform: 'translateX(-50%)',
                    border: '5px solid #e5e7eb',
                    overflow: 'hidden',
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                  }}>
                    <img src={photoURL} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  {/* Contact Info */}
                  <div style={{ marginTop: '40px' }}>
                    <h3 style={{ fontSize: '1rem', letterSpacing: '2px', color: '#101c56', borderBottom: '2px solid #8ab4f8', paddingBottom: '0.5rem', marginBottom: '1rem' }}>CONTACT</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: '#334155' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><span style={{color: '#e91e63'}}>📞</span> +123-456-7890</div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><span style={{color: '#d8b4e2'}}>✉️</span> hello@reallygreatsite.com</div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><span style={{color: '#e91e63'}}>📍</span> 123 Anywhere St., Any City</div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><span style={{color: '#3b82f6'}}>🌐</span> www.reallygreatsite.com</div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 style={{ fontSize: '1rem', letterSpacing: '2px', color: '#101c56', borderBottom: '2px solid #8ab4f8', paddingBottom: '0.5rem', marginBottom: '1rem' }}>SKILLS</h3>
                    <ul style={{ listStylePosition: 'inside', fontSize: '0.85rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: 0, padding: 0 }}>
                      <li>Project Management</li>
                      <li>Public Relations</li>
                      <li>Teamwork</li>
                      <li>Time Management</li>
                      <li>Leadership</li>
                      <li>Effective Communication</li>
                    </ul>
                  </div>

                </div>

                {/* Right Main Content */}
                <div style={{
                  width: '68%',
                  backgroundColor: '#ffffff',
                  position: 'relative',
                  zIndex: 2,
                  padding: '50px 3rem 3rem 2rem'
                }}>
                  {/* Name and Title (Over the white header) */}
                  <div style={{ height: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h1 style={{ margin: 0, fontSize: '2.5rem', letterSpacing: '1px', color: '#f3f4f6', textShadow: '1px 1px 2px rgba(0,0,0,0.2), -1px -1px 2px rgba(255,255,255,0.8)' }}>RICHARD SANCHEZ</h1>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#a5c4f6', fontWeight: 600 }}>Marketing Manager</p>
                  </div>

                  {/* Main Content Area */}
                  <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* Profile */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '25px' }}>
                        <div style={{ width: '25px', height: '25px', borderRadius: '50%', backgroundColor: '#212975', color: '#b9514e', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px', border: '2px solid rgba(0,0,0,0.1)' }}>👤</div>
                        <div style={{ flex: 1, width: '1px', backgroundColor: '#e2e8f0', margin: '5px 0' }}></div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.1rem', letterSpacing: '2px', marginBottom: '0.5rem', color: '#101c56', fontWeight: 700 }}>PROFILE</h3>
                        <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#475569' }}>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
                        </p>
                      </div>
                    </div>

                    {/* Work Experience */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '25px' }}>
                        <div style={{ width: '25px', height: '25px', borderRadius: '50%', backgroundColor: '#212975', color: '#c97750', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px', border: '2px solid rgba(0,0,0,0.1)' }}>💼</div>
                        <div style={{ flex: 1, width: '1px', backgroundColor: '#e2e8f0', margin: '5px 0' }}></div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.1rem', letterSpacing: '2px', marginBottom: '1rem', color: '#101c56', fontWeight: 700 }}>WORK EXPERIENCE</h3>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                            <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a' }}>Borcelle Studio</h4>
                            <span style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: 600 }}>2030 - PRESENT</span>
                          </div>
                          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>Marketing Manager & Specialist</p>
                          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                            <li>Develop and execute comprehensive marketing strategies and campaigns.</li>
                            <li>Lead, mentor, and manage a high-performing marketing team.</li>
                            <li>Monitor brand consistency across marketing channels.</li>
                          </ul>
                        </div>

                        <div style={{ marginBottom: '0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                            <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a' }}>Fauget Studio</h4>
                            <span style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: 600 }}>2025 - 2029</span>
                          </div>
                          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>Marketing Manager & Specialist</p>
                          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                            <li>Create and manage the marketing budget, optimizing ROI.</li>
                            <li>Oversee market research to identify emerging trends.</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Education */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '25px' }}>
                        <div style={{ width: '25px', height: '25px', borderRadius: '50%', backgroundColor: '#212975', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px', border: '2px solid rgba(0,0,0,0.1)' }}>🎓</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.1rem', letterSpacing: '2px', marginBottom: '1rem', color: '#101c56', fontWeight: 700 }}>EDUCATION</h3>
                        
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                            <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a' }}>Master of Business Management</h4>
                            <span style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: 600 }}>2029 - 2031</span>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569' }}>School of business | Wardiere University<br/>GPA: 3.8 / 4.0</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FormGroup({ label, type, placeholder, rows }) {
  const inputStyle = {
    width: '100%',
    padding: '0.8rem 1rem',
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid var(--border-color)',
    borderRadius: '0.5rem',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</label>
      {type === 'textarea' ? (
        <textarea 
          placeholder={placeholder} 
          rows={rows || 3} 
          style={{ ...inputStyle, resize: 'vertical' }}
          onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
        />
      ) : (
        <input 
          type={type} 
          placeholder={placeholder} 
          style={inputStyle} 
          onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
        />
      )}
    </div>
  );
}

export default Builder;
