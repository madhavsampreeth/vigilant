from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# 🔥 Initialize Firebase (VERY IMPORTANT)
from app.services import firebase_init

# Routes
try:
    from app.routes import upload, analyze, register, result
except Exception as e:
    print("❌ Route import error:", e)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 Cloud Run safe static directory
STATIC_BASE = "/tmp/static"
THUMB_DIR = os.path.join(STATIC_BASE, "thumbs")

os.makedirs(THUMB_DIR, exist_ok=True)

# Serve static files
app.mount("/static", StaticFiles(directory=STATIC_BASE), name="static")

# Routes
app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(analyze.router, prefix="/analyze", tags=["Analyze"])
app.include_router(register.router, prefix="/register", tags=["Register"])
app.include_router(result.router, prefix="/result", tags=["Dashboard"])

# Root endpoint
@app.get("/")
def root():
    return {"message": "API working 🚀"}