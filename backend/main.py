from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama

app = FastAPI()

# CORS (required for Next.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    code: str

@app.get("/")
def root():
    return {"status": "Code Explainer API running"}

@app.post("/chat")
def explain_code(request: CodeRequest):
    prompt = f"""
You are a senior software engineer and coding mentor.

Task:
- Detect the programming language automatically
- Explain the code for a beginner
- Be concise and clear

Rules:
- Use Markdown
- Short sections only
- Max 5 bullet points
- No unnecessary theory
- Keep response under 300 words

Code:
{request.code}
"""

    response = ollama.chat(
        model="gemma3:latest",
        messages=[
            {"role": "user", "content": prompt}
        ],
        options={
            "temperature": 0.1,        # very focused
            "max_output_tokens": 3000,  # HARD LIMIT (this is key)
            "num_predict": 300         # extra safety for Ollama
        }
    )

    return {
        "explanation": response["message"]["content"]
    }
