from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os


# ✅ Create app FIRST
app = FastAPI(title="Vigilant API",redirect_slashes=False)
# Firebase init on startup
@app.on_event("startup")
def startup_event():
    from app.services.firebase_init import init_firebase
    init_firebase()

# ✅ Import routes AFTER app creation
from app.routes import upload, analyze, register, result, gcs_upload

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static folder
STATIC_BASE = "/tmp/static"
THUMB_DIR = os.path.join(STATIC_BASE, "thumbs")
os.makedirs(THUMB_DIR, exist_ok=True)

app.mount("/static", StaticFiles(directory=STATIC_BASE), name="static")

# ✅ Include routers AFTER import
app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(analyze.router, prefix="/analyze", tags=["Analyze"])
app.include_router(register.router, prefix="/register", tags=["Register"])
app.include_router(result.router, prefix="/result", tags=["Dashboard"])
app.include_router(gcs_upload.router, prefix="/gcs", tags=["GCS"])  # 👈 YEH YAHAN

@app.get("/")
def root():
    return {"message": "API working 🚀"}