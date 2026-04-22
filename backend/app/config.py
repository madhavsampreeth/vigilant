import os

class Settings:
    GCS_BUCKET = os.getenv("GCS_BUCKET", "your-bucket-name")
    PROJECT_ID = os.getenv("PROJECT_ID", "your-project-id")
    PUBSUB_TOPIC = os.getenv("PUBSUB_TOPIC", "video-analysis")

settings = Settings()