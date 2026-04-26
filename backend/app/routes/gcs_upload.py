from fastapi import APIRouter
from google.cloud import storage
import uuid

router = APIRouter()

BUCKET_NAME = "vigilant-vid-storage1"

@router.get("/generate-upload-url")
def generate_upload_url():
    blob_name = f"videos/{uuid.uuid4()}.mp4"

    upload_url = f"https://storage.googleapis.com/{BUCKET_NAME}/{blob_name}"

    return {
        "upload_url": upload_url,
        "video_url": f"gs://{BUCKET_NAME}/{blob_name}"
    }