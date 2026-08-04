import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

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
