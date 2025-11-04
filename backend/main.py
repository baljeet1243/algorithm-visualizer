"""
Algorithm Visualizer Backend
FastAPI server for AI-powered algorithm explanations (optional feature)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os

app = FastAPI(
    title="Algorithm Visualizer API",
    description="Backend API for algorithm explanations and AI assistance",
    version="1.0.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
class ExplanationRequest(BaseModel):
    algorithm: str
    step: int
    state: dict
    question: Optional[str] = None

class ExplanationResponse(BaseModel):
    explanation: str
    suggestions: List[str] = []

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Algorithm Visualizer API",
        "status": "running",
        "endpoints": {
            "explain": "/api/explain",
            "health": "/api/health"
        }
    }

# Health check
@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

# Algorithm explanation endpoint (AI integration placeholder)
@app.post("/api/explain", response_model=ExplanationResponse)
async def explain_algorithm(request: ExplanationRequest):
    """
    Generate explanations for algorithm steps using AI.
    
    This is a placeholder implementation. To enable AI:
    1. Install: pip install openai anthropic
    2. Set environment variables: OPENAI_API_KEY or ANTHROPIC_API_KEY
    3. Uncomment the AI integration code below
    """
    
    # Placeholder response
    explanations = {
        "bubble-sort": "Bubble Sort compares adjacent elements and swaps them if they're in the wrong order.",
        "quick-sort": "Quick Sort picks a pivot and partitions the array around it.",
        "merge-sort": "Merge Sort divides the array recursively and merges sorted subarrays.",
        "bfs": "BFS explores nodes level by level using a queue.",
        "dfs": "DFS explores as far as possible along each branch before backtracking.",
        "dijkstra": "Dijkstra's algorithm finds shortest paths by greedily selecting minimum distances.",
    }
    
    explanation = explanations.get(
        request.algorithm,
        f"Explanation for {request.algorithm} at step {request.step}"
    )
    
    suggestions = [
        "Try stepping through slowly to observe the changes",
        "Pay attention to which elements are being compared",
        "Notice how the sorted portion grows"
    ]
    
    return ExplanationResponse(
        explanation=explanation,
        suggestions=suggestions
    )

# AI Integration Example (uncomment to enable)
"""
from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.post("/api/explain", response_model=ExplanationResponse)
async def explain_algorithm(request: ExplanationRequest):
    try:
        prompt = f'''
        Explain step {request.step} of the {request.algorithm} algorithm.
        Current state: {request.state}
        User question: {request.question or "What is happening in this step?"}
        
        Provide a clear, concise explanation suitable for students learning algorithms.
        '''
        
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful algorithm tutor."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200
        )
        
        explanation = response.choices[0].message.content
        
        return ExplanationResponse(
            explanation=explanation,
            suggestions=[
                "Try comparing this with other sorting algorithms",
                "Consider the time complexity at this step"
            ]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
"""

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
