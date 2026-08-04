import os
from fastapi import FastAPI, UploadFile, File, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv

from backend.services.parser import extract_text_from_file
from backend.services.analyzer import analyze_resume

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

app = FastAPI(title="Smart Resume Analyzer API")

# Default origins for local development
default_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",")] if allowed_origins_env else default_origins

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")
if not SUPABASE_URL or not SUPABASE_KEY:
    print("Warning: Supabase credentials not found in environment variables.")
    supabase: Client = None
else:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.get("/")
def read_root():
    return {"message": "Welcome to Smart Resume Analyzer API. Go to /docs for Swagger UI."}

@app.post("/api/analyze")
async def analyze_resume_endpoint(
    file: UploadFile = File(...),
    authorization: str = Header(None)
):
    """
    Accepts a resume file (PDF or DOCX), verifies user JWT token, extracts text, 
    returns an AI-generated diagnostic report, and saves it to the database.
    """
    # 1. Verify Authentication
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authentication token")
    
    token = authorization.split(" ")[1]
    user_id = None
    
    if supabase:
        try:
            # We can verify the token by fetching the user profile
            user_response = supabase.auth.get_user(token)
            if not user_response or not user_response.user:
                raise HTTPException(status_code=401, detail="Invalid token")
            user_id = user_response.user.id
        except Exception as e:
            raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")

    # 2. Validate File
    if not file.filename.lower().endswith(('.pdf', '.docx', '.doc')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
    
    try:
        # Read the file content into memory
        file_content = await file.read()
        
        # Step 3: Parse the file to text
        resume_text = extract_text_from_file(file_content, file.filename)
        
        # Step 4: Send text to Gemini AI for analysis
        analysis_result = analyze_resume(resume_text)
        
        # Step 5: Save result to Supabase if authenticated
        if supabase and user_id:
            try:
                # Set the auth token for the current request context for RLS
                supabase.postgrest.auth(token)
                
                ats_score = analysis_result.get("ats_score", 0)
                score_label = analysis_result.get("score_label", "Unknown")
                
                supabase.table('analyses').insert({
                    "user_id": user_id,
                    "resume_filename": file.filename,
                    "ats_score": ats_score,
                    "score_label": score_label,
                    "full_json_result": analysis_result
                }).execute()
            except Exception as db_err:
                print(f"Error saving to database: {db_err}")
                # We don't fail the request if saving to DB fails, just log it.
            finally:
                # Reset the auth token so it doesn't leak between requests
                supabase.postgrest.auth(SUPABASE_KEY)
        
        return analysis_result

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Unhandled exception during analysis: {str(e)}")
        raise HTTPException(status_code=500, detail="Something went wrong while analyzing your resume. Please try again.")

from pydantic import BaseModel
from backend.services.analyzer import rewrite_bullet

class RewriteRequest(BaseModel):
    bullet: str

@app.post("/api/rewrite")
async def rewrite_bullet_endpoint(req: RewriteRequest, authorization: str = Header(None)):
    # 1. Verify Authentication
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authentication token")
    token = authorization.split(" ")[1]
    if supabase:
        try:
            user_response = supabase.auth.get_user(token)
            if not user_response or not user_response.user:
                raise HTTPException(status_code=401, detail="Invalid token")
        except Exception as e:
            raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")
    
    rewritten = rewrite_bullet(req.bullet)
    return {"rewritten": rewritten}


from backend.services.analyzer import generate_cover_letter

class CoverLetterRequest(BaseModel):
    job_description: str

@app.post("/api/cover-letter")
async def generate_cover_letter_endpoint(req: CoverLetterRequest, authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authentication token")
    token = authorization.split(" ")[1]
    user_id = None
    if supabase:
        try:
            user_response = supabase.auth.get_user(token)
            if not user_response or not user_response.user:
                raise HTTPException(status_code=401, detail="Invalid token")
            user_id = user_response.user.id
        except Exception as e:
            raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")
    
    if not supabase or not user_id:
        raise HTTPException(status_code=500, detail="Database connection failed")

    # Fetch resume data from Supabase
    supabase.postgrest.auth(token)
    res = supabase.table('resumes').select('data').eq('user_id', user_id).execute()
    supabase.postgrest.auth(SUPABASE_KEY)
    
    if not res.data or len(res.data) == 0:
        raise HTTPException(status_code=404, detail="No saved resume found. Please save your resume in the Builder first.")
    
    resume_json = res.data[0]['data']
    cover_letter = generate_cover_letter(resume_json, req.job_description)
    
    return {"cover_letter": cover_letter}


from backend.services.analyzer import parse_resume_to_builder

@app.post("/api/parse-to-builder")
async def parse_to_builder_endpoint(
    file: UploadFile = File(...),
    authorization: str = Header(None)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authentication token")
    
    if not file.filename.lower().endswith(('.pdf', '.docx', '.doc')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
    
    try:
        file_content = await file.read()
        resume_text = extract_text_from_file(file_content, file.filename)
        
        parsed_data = parse_resume_to_builder(resume_text)
        return parsed_data
    except Exception as e:
        print(f"Unhandled exception during parse-to-builder: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to parse resume data.")

