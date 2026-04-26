from firebase_admin import firestore
from app.services.firebase_init import init_firebase


def get_db():
    """
    Initialize Firebase safely and return Firestore client
    """
    init_firebase()
    return firestore.client()


# 🔥 SAVE VIDEO DATA
def save_video_data(video_id: str, data: dict):
    db = get_db()
    db.collection("videos").document(video_id).set(data)


# 🔥 GET VIDEO DATA
def get_video_data(video_id: str):
    db = get_db()
    doc = db.collection("videos").document(video_id).get()

    if doc.exists:
        return doc.to_dict()
    return None


# 🔥 GET ALL VIDEOS
def get_all_videos():
    db = get_db()
    docs = db.collection("videos").stream()

    results = []
    for doc in docs:
        item = doc.to_dict()
        item["id"] = doc.id
        results.append(item)

    return results


# 🔥 UPDATE VIDEO DATA
def update_video_data(video_id: str, data: dict):
    db = get_db()
    db.collection("videos").document(video_id).update(data)


# 🔥 DELETE VIDEO
def delete_video(video_id: str):
    db = get_db()
    db.collection("videos").document(video_id).delete()