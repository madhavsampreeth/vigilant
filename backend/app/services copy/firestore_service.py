from firebase_admin import firestore
from app.services.firebase_init import *


def save_fingerprint(video_id, data):
    db = firestore.client()

    db.collection("videos").document(video_id).set({
        "hashes": data["hashes"],
        "embeddings": data["embeddings"]
    })


def load_fingerprints():
    db = firestore.client()

    docs = db.collection("videos").stream()

    result = {}

    for doc in docs:
        d = doc.to_dict()

        result[doc.id] = {
            "hashes": d.get("hashes", []),
            "embeddings": d.get("embeddings", [])
        }

    return result