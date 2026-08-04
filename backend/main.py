from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.services.parser import extract_text_from_file
from backend.services.analyzer import analyze_resume

app = FastAPI(title="Smart Resume Analyzer API")

# Configure CORS for local React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Smart Resume Analyzer API. Go to /docs for Swagger UI."}

@app.post("/api/analyze")
async def analyze_resume_endpoint(file: UploadFile = File(...)):
    """
    Accepts a resume file (PDF or DOCX), extracts its text, 
    and returns an AI-generated diagnostic report.
    """
    if not file.filename.lower().endswith(('.pdf', '.docx', '.doc')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
    
    try:
        # Read the file content into memory
        file_content = await file.read()
        
        # Step 1: Parse the file to text
        resume_text = extract_text_from_file(file_content, file.filename)
        
        # Step 2: Send text to Gemini AI for analysis
        analysis_result = analyze_resume(resume_text)
        
        return analysis_result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
