from fastapi import APIRouter, UploadFile, File, Form
import os
import shutil

from app.processing.frame_extractor import extract_frames
from app.processing.preprocessing import preprocess_frame
from app.processing.hashing import generate_hash
from app.services.firestore_service import save_fingerprint

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/")
async def upload_video(
    video_name: str = Form(...),
    file: UploadFile = File(...)
):
    try:
        # ---------- Save File ----------
        ext = os.path.splitext(file.filename)[1]
        safe_name = video_name.strip().replace(" ", "_")
        filename = f"{safe_name}{ext}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        print("\n📥 UPLOAD STARTED")
        print("Saved:", file_path)

        # ---------- Extract Frames ----------
        frames = extract_frames(file_path)

        if not frames:
            return {"error": "No frames extracted"}

        print("🎞️ Frames:", len(frames))

        # ---------- Generate Hashes ----------
        hashes = []

        for frame in frames:
            processed = preprocess_frame(frame)
            h = generate_hash(processed)
            hashes.append(str(h))

        print("🧬 Hashes:", len(hashes))

        # ---------- Save to Firestore ----------
        save_fingerprint(safe_name, hashes)

        print("☁️ Saved to Firestore:", safe_name)

        return {
            "message": "Uploaded & fingerprint stored successfully",
            "video_name": safe_name,
            "frames": len(hashes),
            "path": file_path
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": str(e)}