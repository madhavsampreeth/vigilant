import os
from google.cloud import storage

# Set credentials path
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "service-account.json"

client = storage.Client()

BUCKET_NAME = "vigilant-vid-storage"  # change if needed


def upload_file_to_gcs(local_path, destination_blob_name):
    try:
        bucket = client.bucket(BUCKET_NAME)
        blob = bucket.blob(destination_blob_name)

        blob.upload_from_filename(local_path)

        print(f"✅ Upload SUCCESS: {destination_blob_name}")

        return f"gs://{BUCKET_NAME}/{destination_blob_name}"

    except Exception as e:
        print("❌ GCS Upload Failed:", e)
        return None