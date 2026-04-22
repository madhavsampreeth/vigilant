from fastapi import APIRouter, UploadFile, File
import os
import uuid
import cv2
from datetime import datetime
from firebase_admin import firestore

from app.processing.frame_extractor import extract_frames
from app.processing.preprocessing import preprocess_frame
from app.processing.hashing import generate_hash
from app.processing.ai_embedding import get_embedding
from app.processing.matcher import match_videos
from app.services.firestore_service import load_fingerprints

router = APIRouter()

TEMP_DIR = "/tmp"
THUMB_DIR = "/tmp/static/thumbs"

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
async def analyze_video(file: UploadFile = File(...)):
    temp_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}.mp4")

    try:
        content = await file.read()

        with open(temp_path, "wb") as f:
            f.write(content)

        # Extract frames (1 frame every 2 sec)
        frames = extract_frames(temp_path, fps=0.5)[:40]

        suspect_hashes = []
        suspect_embeddings = []

        for frame in frames:
            processed = preprocess_frame(frame)

            suspect_hashes.append(
                str(generate_hash(processed))
            )

            suspect_embeddings.append(
                get_embedding(frame)
            )

        db_data = load_fingerprints()

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

        # ----------------------------
        # Segment Detection
        # ----------------------------
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

        # ----------------------------
        # Real Thumbnail Generation
        # ----------------------------
        thumbnails = []

        for idx, (start, end) in enumerate(raw_segments[:3]):
            frame_index = start // 2

            if frame_index < len(frames):
                filename = f"{uuid.uuid4()}.jpg"
                filepath = os.path.join(
                    THUMB_DIR,
                    filename
                )

                cv2.imwrite(filepath, frames[frame_index])

                thumbnails.append(
                    f"/static/thumbs/{filename}"
                )

        # Save detection log
        firestore.client().collection("detections").add({
            "video": best_video,
            "score": best_score,
            "status": status,
            "confidence": confidence,
            "timestamp": datetime.utcnow()
        })

        return {
            "matched_video": best_video,
            "similarity": round(best_score, 2),
            "hash_score": round(best_hash, 2),
            "embedding_score": round(best_emb, 2),
            "status": status,
            "confidence": confidence,
            "reason": reason,
            "segments": segments[:5],
            "thumbnails": thumbnails
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": str(e)}

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)