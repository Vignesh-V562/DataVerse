from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import asyncio
from utils.llm_agent import generate_code
from utils.execution import execute_sandbox
from utils.db import get_session_state, save_chat_message
from utils.auth import get_current_user

router = APIRouter(
    prefix="/api/query",
    tags=["query"]
)

class QueryRequest(BaseModel):
    session_id: str
    question: str

@router.post("")
async def query_dataset(req: QueryRequest, user_id: str = Depends(get_current_user)):
    # Retrieve session state
    session = await get_session_state(req.session_id)
    if not session or not session.get('filepath'):
        raise HTTPException(status_code=400, detail="No dataset loaded for this session. Please upload first.")
        
    # Enforce data isolation
    if session.get('user_id') != user_id:
        raise HTTPException(status_code=403, detail="You do not have permission to access this session.")
        
    filepath = session['filepath']
    summary = session['summary']
    
    # Self-Healing Execution Loop (Max 3 Tries)
    max_retries = 3
    error_feedback = None
    
    for attempt in range(max_retries):
        try:
            # 1. Generate Code
            code = await generate_code(req.question, summary, error_feedback)
            print(f"--- Attempt {attempt+1} Code ---\n{code}\n-----------------------")
            
            # 2. Execute Code (Offloaded to separate thread to prevent blocking)
            result_text, plot_json, exec_error = await asyncio.to_thread(execute_sandbox, code, filepath)
            
            if exec_error:
                error_feedback = exec_error
                print(f"Execution Error on Attempt {attempt+1}: {exec_error}")
                continue # Try again
                
            # Success
            # Save to MongoDB chat history
            await save_chat_message(req.session_id, "user", req.question)
            await save_chat_message(req.session_id, "assistant", result_text, plot_json)
            
            return {
                "status": "success",
                "answer": result_text,
                "plot_json": plot_json,
                "attempts": attempt + 1
            }
            
        except Exception as e:
            error_feedback = str(e)
            print(f"Error on Attempt {attempt+1}: {error_feedback}")
            
    # Exhausted retries
    raise HTTPException(status_code=500, detail=f"Failed to process query after 3 attempts. Last error: {error_feedback}")
