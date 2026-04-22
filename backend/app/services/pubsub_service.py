from google.cloud import pubsub_v1
from app.config import settings

publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(settings.PROJECT_ID, settings.PUBSUB_TOPIC)

def publish_message(message: str):
    publisher.publish(topic_path, message.encode("utf-8"))