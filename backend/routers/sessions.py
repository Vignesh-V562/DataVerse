from fastapi import APIRouter, HTTPException, Depends
from utils.db import get_user_sessions, get_chat_history, get_session_state, delete_session
from utils.auth import get_current_user

router = APIRouter(
    prefix="/api/sessions",
    tags=["sessions"]
)

@router.get("")
async def list_sessions(user_id: str = Depends(get_current_user)):
    """List all sessions for the authenticated user."""
    sessions = await get_user_sessions(user_id)
    return sessions

@router.get("/{session_id}/history")
async def get_session_chat_history(session_id: str, user_id: str = Depends(get_current_user)):
    """Load chat history for a specific session."""
    # Verify ownership
    session = await get_session_state(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.get("user_id") != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    messages = await get_chat_history(session_id)
    return {
        "session_id": session_id,
        "summary": session.get("summary", {}),
        "messages": messages
    }

@router.delete("/{session_id}")
async def remove_session(session_id: str, user_id: str = Depends(get_current_user)):
    """Delete a specific session and its history."""
    session = await get_session_state(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.get("user_id") != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
        
    await delete_session(session_id)
    return {"message": "Session deleted successfully"}
