import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

# Define the JSON schema we want back from the model
generation_config = {
  "temperature": 0.2,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_mime_type": "application/json",
}

def analyze_resume(resume_text: str) -> dict:
    """
    Sends the parsed resume text to Gemini AI to get ATS feedback matching the frontend format.
    """
    if not api_key:
        # Fallback mock data if API key is not configured
        return get_mock_analysis()

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config=generation_config,
    )

    prompt = f"""
You are an expert AI recruiter and ATS (Applicant Tracking System) simulator.
Analyze the following resume text and provide a highly detailed diagnostic report.
You MUST output your response in valid JSON format matching the exact structure below.

Expected JSON Structure:
{{
    "ats_score": number (0-100),
    "score_label": string ("Excellent", "Good", "Average", "Poor"),
    "keyword_synergy": {{
        "value": string (e.g., "14/20 Found"),
        "status": string ("success", "warning", "error"),
        "description": string (brief description of keyword match)
    }},
    "structural_integrity": {{
        "value": string (e.g., "Optimal"),
        "status": string ("success", "warning", "error"),
        "description": string (brief description of formatting/parseability)
    }},
    "action_velocity": {{
        "value": string (e.g., "Sub-optimal"),
        "status": string ("success", "warning", "error"),
        "description": string (brief description of action verb usage)
    }},
    "metadata": {{
        "value": string (e.g., "Verified"),
        "status": string ("success", "warning", "error"),
        "description": string (brief description of contact info extraction)
    }},
    "actionable_directives": [
        {{
            "title": string (actionable advice title),
            "description": string (detailed advice)
        }},
        ... (provide exactly 3 directives)
    ]
}}

Resume Text:
{resume_text}
"""

    try:
        response = model.generate_content(prompt)
        # Parse the JSON response
        result = json.loads(response.text)
        return result
    except Exception as e:
        print(f"Error during Gemini analysis: {e}")
        return get_mock_analysis()

def get_mock_analysis():
    """Fallback if Gemini API fails or is not configured."""
    return {
        "ats_score": 82,
        "score_label": "Excellent",
        "keyword_synergy": {
            "value": "14/20 Found",
            "status": "warning",
            "description": "You are missing some critical industry terms required by top-tier ATS."
        },
        "structural_integrity": {
            "value": "Optimal",
            "status": "success",
            "description": "Clean layout, highly parseable by machine readers."
        },
        "action_velocity": {
            "value": "Sub-optimal",
            "status": "error",
            "description": "Weak verb usage detected. Upgrade to powerful action verbs."
        },
        "metadata": {
            "value": "Verified",
            "status": "success",
            "description": "Contact, email, and professional links extracted perfectly."
        },
        "actionable_directives": [
            {
                "title": "Inject Missing Keywords",
                "description": "Based on standard profiles, your resume lacks Docker, Kubernetes, GraphQL. Inject these naturally into your experience."
            },
            {
                "title": "Quantify Impact Metrics",
                "description": "40% of your bullet points lack numbers. Transform 'Improved performance' into 'Engineered a caching layer that reduced load times by 300ms'."
            },
            {
                "title": "Consolidate Skill Hierarchy",
                "description": "Your skills section is a flat list. Re-organize into categorical buckets (e.g., 'Languages', 'Frameworks') to improve human readability."
            }
        ]
    }


def rewrite_bullet(bullet_text: str) -> str:
    """
    Sends a single resume bullet point to Gemini AI to rewrite it.
    """
    if not api_key:
        return "Enhanced (Mock): " + bullet_text

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
    )

    prompt = f"""
You are an expert resume writer.
Rewrite the following resume bullet point to be more professional, ATS-friendly, action-oriented, and impactful.
Do not add introductory or concluding remarks. Just output the rewritten bullet point.

Original Bullet:
{bullet_text}
"""

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error calling Gemini for rewrite: {e}")
        return bullet_text



def generate_cover_letter(resume_json: dict, job_description: str) -> str:
    """
    Sends the full resume JSON and job description to Gemini to generate a cover letter.
    """
    if not api_key:
        return "Cover Letter (Mock):\nDear Hiring Manager,\nI am writing to apply..."

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
    )

    prompt = f"""
You are an expert career coach and professional writer.
Write a tailored, compelling cover letter for the following job description, based on the candidate's resume data.
The cover letter should be professional, confident, and highlight how the candidate's specific experience aligns with the job requirements.

Job Description:
{job_description}

Candidate's Resume Data (JSON):
{resume_json}

Output ONLY the text of the cover letter. Do not include any introductory remarks.
"""

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error calling Gemini for cover letter: {e}")
        return "Error generating cover letter. Please try again."


def parse_resume_to_builder(resume_text: str) -> dict:
    """
    Sends the parsed resume text to Gemini AI to extract structured data matching the Builder's resumeData state.
    """
    if not api_key:
        return {}

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config=generation_config,
    )

    prompt = f"""
You are an expert data extractor.
Extract the candidate's details from the following resume text and output ONLY valid JSON matching the exact structure below.
Do not invent data. If a field is not found in the resume, leave it as an empty string "".

Expected JSON Structure:
{{
    "personal": {{ "name": "", "title": "", "email": "", "phone": "", "linkedin": "", "location": "", "summary": "" }},
    "experience": [ {{ "role": "", "company": "", "startDate": "", "endDate": "", "bullets": "" }} ],
    "education": [ {{ "degree": "", "institution": "", "year": "", "gpa": "" }} ],
    "skills": {{ "primary": "", "secondary": "" }}
}}

Important:
- format "bullets" as a single string with each bullet point starting with a dash (-) and separated by a newline (\n).
- skills.primary should be a comma-separated list of the most important hard skills.
- skills.secondary should be a comma-separated list of soft skills or other skills.

Resume Text:
{resume_text}
"""

    try:
        response = model.generate_content(prompt)
        return json.loads(response.text)
    except Exception as e:
        print(f"Error parsing to builder format: {e}")
        return {}
