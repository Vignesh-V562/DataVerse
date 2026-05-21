from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)
db = client.insight_engine

async def save_session_state(session_id: str, data: dict):
    """Save or update session state in MongoDB"""
    await db.sessions.update_one(
        {"session_id": session_id},
        {"$set": data},
        upsert=True
    )

async def get_session_state(session_id: str) -> dict:
    """Retrieve session state from MongoDB"""
    session = await db.sessions.find_one({"session_id": session_id})
    return session if session else {}

async def save_chat_message(session_id: str, role: str, content: str, plot_data: dict = None):
    """Append a chat message to the session history"""
    message = {"role": role, "content": content}
    if plot_data:
        message["plot_data"] = plot_data
        
    await db.chat_history.update_one(
        {"session_id": session_id},
        {"$push": {"messages": message}},
        upsert=True
    )

async def get_chat_history(session_id: str) -> list:
    """Retrieve chat history for a session"""
    history = await db.chat_history.find_one({"session_id": session_id})
    return history.get("messages", []) if history else []

async def get_user_sessions(user_id: str) -> list:
    """Retrieve all sessions for a user, sorted by most recent first."""
    cursor = db.sessions.find(
        {"user_id": user_id},
        {"_id": 0, "session_id": 1, "filename": 1, "created_at": 1, "summary.total_rows": 1, "summary.total_columns": 1}
    ).sort("created_at", -1).limit(20)
    sessions = await cursor.to_list(length=20)
    return sessions

async def delete_session(session_id: str):
    """Delete a session, its associated chat history, and the physical dataset file."""
    # Retrieve the session to get the filepath
    session = await get_session_state(session_id)
    if session and session.get('filepath'):
        try:
            os.remove(session['filepath'])
        except OSError:
            pass # File might already be deleted or missing
            
    await db.sessions.delete_one({"session_id": session_id})
    await db.chat_history.delete_one({"session_id": session_id})
