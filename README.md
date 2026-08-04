<div align="center">
  <img src="public/logo.jpg" alt="Resume AI Logo" width="200"/>
  <h1>dY  Smart AI Resume Analyzer & Builder</h1>
  <p><b>An ultra-premium, AI-powered platform to analyze, score, and build ATS-optimized resumes.</b></p>
  
  <p>
    <a href="#-features">Features</a> A
    <a href="#-tech-stack">Tech Stack</a> A
    <a href="#-screenshots">Screenshots</a> A
    <a href="#-installation">Installation</a>
  </p>
</div>

---

## dY"- Overview

**Smart AI Resume Analyzer & Builder** is a modern SaaS application designed for students and professionals to optimize their resumes for Applicant Tracking Systems (ATS). 

Built with a stunning **glassmorphism UI**, it leverages **Google's Gemini 1.5 Flash AI** to dissect uploaded resumes and provide actionable, highly detailed feedback. It also features a built-in **Resume Builder** that generates perfectly aligned, premium PDF resumes on the fly.

## dY" Features

| Feature | Description |
| :--- | :--- |
| **dY"? AI Diagnostic Engine** | Upload your PDF or DOCX resume and receive an instant ATS score, keyword synergy analysis, and actionable directives to improve your profile using Google Gemini AI. |
| **dY" Premium Resume Builder** | A highly interactive builder with real-time preview. Generate a 2-column, ultra-premium resume complete with profile photos, contact icons, and sleek typography. |
| **dY"O One-Click PDF Export** | Instantly download your built resume as an A4-sized PDF, perfectly scaled and ready to send to recruiters. |
| **dY"Y Glassmorphism UI** | Designed to impress. Features bento-grids, smooth CSS stagger animations, dynamic mesh backgrounds, and hover micro-interactions. |
| **dY" Secure Authentication** | Powered by Supabase Auth (JWT), ensuring your data and analyses are kept private and secure. |
| **dY" Responsive Design** | Mobile-first layout that looks incredible on phones, tablets, and desktop displays. |

---

## dY" Screenshots

*(Upload your screenshots to the `assets/` folder and replace these placeholders!)*

<div align="center">
  <img src="assets/dashboard.png" alt="Dashboard Preview" width="800" style="border-radius: 12px; margin-bottom: 20px;" />
  <p><i>The AI Analysis Bento-Grid Dashboard</i></p>

  <img src="assets/builder.png" alt="Resume Builder Preview" width="800" style="border-radius: 12px; margin-bottom: 20px;" />
  <p><i>The Interactive Resume Builder & Live Preview</i></p>
</div>

---

## dY  Tech Stack

### Frontend
- **React + Vite**: For a lightning-fast Single Page Application.
- **React Router**: For seamless client-side navigation.
- **Vanilla CSS**: Custom glassmorphism, dynamic gradients, and `@keyframes` animations.
- **Lucide React**: Crisp, modern SVGs for icons.

### Backend
- **Python 3 + FastAPI**: High-performance API routing.
- **Google Generative AI (`gemini-1.5-flash`)**: The core brain for analyzing resume text and generating JSON feedback.
- **PyMuPDF & Python-Docx**: Robust document parsing to extract text from files.

### Database & Auth
- **Supabase**: PostgreSQL database and JWT-based Authentication.

---

## sT,? Installation & Setup

<details open>
<summary><b>1 A Clone the Repository</b></summary>

```bash
git clone https://github.com/Nishanth2434/Resume-AI.git
cd Resume-AI
```

</details>

<details open>
<summary><b>2 A Frontend Setup</b></summary>

Install Node dependencies:
```bash
npm install
```

Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

</details>

<details open>
<summary><b>3 A Backend Setup</b></summary>

Navigate to the backend directory and set up a Python virtual environment:
```bash
cd backend
python -m venv venv
```

Activate the virtual environment:
- **Windows**: `.\venv\Scripts\activate`
- **Mac/Linux**: `source venv/bin/activate`

Install the required Python packages:
```bash
pip install fastapi uvicorn python-multipart pymupdf python-docx python-dotenv google-genai google-generativeai supabase PyJWT
```

Create a `.env` file in the `backend/` directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
```

</details>

<details open>
<summary><b>4 A Run the Application</b></summary>

Open two separate terminal windows to run both servers simultaneously.

**Terminal 1 (Frontend):**
```bash
npm run dev
```

**Terminal 2 (Backend):**
```bash
cd backend
.\venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

Visit `http://localhost:5173` in your browser to experience the application!

</details>

---

## dY O Database Schema (Supabase)

The backend connects to Supabase to store user profiles and their analysis history.

- `profiles` table: Stores user `id`, `email`, and `full_name`. (Populated via Auth Triggers).
- `analyses` table: Stores the generated AI JSON results mapped to the `user_id`.

---

## dY`"??dY' Author

<table>
  <tr>
    <td align="center" width="180">
      <br/>
      <b>NISHANTH B</b><br/>
      <sub>Aspiring Software & Web Developer</sub>
    </td>
    <td>
      <p>Motivated Computer Science Engineering student. Built the Smart AI Resume Analyzer end-to-end ?" from the ultra-premium glassmorphism UI to the Gemini AI backend integration.</p>
      <a href="https://linkedin.com/in/nishanth-b-24b2006a"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" /></a>
      <a href="https://github.com/Nishanth2434"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" /></a>
      <a href="mailto:nishanthbnishu24@gmail.com"><img src="https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white" /></a>
    </td>
  </tr>
</table>

---

<div align="center">
Made with ? ,? by <b>NISHANTH B</b>
</div>
