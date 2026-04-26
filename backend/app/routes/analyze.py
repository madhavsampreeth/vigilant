
from fastapi import APIRouter, UploadFile, File
import os
import uuid
import cv2
from datetime import datetime
from firebase_admin import firestore
from fastapi import Form
from app.services.firebase_init import init_firebase
from app.processing.frame_extractor import extract_frames
from app.processing.preprocessing import preprocess_frame
from app.processing.hashing import generate_hash
from app.processing.ai_embedding import get_embedding
from app.processing.matcher import match_videos
from app.services.firestore_service import get_all_videos
from google.cloud import storage
router = APIRouter()

TEMP_DIR = "/tmp"
THUMB_DIR = "/tmp/static/thumbs"
from google.cloud import storage

def download_from_gcs(gcs_url):
    client = storage.Client()

    parts = gcs_url.replace("gs://", "").split("/", 1)
    bucket_name = parts[0]
    blob_name = parts[1]

    bucket = client.bucket(bucket_name)
    blob = bucket.blob(blob_name)

    local_path = f"/tmp/{blob_name.split('/')[-1]}"
    blob.download_to_filename(local_path)

    return local_path
os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(THUMB_DIR, exist_ok=True)


def get_decision(score, strong_matches):
    if score >= 68 and strong_matches >= 3:
        return "Pirated", "High", "Strong sequential match detected"

    if score >= 48:
        return "Suspicious", "Medium", "Partial similarity detected"

    return "Safe", "Low", "No meaningful similarity detected"


def sec_to_mmss(sec):
    m = sec // 60
    s = sec % 60
    return f"{int(m):02d}:{int(s):02d}"


@router.post("/")
async def analyze_video(video_url: str = Form(...)):
    temp_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}.mp4")

    try:
        # 🔥 Firebase init (IMPORTANT)
        init_firebase()

        temp_path = download_from_gcs(video_url)

        # Extract frames
        frames = extract_frames(temp_path, fps=1)[:80]

        suspect_hashes = []
        suspect_embeddings = []

        for frame in frames:
            processed = preprocess_frame(frame)

            suspect_hashes.append(str(generate_hash(processed)))
            suspect_embeddings.append(get_embedding(frame))

        # 🔥 Load DB from Firestore
        videos = get_all_videos()

        db_data = {
            vid["id"]: {
                "hashes": vid.get("hashes", []),
                "embeddings": vid.get("embeddings", [])
            }
            for vid in videos
        }

        if not db_data:
            return {"error": "No videos found in database"}

        best_video = None
        best_score = 0
        best_hash = 0
        best_emb = 0
        best_timeline = []

        for video_id, data in db_data.items():
            score, h_score, e_score, timeline = match_videos(
                suspect_hashes,
                suspect_embeddings,
                data["hashes"],
                data["embeddings"]
            )

            if score > best_score:
                best_score = score
                best_video = video_id
                best_hash = h_score
                best_emb = e_score
                best_timeline = timeline

        strong_matches = sum(
            1 for x in best_timeline if x > 0.62
        )

        status, confidence, reason = get_decision(
            best_score,
            strong_matches
        )

        # -------- Segment Detection --------
        raw_segments = []

        for i, score in enumerate(best_timeline):
            if score > 0.62:
                start = i * 2
                end = start + 2
                raw_segments.append((start, end))

        segments = []

        if raw_segments:
            cur_start, cur_end = raw_segments[0]

            for s, e in raw_segments[1:]:
                if s <= cur_end:
                    cur_end = e
                else:
                    segments.append({
                        "start": sec_to_mmss(cur_start),
                        "end": sec_to_mmss(cur_end)
                    })
                    cur_start, cur_end = s, e

            segments.append({
                "start": sec_to_mmss(cur_start),
                "end": sec_to_mmss(cur_end)
            })

        # -------- Thumbnails --------
        thumbnails = []

        for idx, (start, end) in enumerate(raw_segments[:3]):
            frame_index = start // 2

            if frame_index < len(frames):
                filename = f"{uuid.uuid4()}.jpg"
                filepath = os.path.join(THUMB_DIR, filename)

                cv2.imwrite(filepath, frames[frame_index])

                # Upload thumbnail to GCS
                bucket = storage.Client().bucket("vigilant-vid-storage1")
                blob = bucket.blob(f"thumbnails/{filename}")
                blob.upload_from_filename(filepath)

                public_url = f"https://storage.googleapis.com/vigilant-vid-storage1/thumbnails/{filename}"

                thumbnails.append(public_url)

        # 🔥 Save detection log
        db = firestore.client()

        db.collection("detections").add({
            "video": best_video,
            "score": best_score,
            "status": status,
            "confidence": confidence,
            "timestamp": datetime.utcnow()
        })
        def gcs_to_http(url):
            return url.replace("gs://", "https://storage.googleapis.com/")
        thumbnails_http = thumbnails
        return {
            "matched_video": best_video,
            "similarity": round(best_score, 2),
            "hash_score": round(best_hash, 2),
            "embedding_score": round(best_emb, 2),
            "status": status,
            "confidence": confidence,
            "reason": reason,
            "segments": segments[:5],
            "thumbnails": thumbnails_http
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": str(e)}

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)