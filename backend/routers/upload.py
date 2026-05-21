from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from typing import Optional
from datetime import datetime, timezone
import traceback
from utils.data_processor import save_and_process_file, save_and_process_url
from utils.db import save_session_state
from utils.auth import get_current_user
import uuid

router = APIRouter(
    prefix="/api/upload",
    tags=["upload"]
)

@router.post("")
async def upload_dataset(
    file: Optional[UploadFile] = File(None),
    url: Optional[str] = Form(None),
    user_id: str = Depends(get_current_user)
):
    try:
        session_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()
        
        if file:
            content = await file.read()
            summary, filepath = save_and_process_file(content, file.filename)
            await save_session_state(session_id, {
                "session_id": session_id,
                "user_id": user_id,
                "filepath": filepath,
                "summary": summary,
                "filename": file.filename,
                "created_at": now
            })
            
            return {
                "message": "File processed successfully",
                "source": "file",
                "filename": file.filename,
                "session_id": session_id,
                "filepath": filepath,
                "summary": summary
            }
        elif url:
            summary, filepath = save_and_process_url(url)
            await save_session_state(session_id, {
                "session_id": session_id,
                "user_id": user_id,
                "filepath": filepath,
                "summary": summary,
                "filename": url,
                "created_at": now
            })
            
            return {
                "message": "URL scraped successfully",
                "source": "url",
                "url": url,
                "session_id": session_id,
                "filepath": filepath,
                "summary": summary
            }
        else:
            raise HTTPException(status_code=400, detail="Must provide either a file or a URL")
            
    except Exception as e:
        print(f"Error in upload: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))
