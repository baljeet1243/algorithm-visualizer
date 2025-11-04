"""
Explanation Router
Handles AI-powered algorithm explanations
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter(prefix="/api", tags=["explanations"])

class ExplainRequest(BaseModel):
    algorithm: str
    step: int
    context: dict
    question: Optional[str] = None

class ExplainResponse(BaseModel):
    text: str
    code_snippet: Optional[str] = None
    related_concepts: List[str] = []

@router.post("/explain")
async def explain_step(request: ExplainRequest) -> ExplainResponse:
    """
    Provide detailed explanation of an algorithm step.
    Can be extended with OpenAI/Claude API integration.
    """
    
    # Placeholder implementation
    explanations = {
        "bubble-sort": {
            "text": "Bubble Sort compares adjacent elements and swaps them if needed.",
            "code": "if arr[i] > arr[i+1]: swap(arr[i], arr[i+1])",
            "concepts": ["comparison sort", "in-place sorting", "stable sort"]
        },
        "quick-sort": {
            "text": "Quick Sort partitions around a pivot element.",
            "code": "pivot = partition(arr, low, high)",
            "concepts": ["divide and conquer", "pivot selection", "in-place sorting"]
        }
    }
    
    algo_info = explanations.get(request.algorithm)
    
    if not algo_info:
        return ExplainResponse(
            text=f"Explaining {request.algorithm} at step {request.step}",
            related_concepts=[]
        )
    
    return ExplainResponse(
        text=algo_info["text"],
        code_snippet=algo_info["code"],
        related_concepts=algo_info["concepts"]
    )
