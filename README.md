<div align="center">
  <img src="public/logo.jpg" alt="Resume AI Logo" width="180"/>
  <h1>🧠 Smart AI Resume Analyzer & Builder</h1>
  <p><b>An ultra-premium, AI-powered platform to analyze, score, and build ATS-optimized resumes.</b></p>
  
  <p>
    <a href="https://resume-ai-azure-two.vercel.app/"><img src="https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel" alt="Live Demo" /></a>
    <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status" />
    <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License" />
  </p>
</div>

---

## 📖 Overview

**Smart AI Resume Analyzer & Builder** is a modern SaaS application designed for students and professionals to optimize their resumes for Applicant Tracking Systems (ATS). 

Built with a stunning **glassmorphism UI**, it leverages **Google's Gemini 1.5 Flash AI** to dissect uploaded resumes (PDF/DOCX) and provide actionable, highly detailed feedback. It also features a built-in **Resume Builder** that generates perfectly aligned, premium PDF resumes on the fly. User data and resumes are securely persisted using **Supabase**.

---

## ✨ A Look Inside

<details open>
<summary><b>View Screenshots</b></summary>
<br>

*(Note: These are real Playwright screenshots captured directly from the Vercel deployment!)*

| Dashboard Analysis | Resume Builder |
|:---:|:---:|
| <img src="docs/screenshots/analyzer.png" width="400"/> | <img src="docs/screenshots/builder.png" width="400"/> |
| *The AI Analysis Bento-Grid Dashboard* | *Interactive Tabbed Resume Builder* |

| Landing Page | Login Portal |
|:---:|:---:|
| <img src="docs/screenshots/home.png" width="400"/> | <img src="docs/screenshots/login.png" width="400"/> |

</details>

---

## ⚡ Features

| Feature | Description |
| :--- | :--- |
| **🤖 AI Diagnostic Engine** | Upload your PDF or DOCX resume and receive an instant ATS score, keyword synergy analysis, and 3 actionable directives via Google Gemini AI. |
| **📝 Premium Resume Builder** | A highly interactive builder with tabs for Personal, Experience, Education, and Skills. Features dynamic array mapping for endless roles/degrees. |
| **📸 Dynamic Photo Cropper** | Upload and interactively crop your profile picture directly inside the builder using `react-easy-crop`. |
| **📄 One-Click PDF Export** | Instantly download your built resume as an A4-sized PDF using `html2pdf.js`. |
| **🔒 Secure Authentication** | Powered by Supabase Auth (JWT). Ensures your data and analyses are kept private and secure. |
| **☁️ Cloud Persistence** | Real-time auto-saving of your builder data to Supabase PostgreSQL, restoring seamlessly on login. |

---

## 🛠 Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | Lightning-fast SPA with Hot Module Replacement |
| **Routing** | React Router DOM v7 | Seamless client-side navigation |
| **Styling** | Vanilla CSS | Custom glassmorphism, dynamic mesh gradients, keyframes |
| **Backend** | Python 3 + FastAPI | High-performance API routing |
| **AI Engine** | Google Gemini 1.5 Flash | Core brain for parsing resume text into structured JSON |
| **Parsing** | PyMuPDF & Python-Docx | Robust document parsing to extract text from files |
| **Database** | Supabase (PostgreSQL) | Cloud database with Row Level Security (RLS) |

---

## 🏗 Architecture Diagram

```mermaid
graph LR
    subgraph Frontend [React SPA]
        UI[Glassmorphism UI]
        RB[Resume Builder]
        AA[Analysis Dashboard]
    end

    subgraph Backend [FastAPI Server]
        API[/api/analyze]
        Parser[PyMuPDF / Docx]
    end

    subgraph External [Cloud Services]
        SB[(Supabase DB & Auth)]
        Gemini[Google Gemini 1.5 Flash]
    end

    UI -->|JWT Auth & Save/Load| SB
    AA -->|Upload PDF/DOCX| API
    API -->|Extract Text| Parser
    Parser -->|Send Text| Gemini
    Gemini -->|Return JSON Diagnostic| API
    API -->|Save Analysis| SB
    API -->|Return JSON| AA
```

---

## 📁 Project Structure

```text
Resume-AI/
├── backend/
│   ├── main.py                 # FastAPI application & CORS config
│   ├── requirements.txt        # Python dependencies
│   └── services/
│       ├── analyzer.py         # Gemini AI prompting logic
│       └── parser.py           # PDF/DOCX text extraction
├── docs/
│   └── screenshots/            # Playwright captured images
├── public/                     # Static assets (logo)
├── src/
│   ├── App.jsx                 # React Router configuration
│   ├── index.css               # Global glassmorphism design system
│   ├── lib/
│   │   └── supabase.js         # Supabase client initialization
│   ├── pages/
│   │   ├── Analyzer.jsx        # File upload & results dashboard
│   │   ├── Builder.jsx         # Complex tabbed builder & PDF export
│   │   ├── Home.jsx            # Landing page
│   │   └── Login.jsx           # Auth flow
│   └── utils/
│       └── cropImage.js        # Canvas utilities for image cropping
└── package.json
```

---

## 🔌 API Endpoints

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/analyze` | Yes (Bearer JWT) | Accepts a multipart file (PDF/DOCX). Verifies token with Supabase, extracts text, calls Gemini AI, saves to DB, and returns a JSON diagnostic report. |

**Expected Gemini JSON Response Shape:**
```json
{
    "ats_score": 85,
    "score_label": "Excellent",
    "keyword_synergy": {
        "value": "14/20 Found",
        "status": "success",
        "description": "Strong match with industry standards."
    },
    "structural_integrity": { ... },
    "action_velocity": { ... },
    "metadata": { ... },
    "directives": [
        "Include more metrics in your experience bullets.",
        "..."
    ]
}
```

---

## 🔑 Environment Variables

To run this project, you will need to add the following environment variables.

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
| `SUPABASE_URL` | **Required** | Your Supabase Project URL (for backend inserts) |
| `SUPABASE_ANON_KEY` | **Required** | Your Supabase Anonymous Key |
| `ALLOWED_ORIGINS` | Optional | Comma-separated list for CORS |

---

## 🚀 Installation & Setup

<details open>
<summary><b>1. Clone the Repository</b></summary>

```bash
git clone https://github.com/Nishanth2434/Resume-AI.git
cd Resume-AI
```
</details>

<details open>
<summary><b>2. Frontend Setup</b></summary>

```bash
npm install
npm run dev
```
*(Don't forget to create your `.env.local` file!)*
</details>

<details open>
<summary><b>3. Backend Setup</b></summary>

```bash
cd backend
python -m venv venv
# Activate virtual environment
# Windows: .\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
*(Don't forget to create your `.env` file!)*
</details>

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Nishanth B**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/nishanth-b-24b2006a)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Nishanth2434)
[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=About.me&logoColor=white)](#) <!-- Add your portfolio link -->
