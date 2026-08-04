import React from 'react';
import { Briefcase, GraduationCap, Code, User } from 'lucide-react';

const DUMMY = {
  experience: [
    { company: 'Tech Innovators Inc.', role: 'Senior Developer', startDate: '2020', endDate: 'Present', bullets: 'Led development of core features serving 10M+ users.\nMentored junior engineers and conducted daily code reviews.\nOptimized database queries reducing latency by 40%.' },
    { company: 'Creative Solutions LLC', role: 'Software Engineer', startDate: '2017', endDate: '2020', bullets: 'Built scalable microservices using Node.js and Docker.\nCollaborated with product designers to implement responsive UIs.\nReduced deployment time by 50% via CI/CD pipelines.' }
  ],
  projects: [
    { title: 'E-Commerce Platform', techStack: 'React, Node.js, MongoDB', startDate: 'Jan 2023', endDate: 'May 2023', bullets: 'Built a full-stack e-commerce solution with dynamic cart management.\nIntegrated Stripe for secure payment processing and fraud detection.', link: 'github.com/project-ecommerce' },
    { title: 'AI Resume Analyzer', techStack: 'Python, FastAPI, React', startDate: 'Aug 2023', endDate: 'Present', bullets: 'Developed an AI tool to parse and score resumes against job descriptions.\nUtilized natural language processing for keyword matching.', link: 'github.com/resume-ai' }
  ],
  education: [
    { institution: 'State University', degree: 'M.S. Computer Science', year: '2017', gpa: '3.9', coursework: 'Advanced Algorithms, Machine Learning' },
    { institution: 'State University', degree: 'B.S. Computer Science', year: '2015', gpa: '3.8', coursework: 'Data Structures, Software Engineering' }
  ],
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'Agile', 'Docker', 'AWS'],
  summary: 'Passionate and results-driven professional with a strong background in software development. Proven ability to lead projects from concept to deployment, ensuring high quality and performance while collaborating with cross-functional teams.'
};

// Helper: Calculate scale based on content volume
function calculateScale(data) {
  let score = 0;
  const p = data.personal || {};
  if (p.summary) score += p.summary.length / 200;
  
  const exps = data.experience?.filter(e => e.role) || [];
  score += exps.length * 1.5;
  exps.forEach(e => {
    if (e.bullets) score += Math.min(e.bullets.split('\n').filter(b=>b.trim()).length, 3) * 0.4;
  });

  const projs = data.resumeType === 'fresher' ? (data.projects?.filter(e => e.title) || []) : [];
  score += projs.length * 1.5;
  projs.forEach(e => {
    if (e.bullets) score += Math.min(e.bullets.split('\n').filter(b=>b.trim()).length, 3) * 0.4;
  });

  const edus = data.education?.filter(e => e.degree) || [];
  score += edus.length * 0.8;

  if (score <= 6) return 1.0;
  if (score <= 8) return 0.95;
  if (score <= 10) return 0.90;
  if (score <= 12) return 0.85;
  return 0.80;
}

// Helper: Truncate bullets
function getBullets(bulletsStr, max = 3) {
  if (!bulletsStr) return [];
  return bulletsStr.split('\n').filter(b => b.trim()).map(b => b.replace(/^-/, '').trim()).slice(0, max);
}

// Helper: Photo Placeholder
function PhotoPlaceholder({ name, size, bg, color, border, rounded }) {
  const initials = (name || 'JD').substring(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, backgroundColor: bg, color: color,
      borderRadius: rounded, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: `calc(${size} / 2.5)`, fontWeight: 'bold', border: border, flexShrink: 0,
      boxSizing: 'border-box'
    }}>
      {initials}
    </div>
  );
}

// A4 Wrapper
function A4Wrapper({ children }) {
  return (
    <div style={{
      width: '210mm', height: '297mm', overflow: 'hidden', position: 'relative',
      background: '#fff', boxSizing: 'border-box', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    }}>
      {children}
    </div>
  );
}

// --- MODERN TEMPLATE (2-Column) ---
export function ModernTemplate({ data, photoURL }) {
  const p = data.personal || {};
  
  const primarySkills = data.skills?.primary ? data.skills.primary.split(',').filter(s => s.trim()) : DUMMY.skills;
  const summary = p.summary || DUMMY.summary;
  const expData = data.experience?.some(e => e.role) ? data.experience : DUMMY.experience;
  const projData = data.projects?.some(p => p.title) ? data.projects : DUMMY.projects;
  const eduData = data.education?.some(e => e.degree) ? data.education : DUMMY.education;
  
  const isFresher = data.resumeType === 'fresher';
  const hasIntern = data.hasInternship === true;
  
  const scale = calculateScale(data);
  const t = { sidebar: '#e5e7eb', sidebarText: '#475569', mainHeader: '#353945', headerText: '#ffffff', font: '"Inter", sans-serif', accent: '#3b82f6', rightBg: '#ffffff' };

  return (
    <A4Wrapper>
      <div style={{
        display: 'flex', width: `${100/scale}%`, height: `${100/scale}%`, 
        transform: `scale(${scale})`, transformOrigin: 'top left',
        fontFamily: t.font, color: '#333'
      }}>
        {/* Sidebar */}
        <div style={{ width: '32%', backgroundColor: t.sidebar, padding: '40px 2rem', display: 'flex', flexDirection: 'column', gap: '2rem', boxSizing: 'border-box' }}>
          {photoURL ? (
            <div style={{ width: '160px', height: '160px', borderRadius: '24px', margin: '0 auto', border: `4px solid ${t.sidebar}`, boxShadow: '0 4px 10px rgba(0,0,0,0.1)', overflow: 'hidden', flexShrink: 0 }}>
              <img src={photoURL} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <div style={{ margin: '0 auto' }}>
              <PhotoPlaceholder name={p.name} size="160px" bg="#cbd5e1" color="#475569" rounded="24px" border={`4px solid ${t.sidebar}`} />
            </div>
          )}

          <div>
            <h3 style={{ fontSize: '1.2rem', letterSpacing: '2px', color: t.accent, borderBottom: `2px solid ${t.accent}`, paddingBottom: '0.25rem', marginBottom: '1rem', fontWeight: 700 }}>CONTACT</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '1rem', color: t.sidebarText, lineHeight: 1.4 }}>
              <div><span style={{color: t.accent, marginRight: '8px'}}>&#9742;</span>{p.phone || '+1 234 567 890'}</div>
              <div style={{ wordBreak: 'break-all' }}><span style={{color: t.accent, marginRight: '8px'}}>&#9993;</span>{p.email || 'hello@example.com'}</div>
              <div><span style={{color: t.accent, marginRight: '8px'}}>&#9906;</span>{p.location || 'San Francisco, CA'}</div>
              <div style={{ wordBreak: 'break-all' }}><span style={{color: t.accent, marginRight: '8px'}}>in</span>{p.linkedin || 'linkedin.com/in/user'}</div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', letterSpacing: '2px', color: t.accent, borderBottom: `2px solid ${t.accent}`, paddingBottom: '0.25rem', marginBottom: '1rem', fontWeight: 700 }}>SKILLS</h3>
            <ul style={{ listStylePosition: 'inside', fontSize: '1rem', color: t.sidebarText, display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: 0, padding: 0, lineHeight: 1.4 }}>
              {primarySkills.map((skill, idx) => <li key={idx}>{skill}</li>)}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ width: '68%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
          <div style={{ backgroundColor: t.mainHeader, padding: '40px 2.5rem 35px 2.5rem' }}>
            <h1 style={{ margin: 0, fontSize: '3.2rem', letterSpacing: '1px', color: t.headerText, textTransform: 'uppercase', fontWeight: 800, lineHeight: 1.1 }}>{p.name || 'John Doe'}</h1>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', letterSpacing: '2px', textTransform: 'uppercase', color: t.accent, fontWeight: 600 }}>{p.title || 'Software Engineer'}</p>
          </div>

          <div style={{ padding: '30px 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div>
              <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.4rem', letterSpacing: '1px', color: t.accent, fontWeight: 700, borderBottom: `2px solid ${t.accent}`, paddingBottom: '0.25rem' }}>PROFILE</h3>
              <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.6, color: '#333', whiteSpace: 'pre-line' }}>{summary}</p>
            </div>

            {(!isFresher || (isFresher && hasIntern)) && (
              <div>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.4rem', letterSpacing: '1px', color: t.accent, fontWeight: 700, borderBottom: `2px solid ${t.accent}`, paddingBottom: '0.25rem' }}>
                  {isFresher ? 'INTERNSHIPS' : 'WORK EXPERIENCE'}
                </h3>
                {expData.map((exp, idx) => exp.role ? (
                  <div key={idx} style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.15rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#111', fontWeight: 700 }}>{exp.company}</h4>
                      <span style={{ fontSize: '1rem', color: t.accent, fontWeight: 600 }}>{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', color: '#444', fontStyle: 'italic' }}>{exp.role}</p>
                    <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '1.05rem', color: '#333', lineHeight: 1.5 }}>
                      {getBullets(exp.bullets, 3).map((bullet, bIdx) => <li key={bIdx} style={{marginBottom:'0.25rem'}}>{bullet}</li>)}
                    </ul>
                  </div>
                ) : null)}
              </div>
            )}

            {isFresher && (
              <div>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.4rem', letterSpacing: '1px', color: t.accent, fontWeight: 700, borderBottom: `2px solid ${t.accent}`, paddingBottom: '0.25rem' }}>PROJECTS</h3>
                {projData.map((proj, idx) => proj.title ? (
                  <div key={idx} style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.15rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#111', fontWeight: 700 }}>{proj.title}</h4>
                      <span style={{ fontSize: '1rem', color: t.accent, fontWeight: 600 }}>{proj.startDate} - {proj.endDate}</span>
                    </div>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', color: '#444', fontStyle: 'italic' }}>{proj.techStack} {proj.link && <span>| {proj.link}</span>}</p>
                    <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '1.05rem', color: '#333', lineHeight: 1.5 }}>
                      {getBullets(proj.bullets, 3).map((bullet, bIdx) => <li key={bIdx} style={{marginBottom:'0.25rem'}}>{bullet}</li>)}
                    </ul>
                  </div>
                ) : null)}
              </div>
            )}

            <div>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.4rem', letterSpacing: '1px', color: t.accent, fontWeight: 700, borderBottom: `2px solid ${t.accent}`, paddingBottom: '0.25rem' }}>EDUCATION</h3>
              {eduData.map((edu, idx) => edu.degree ? (
                <div key={idx} style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.15rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#111', fontWeight: 700 }}>{edu.degree}</h4>
                    <span style={{ fontSize: '1rem', color: t.accent, fontWeight: 600 }}>{edu.year}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '1.05rem', color: '#333' }}>{edu.institution}{edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</p>
                  {isFresher && edu.coursework && <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.95rem', color: '#555', fontStyle: 'italic' }}><span style={{ fontWeight: 600 }}>Coursework:</span> {edu.coursework}</p>}
                </div>
              ) : null)}
            </div>
          </div>
        </div>
      </div>
    </A4Wrapper>
  );
}

// --- CLASSIC TEMPLATE (Single-Column) ---
export function ClassicTemplate({ data, photoURL }) {
  const p = data.personal || {};
  
  const primarySkills = data.skills?.primary ? data.skills.primary.split(',').filter(s => s.trim()) : DUMMY.skills;
  const summary = p.summary || DUMMY.summary;
  const expData = data.experience?.some(e => e.role) ? data.experience : DUMMY.experience;
  const projData = data.projects?.some(p => p.title) ? data.projects : DUMMY.projects;
  const eduData = data.education?.some(e => e.degree) ? data.education : DUMMY.education;

  const isFresher = data.resumeType === 'fresher';
  const hasIntern = data.hasInternship === true;

  const scale = calculateScale(data);
  const font = '"Times New Roman", Times, serif';

  const sectionHeader = {
    margin: '0 0 10px 0', fontSize: '14pt', fontWeight: 'bold', 
    borderBottom: '2px solid #000', textTransform: 'uppercase', paddingBottom: '4px'
  };

  return (
    <A4Wrapper>
      <div style={{
        width: `${100/scale}%`, height: `${100/scale}%`, 
        transform: `scale(${scale})`, transformOrigin: 'top left',
        padding: '45px 50px', boxSizing: 'border-box',
        fontFamily: font, color: '#000', background: '#fff'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', marginBottom: '30px' }}>
          {photoURL ? (
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
              <img src={photoURL} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <PhotoPlaceholder name={p.name} size="100px" bg="#f1f5f9" color="#334155" rounded="50%" />
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: '0 0 5px 0', fontSize: '32pt', fontWeight: 'bold', textTransform: 'uppercase' }}>{p.name || 'John Doe'}</h1>
            <div style={{ fontSize: '16pt', fontWeight: 'bold', marginBottom: '8px', fontStyle: 'italic' }}>{p.title || 'Software Engineer'}</div>
            <div style={{ fontSize: '11pt', display: 'flex', gap: '12px', flexWrap: 'wrap', lineHeight: 1.4 }}>
              <span>{p.email || 'hello@example.com'}</span>
              <span>| {p.phone || '+1 234 567 890'}</span>
              <span>| {p.location || 'San Francisco, CA'}</span>
              <span>| {p.linkedin || 'linkedin.com/in/user'}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h2 style={sectionHeader}>Summary</h2>
            <p style={{ margin: 0, fontSize: '11pt', lineHeight: 1.4 }}>{summary}</p>
          </div>

          <div>
            <h2 style={sectionHeader}>Education</h2>
            {eduData.map((edu, idx) => edu.degree ? (
              <div key={idx} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '12pt', marginBottom: '2px' }}>
                  <span>{edu.institution}</span>
                  <span>{edu.year}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11pt', fontStyle: 'italic' }}>
                  <span>{edu.degree}</span>
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>
                {isFresher && edu.coursework && <div style={{ fontSize: '10pt', marginTop: '2px' }}>Relevant Coursework: {edu.coursework}</div>}
              </div>
            ) : null)}
          </div>

          {(!isFresher || (isFresher && hasIntern)) && (
            <div>
              <h2 style={sectionHeader}>
                {isFresher ? 'Internships' : 'Professional Experience'}
              </h2>
              {expData.map((exp, idx) => exp.role ? (
                <div key={idx} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '12pt', marginBottom: '2px' }}>
                    <span>{exp.company}</span>
                    <span>{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div style={{ fontSize: '11pt', fontStyle: 'italic', marginBottom: '4px' }}>{exp.role}</div>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '11pt', lineHeight: 1.4 }}>
                    {getBullets(exp.bullets, 4).map((bullet, bIdx) => <li key={bIdx} style={{marginBottom: '4px'}}>{bullet}</li>)}
                  </ul>
                </div>
              ) : null)}
            </div>
          )}

          {isFresher && (
            <div>
              <h2 style={sectionHeader}>Projects</h2>
              {projData.map((proj, idx) => proj.title ? (
                <div key={idx} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '12pt', marginBottom: '2px' }}>
                    <span>{proj.title} {proj.link && <span style={{ fontWeight: 'normal', fontStyle: 'italic', fontSize: '10pt' }}>| {proj.link}</span>}</span>
                    <span>{proj.startDate} - {proj.endDate}</span>
                  </div>
                  <div style={{ fontSize: '11pt', fontStyle: 'italic', marginBottom: '4px' }}>{proj.techStack}</div>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '11pt', lineHeight: 1.4 }}>
                    {getBullets(proj.bullets, 3).map((bullet, bIdx) => <li key={bIdx} style={{marginBottom: '4px'}}>{bullet}</li>)}
                  </ul>
                </div>
              ) : null)}
            </div>
          )}

          <div>
            <h2 style={sectionHeader}>Skills</h2>
            <div style={{ fontSize: '11pt', lineHeight: 1.5 }}>
              {primarySkills.join(' • ')}
            </div>
          </div>
        </div>
      </div>
    </A4Wrapper>
  );
}

// --- CREATIVE TEMPLATE (Dark Mode & Pill Tags) ---
export function CreativeTemplate({ data, photoURL }) {
  const p = data.personal || {};
  
  const primarySkills = data.skills?.primary ? data.skills.primary.split(',').filter(s => s.trim()) : DUMMY.skills;
  const summary = p.summary || DUMMY.summary;
  const expData = data.experience?.some(e => e.role) ? data.experience : DUMMY.experience;
  const projData = data.projects?.some(p => p.title) ? data.projects : DUMMY.projects;
  const eduData = data.education?.some(e => e.degree) ? data.education : DUMMY.education;

  const isFresher = data.resumeType === 'fresher';
  const hasIntern = data.hasInternship === true;

  const scale = calculateScale(data);
  const font = '"Outfit", "Inter", sans-serif';
  const bg = '#0f172a'; 
  const text = '#cbd5e1'; 
  const textBright = '#f8fafc'; 
  const accent = '#ec4899'; 
  const cardBg = '#1e293b'; 

  return (
    <A4Wrapper>
      <div style={{ 
        width: `${100/scale}%`, height: `${100/scale}%`, 
        transform: `scale(${scale})`, transformOrigin: 'top left',
        background: bg, color: text, padding: '45px', boxSizing: 'border-box',
        fontFamily: font, display: 'flex', flexDirection: 'column', gap: '30px'
      }}>
        {/* Header Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px', paddingBottom: '25px', borderBottom: `2px solid ${cardBg}` }}>
          {photoURL ? (
            <div style={{ width: '140px', height: '140px', borderRadius: '50%', border: `4px solid ${accent}`, overflow: 'hidden', flexShrink: 0 }}>
              <img src={photoURL} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <PhotoPlaceholder name={p.name} size="140px" bg={cardBg} color={accent} rounded="50%" border={`4px solid ${accent}`} />
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '3.2rem', fontWeight: 800, color: textBright, lineHeight: 1 }}>{p.name || 'John Doe'}</h1>
            <div style={{ fontSize: '1.4rem', color: accent, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '15px' }}>{p.title || 'Software Engineer'}</div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '1.05rem' }}>
              <div style={{ background: cardBg, padding: '6px 14px', borderRadius: '20px' }}>{p.email || 'hello@example.com'}</div>
              <div style={{ background: cardBg, padding: '6px 14px', borderRadius: '20px' }}>{p.phone || '+1 234 567 890'}</div>
              <div style={{ background: cardBg, padding: '6px 14px', borderRadius: '20px' }}>{p.location || 'San Francisco, CA'}</div>
              <div style={{ background: cardBg, padding: '6px 14px', borderRadius: '20px' }}>{p.linkedin || 'linkedin.com/in/user'}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '35px', flex: 1 }}>
          {/* Main Column */}
          <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <section>
              <h2 style={{ color: textBright, fontSize: '1.4rem', fontWeight: 700, margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <User size={22} color={accent} /> PROFILE
              </h2>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>{summary}</p>
            </section>

            {(!isFresher || (isFresher && hasIntern)) && (
              <section>
                <h2 style={{ color: textBright, fontSize: '1.4rem', fontWeight: 700, margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Briefcase size={22} color={accent} /> {isFresher ? 'INTERNSHIPS' : 'EXPERIENCE'}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {expData.map((exp, idx) => exp.role ? (
                    <div key={idx} style={{ background: cardBg, padding: '20px', borderRadius: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.15rem', color: textBright }}>{exp.role}</h3>
                        <span style={{ fontSize: '0.95rem', color: accent, background: 'rgba(236,72,153,0.1)', padding: '4px 12px', borderRadius: '12px', fontWeight: 600 }}>{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 500, marginBottom: '8px', color: '#94a3b8' }}>{exp.company}</div>
                      <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '1.05rem', lineHeight: 1.5 }}>
                        {getBullets(exp.bullets, 3).map((bullet, bIdx) => <li key={bIdx} style={{marginBottom:'4px'}}>{bullet}</li>)}
                      </ul>
                    </div>
                  ) : null)}
                </div>
              </section>
            )}

            {isFresher && (
              <section>
                <h2 style={{ color: textBright, fontSize: '1.4rem', fontWeight: 700, margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Code size={22} color={accent} /> PROJECTS
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {projData.map((proj, idx) => proj.title ? (
                    <div key={idx} style={{ background: cardBg, padding: '20px', borderRadius: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.15rem', color: textBright }}>{proj.title}</h3>
                        <span style={{ fontSize: '0.95rem', color: accent, background: 'rgba(236,72,153,0.1)', padding: '4px 12px', borderRadius: '12px', fontWeight: 600 }}>{proj.startDate} - {proj.endDate}</span>
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '8px', color: '#94a3b8' }}>
                        {proj.techStack} {proj.link && <span>• {proj.link}</span>}
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '1.05rem', lineHeight: 1.5 }}>
                        {getBullets(proj.bullets, 3).map((bullet, bIdx) => <li key={bIdx} style={{marginBottom:'4px'}}>{bullet}</li>)}
                      </ul>
                    </div>
                  ) : null)}
                </div>
              </section>
            )}
          </div>

          {/* Side Column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <section>
              <h2 style={{ color: textBright, fontSize: '1.4rem', fontWeight: 700, margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Code size={22} color={accent} /> SKILLS
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {primarySkills.map((skill, idx) => (
                  <div key={idx} style={{ background: cardBg, color: textBright, padding: '8px 16px', borderRadius: '8px', fontSize: '1rem', fontWeight: 500, border: '1px solid rgba(255,255,255,0.05)' }}>
                    {skill}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 style={{ color: textBright, fontSize: '1.4rem', fontWeight: 700, margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <GraduationCap size={22} color={accent} /> EDUCATION
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {eduData.map((edu, idx) => edu.degree ? (
                  <div key={idx} style={{ paddingLeft: '16px', borderLeft: `3px solid ${cardBg}` }}>
                    <div style={{ fontSize: '0.95rem', color: accent, fontWeight: 600, marginBottom: '4px' }}>{edu.year}</div>
                    <div style={{ fontSize: '1.15rem', color: textBright, fontWeight: 600 }}>{edu.degree}</div>
                    <div style={{ fontSize: '1.05rem', marginBottom: '4px' }}>{edu.institution}</div>
                    {edu.gpa && <div style={{ fontSize: '0.95rem', color: '#94a3b8' }}>GPA: {edu.gpa}</div>}
                    {isFresher && edu.coursework && <div style={{ fontSize: '0.95rem', color: '#94a3b8', marginTop: '6px' }}>Coursework: {edu.coursework}</div>}
                  </div>
                ) : null)}
              </div>
            </section>
          </div>
        </div>
      </div>
    </A4Wrapper>
  );
}
