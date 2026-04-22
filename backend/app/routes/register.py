from fastapi import APIRouter, UploadFile, File, Form
import os, uuid
from datetime import datetime
from firebase_admin import firestore
from app.services.gcs_service import upload_file_to_gcs
from app.processing.frame_extractor import extract_frames
from app.processing.preprocessing import preprocess_frame
from app.processing.hashing import generate_hash
from app.processing.ai_embedding import get_embedding

router = APIRouter()

TEMP_DIR = "/tmp"
os.makedirs(TEMP_DIR, exist_ok=True)


@router.post("/")
async def register_video(video_id: str = Form(...), file: UploadFile = File(...)):
    temp_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}.mp4")

    content = await file.read()
    with open(temp_path, "wb") as f:
        f.write(content)

    upload_file_to_gcs(temp_path, f"original/{video_id}.mp4")

    frames = extract_frames(temp_path, fps=0.5)[:50]

    hashes = []
    embeddings = []

    for frame in frames:
        processed = preprocess_frame(frame)

        hashes.append(str(generate_hash(processed)))

        emb = get_embedding(frame)
        emb_str = ",".join(map(str, emb))

        embeddings.append(emb_str)

    firestore.client().collection("videos").document(video_id).set({
        "hashes": hashes,
        "embeddings": embeddings,
        "created_at": datetime.utcnow()
    })

    os.remove(temp_path)

    return {"message": "Registered"}