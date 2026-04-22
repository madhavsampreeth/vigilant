from fastapi import APIRouter
from firebase_admin import firestore
from app.services.firestore_service import load_fingerprints
from datetime import datetime, timezone

router = APIRouter()


def format_time(ts):
    try:
        if not ts:
            return "Now"

        now = datetime.now(timezone.utc)
        diff = now - ts.replace(tzinfo=timezone.utc)

        sec = int(diff.total_seconds())

        if sec < 60:
            return "Just now"
        if sec < 3600:
            return f"{sec // 60} min ago"
        if sec < 86400:
            return f"{sec // 3600} hr ago"

        return f"{sec // 86400} day ago"

    except:
        return "Now"


@router.get("/")
def get_dashboard_data():
    db = firestore.client()

    videos = load_fingerprints()
    total_videos = len(videos)

    docs = list(
        db.collection("detections")
        .order_by("timestamp", direction=firestore.Query.DESCENDING)
        .limit(20)
        .stream()
    )

    threat_feed = []
    recent_activity = []

    threat_alerts = 0
    safe_streams = 0

    for doc in docs:
        d = doc.to_dict()

        status = d.get("status", "Unknown")
        video = d.get("video", "unknown")
        ts = d.get("timestamp")
        time_text = format_time(ts)

        # stats
        if status in ["Pirated", "Suspicious", "Exact Match"]:
            threat_alerts += 1
        else:
            safe_streams += 1

        # threat feed
        if status in ["Pirated", "Suspicious", "Exact Match"]:
            threat_feed.append({
                "id": doc.id,
                "title": f"{status} detected - {video}",
                "ip": "Threat Alert",
                "time": time_text
            })

        # activity log
        if status == "Safe":
            action = f"Safe scan completed - {video}"
        elif status == "Suspicious":
            action = f"Suspicious stream found - {video}"
        elif status in ["Pirated", "Exact Match"]:
            action = f"Pirated content flagged - {video}"
        else:
            action = f"{status} - {video}"

        recent_activity.append({
            "action": action,
            "time": time_text
        })

    # uploaded assets also add
    for vid in list(videos.keys())[:5]:
        recent_activity.append({
            "action": f"Asset registered - {vid}",
            "time": "Stored"
        })

    return {
        "stats": {
            "registered_assets": total_videos,
            "threat_alerts": threat_alerts,
            "safe_streams": safe_streams
        },
        "threat_feed": threat_feed[:5],
        "recent_activity": recent_activity[:8]
    }