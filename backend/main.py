from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Insight Engine API", version="1.0.0")

# Configure CORS
origins = os.getenv("FRONTEND_URL", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routers.upload import router as upload_router
from routers.query import router as query_router
from routers.sessions import router as sessions_router

app.include_router(upload_router, prefix="/api")
app.include_router(query_router, prefix="/api")
app.include_router(sessions_router, prefix="/api")

@app.get("/api/health")
async def health_check():
    return {"status": "online", "message": "Insight Engine Backend is running"}

@app.get("/")
async def root_index():
    return {"status": "online", "application": "DataVerse Analytical Core Engine"}