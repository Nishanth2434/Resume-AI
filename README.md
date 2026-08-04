# Smart AI Resume Analyzer & Builder

An ultra-premium, AI-powered web application that analyzes and helps build ATS-friendly resumes. Built as a comprehensive final year project, it features a stunning glassmorphism design, real-time Gemini AI integration, and secure user authentication via Supabase.

---

## ✨ Features

- **AI-Powered Diagnostics**: Upload your PDF/DOCX resume and let Google's **Gemini 1.5 Flash AI** decode it. Get an overall ATS score and actionable directives to optimize your resume for applicant tracking systems.
- **Premium Resume Builder**: A fully interactive resume builder with dynamic section management, skill tagging, and photo uploads.
- **Secure Authentication**: Protected routes powered by **Supabase Auth**. Users must sign up/log in before they can access the analyzer or builder.
- **Modern Aesthetic**: Ultra-premium UI built with React and raw CSS featuring glassmorphism, smooth animations, and bento-box layouts.

---

## 📸 Screenshots

### The Landing Page
![Home](assets/home.png)

### The Diagnostic Analyzer
![Analyzer](assets/analyzer.png)

### The Resume Builder
![Builder](assets/builder.png)

---

## 🛠️ Technology Stack

**Frontend:**
- React (Vite)
- React Router (Protected Routing)
- Custom CSS (Glassmorphism, Animations)
- Supabase-JS (Authentication Client)

**Backend:**
- Python 3
- FastAPI (REST API & Server)
- Google Generative AI (`gemini-1.5-flash`)
- PyMuPDF (`pymupdf`) for PDF parsing
- Python-Docx (`python-docx`) for DOCX parsing

**Database / Auth:**
- Supabase

---

## 🚀 How It Works

1. **Authentication**: When a user visits the app, they are greeted by a premium landing page. Attempting to access the **Analyzer** or **Builder** redirects them to the Supabase-powered login portal.
2. **Analysis Flow**: 
   - The user drags and drops their resume (PDF/DOCX) into the drop zone.
   - The React frontend sends the file to the FastAPI backend via a `POST /api/analyze` request.
   - The backend uses `pymupdf` to extract the raw text.
   - The text is fed into the **Gemini 1.5 Flash** model with a highly specific prompt to grade the resume on ATS compatibility, keyword synergy, and structural integrity.
   - Gemini returns a structured JSON response, which the backend forwards to the frontend.
   - The frontend instantly maps the data into a beautiful, animated Bento-Grid dashboard.
3. **Builder Flow**: Users can manually construct a new resume using an interactive form that updates a live preview in real-time.

---

## 💻 Local Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/Nishanth2434/Resume-AI.git
cd Resume-AI
```

### 2. Frontend Setup
Install the Node dependencies:
```bash
npm install
```
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Backend Setup
Navigate to the backend directory and set up a virtual environment:
```bash
cd backend
python -m venv venv
```
Activate the virtual environment:
- **Windows**: `.\venv\Scripts\activate`
- **Mac/Linux**: `source venv/bin/activate`

Install the Python dependencies:
```bash
pip install fastapi uvicorn python-multipart pymupdf python-docx python-dotenv google-genai google-generativeai
```
Create a `.env` file in the `backend/` directory and add your Gemini API Key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Running the Application
Open two separate terminal windows.

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
