from fastapi import APIRouter
from app.worker.processor import process_video
import os

router = APIRouter()

@router.post("/")
def analyze_video(video_path: str):
    # Check if file exists
    if not os.path.exists(video_path):
        return {"error": "File not found"}

    try:
        # For hackathon: compare same video (you can later pass 2 videos)
        similarity = process_video(video_path, video_path)

        result = {
            "similarity": similarity,
            "status": "Pirated" if similarity > 85 else "Safe"
        }

        return result

    except Exception as e:
        return {"error": str(e)}