from fastapi import APIRouter, Form
import os, uuid, tempfile
from datetime import datetime
from firebase_admin import firestore
from google.cloud import storage

from app.processing.frame_extractor import extract_frames
from app.processing.preprocessing import preprocess_frame
from app.processing.hashing import generate_hash
from app.processing.ai_embedding import get_embedding

router = APIRouter()


# ---------- GCS DOWNLOAD ----------
def download_from_gcs(gs_url: str):
    parts = gs_url.replace("gs://", "").split("/")
    bucket_name = parts[0]
    blob_path = "/".join(parts[1:])

    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(blob_path)

    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
    blob.download_to_filename(temp_file.name)

    return temp_file.name


# ---------- REGISTER ----------
@router.post("/")
async def register_video(
    video_id: str = Form(...),
    video_url: str = Form(...)
):
    try:
        print("\n📥 REGISTER STARTED")

        # 1️⃣ Download from GCS
        temp_path = download_from_gcs(video_url)
        print("📥 Downloaded:", temp_path)

        # 2️⃣ Extract frames
        frames = extract_frames(temp_path, fps=0.5)[:50]

        if not frames:
            return {"error": "No frames extracted"}

        hashes = []
        embeddings = []

        # 3️⃣ Generate fingerprints
        for frame in frames:
            processed = preprocess_frame(frame)

            hashes.append(str(generate_hash(processed)))

            emb = get_embedding(frame)
            embeddings.append(",".join(map(str, emb)))

        print("🧬 Hashes:", len(hashes))
        print("🧠 Embeddings:", len(embeddings))

        # 4️⃣ Save to Firestore
        firestore.client().collection("videos").document(video_id).set({
            "hashes": hashes,
            "embeddings": embeddings,
            "created_at": datetime.utcnow(),
            "video_url": video_url
        })

        # 5️⃣ Cleanup
        os.remove(temp_path)

        return {
            "message": "Registered successfully",
            "video_id": video_id,
            "frames": len(hashes)
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": str(e)}