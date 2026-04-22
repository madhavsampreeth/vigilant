import json
import os

DB_PATH = "fingerprints.json"


def save_fingerprint(video_id, hashes):
    data = {}

    if os.path.exists(DB_PATH):
        with open(DB_PATH, "r") as f:
            data = json.load(f)

    data[video_id] = [str(h) for h in hashes]

    with open(DB_PATH, "w") as f:
        json.dump(data, f)


def load_fingerprints():
    if not os.path.exists(DB_PATH):
        return {}

    with open(DB_PATH, "r") as f:
        return json.load(f)