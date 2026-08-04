<div align="center">

<img src="docs/logo.svg" alt="Smart AI Resume Analyzer logo" width="170" />

# 📄 Smart AI Resume Analyzer & Builder

*Empowering professionals with AI-driven resume insights and a beautiful, live-synced builder.*

<p align="center">
  <a href="https://resume-ai-azure-two.vercel.app/">
    <img src="https://img.shields.io/badge/Live_Website-2563EB?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Website" />
  </a>
  <a href="https://github.com/Nishanth2434/Resume-AI/stargazers">
    <img src="https://img.shields.io/badge/GitHub_Stars-F59E0B?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Stars" />
  </a>
  <img src="https://img.shields.io/badge/License_MIT-22C55E?style=for-the-badge" alt="License MIT" />
  <img src="https://img.shields.io/badge/Version_1.0.0-6366F1?style=for-the-badge" alt="Version 1.0.0" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
</p>

</div>

<br/>

<div align="center">

<a href="https://resume-ai-azure-two.vercel.app/">
  <img src="https://img.shields.io/badge/🚀_LAUNCH_LIVE_APP-111111?style=for-the-badge" height="52" alt="Launch Live App" />
</a>

<br/><br/>

| Route | Path | Description |
| :--- | :--- | :--- |
| **Home** | `/` | Landing page and overview |
| **Login / Sign Up** | `/login` | Secure Supabase authentication |
| **Analyzer** | `/analyze` | Upload and analyze resumes (ATS score & feedback) |
| **Builder** | `/build` | Live resume builder with themes & Magic Rewrite |
| **Cover Letter** | `/cover-letter` | AI-generated cover letter from saved resume |

</div>

---

## 📸 A Look Inside

<div align="center">
<b>Welcome to SmartResumeAI</b><br/>
<img src="docs/screenshots/home.png" alt="Home Page" width="100%" />
</div>

<br/>

| 🔐 Login & Auth | 📝 Resume Analyzer |
| :---: | :---: |
| <img src="docs/screenshots/login.png" alt="Login" width="100%" /> | <img src="docs/screenshots/analyzer.png" alt="Analyzer" width="100%" /> |
| **🛠️ Resume Builder** | **✉️ AI Cover Letter** |
| <img src="docs/screenshots/builder.png" alt="Builder" width="100%" /> | <img src="docs/screenshots/cover_letter.png" alt="Cover Letter" width="100%" /> |

---

## ✨ Features

| Feature | Description |
| :--- | :--- |
| 🧠 **AI Resume Analysis** | Securely parse PDF/DOCX resumes and get real-time ATS scoring, actionable feedback, and keyword optimization via Google Gemini 1.5 Flash. |
| 🛠️ **Premium Resume Builder** | A two-column live-syncing builder with multiple high-contrast templates (Modern, Classic, Creative). |
| 🪄 **Magic Rewrite** | Click a single button on any bullet point to have Gemini automatically rewrite it into a highly professional, ATS-friendly format. |
| ✉️ **Cover Letter Generator** | Paste a job description and automatically generate a personalized cover letter using your securely saved resume data. |
| 🔐 **Supabase Authentication** | Enterprise-grade JWT-based login and signup keeping user resume data fully isolated and private via Row Level Security. |
| 📄 **One-Click PDF Export** | Render complex HTML styling perfectly into high-resolution PDFs using local browser processing (`html2pdf.js`). |

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19.2 (Vite 8.2) |
| **Routing** | React Router DOM 7.18 |
| **Backend API** | Python 3 + FastAPI |
| **AI Engine** | Google Gemini (google-generativeai) |
| **Document Parsing** | PyMuPDF (fitz), Python-Docx |
| **Database & Auth** | Supabase (PostgreSQL, supabase-js 2.112) |
| **PDF Rendering** | html2pdf.js 0.14 |

---

## 🏗 Architecture Diagram

```mermaid
flowchart TD
    subgraph Frontend [React / Vite Client]
        UI[Browser UI]
        State[React Context / LocalStorage]
        UI <--> State
    end

    subgraph Backend [FastAPI Server]
        API_Analyze[/api/analyze]
        API_Rewrite[/api/rewrite]
        API_Cover[/api/cover-letter]
        Parser[PyMuPDF / Docx Parser]
    end

    subgraph External [Cloud Services]
        SB[(Supabase DB & Auth)]
        Gemini[Google Gemini 1.5 Flash]
    end

    UI -->|JWT Auth, Data Save/Load| SB
    UI -->|Multipart Uploads, JSON Payloads| Backend
    API_Analyze & API_Rewrite & API_Cover --> Gemini
    API_Cover --> SB
    API_Analyze --> Parser
```

---

## 📁 Project Structure

```text
📦 smart-resume-analysis
 ┣ 📂 backend/
 ┃ ┣ 📂 services/
 ┃ ┃ ┣ 📜 analyzer.py         # Gemini AI prompting logic
 ┃ ┃ ┗ 📜 parser.py           # PDF/DOCX text extraction
 ┃ ┣ 📜 main.py                 # FastAPI application, CORS, and Routes
 ┃ ┣ 📜 requirements.txt        # Python dependencies
 ┃ ┗ 📜 .env                    # Backend secrets
 ┣ 📂 docs/
 ┃ ┣ 📂 screenshots/            # UI screenshots
 ┃ ┗ 📜 logo.svg
 ┣ 📂 src/
 ┃ ┣ 📂 lib/
 ┃ ┃ ┗ 📜 supabase.js           # Supabase client initialization
 ┃ ┣ 📂 pages/
 ┃ ┃ ┣ 📜 Analyzer.jsx          # File upload and ATS dashboard
 ┃ ┃ ┣ 📜 Builder.jsx           # Live resume template engine
 ┃ ┃ ┣ 📜 CoverLetter.jsx       # AI job description matching
 ┃ ┃ ┣ 📜 Home.jsx              # Landing page
 ┃ ┃ ┗ 📜 Login.jsx             # Auth screen
 ┃ ┣ 📂 utils/                  # Helper utilities
 ┃ ┣ 📜 App.jsx                 # Routing and Layout
 ┃ ┣ 📜 index.css               # Global glassmorphism and theme variables
 ┃ ┗ 📜 main.jsx                # React DOM entry
 ┣ 📜 package.json              # Frontend dependencies
 ┗ 📜 vite.config.js
```

---

## ⚙️ Installation & Setup

<details open>
<summary><b>1. Clone the Repository</b></summary>
<br>

```bash
git clone https://github.com/Nishanth2434/Resume-AI.git
cd Resume-AI
```
</details>

<details open>
<summary><b>2. Frontend Setup</b></summary>
<br>

```bash
# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```
</details>

<details open>
<summary><b>3. Backend Setup</b></summary>
<br>

```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows: .\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```
*(Don't forget to create both `.env.local` and `backend/.env` files!)*
</details>

---

## 🔐 Environment Variables

### Frontend (`.env.local`)
| Variable | Type | Description |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | **Required** | Your Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | **Required** | Your Supabase Anonymous Key |
| `VITE_API_URL` | Optional | Backend URL (Defaults to `http://localhost:8000`) |

### Backend (`backend/.env`)
| Variable | Type | Description |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | **Required** | Google Generative AI API Key |
| `SUPABASE_URL` | **Required** | Your Supabase Project URL |
| `SUPABASE_ANON_KEY` | **Required** | Your Supabase Anonymous Key |
| `ALLOWED_ORIGINS` | Optional | Comma-separated list for CORS (e.g. `http://localhost:5173`) |

---

## 🔌 API Endpoints

| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Public | Health check / API Root |
| `POST` | `/api/analyze` | Public | Accepts a file upload (`resume_file`), parses it using PyMuPDF/Docx, and returns Gemini ATS feedback. |
| `POST` | `/api/rewrite` | Authenticated | Accepts a bullet point and returns an ATS-optimized rewrite using Gemini. |
| `POST` | `/api/cover-letter` | Authenticated | Fetches user's saved resume from Supabase, cross-references with a provided job description, and returns a tailored cover letter via Gemini. |
| `POST` | `/api/parse-to-builder` | Public | Parses an uploaded document directly into a structured JSON payload for the Builder. |

---

## 🛡️ Security

| Mechanism | Implementation |
| :--- | :--- |
| **Authentication** | Protected React Router wrapper (`<ProtectedRoute>`) ensuring only users with valid JWTs from Supabase can access the Builder or Cover Letter generator. |
| **Database Isolation** | Row Level Security (RLS) on Supabase prevents users from accessing or modifying `resumeData` belonging to another `user_id`. |
| **API Protection** | FastAPI endpoints require `Authorization: Bearer <token>` and validate the token directly with Supabase Admin SDK before executing operations. |
| **CORS Filtering** | Backend restricts origin domains to trusted frontend URLs via FastAPI's `CORSMiddleware`. |

---

## 🚀 Future Improvements

- [ ] **Templates Gallery:** Add a dozen more customizable PDF layouts.
- [ ] **LinkedIn Import:** Allow users to directly import their profile JSON into the Builder.
- [ ] **Grammar Engine:** Integrate a lightweight local NLP library to flag typos in the Builder before using the heavy Gemini API.

---

## 🤝 Contributing

<details open>
<summary><b>Contribution Guidelines</b></summary>
<br>

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes using Conventional Commits (`git commit -m 'feat: Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.
</details>

---

<div align="center">

### Author

**Nishanth B** - Full-Stack Developer


<a href="https://www.linkedin.com/in/nishanth-b-24b2006abc"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
<a href="https://github.com/Nishanth2434"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>
<a href="mailto:nishanthbnishu24@gmail.com"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>

<br/><br/>

Made with ❤️ by **NISHANTH B**

[Live Website](https://resume-ai-azure-two.vercel.app/) • [Features](#-features) • [Installation](#️-installation--setup) • [Contributing](#-contributing)

</div>
