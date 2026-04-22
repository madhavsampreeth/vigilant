from app.processing.frame_extractor import extract_frames
from app.processing.preprocessing import preprocess_frame
from app.processing.hashing import generate_hash
from app.processing.matcher import compare_hashes
from app.processing.scorer import calculate_similarity
import cv2


def process_video(video1_path, video2_path):
    print("\n🚀 Starting video processing...")
    print("Video 1:", video1_path)
    print("Video 2:", video2_path)

    # 🔹 Step 1: Extract frames (sampled)
    frames1 = extract_frames(video1_path)
    frames2 = extract_frames(video2_path)

    print(f"🎞️ Frames extracted → Video1: {len(frames1)}, Video2: {len(frames2)}")

    # 🔹 Step 2: Preprocess + Hash
    hashes1 = []
    hashes2 = []

    print("\n🧬 Generating hashes...")

    for frame in frames1:
        processed = preprocess_frame(frame)
        h = generate_hash(processed)
        hashes1.append(h)

    for frame in frames2:
        processed = preprocess_frame(frame)
        h = generate_hash(processed)
        hashes2.append(h)

    print(f"✅ Hashes generated → {len(hashes1)} vs {len(hashes2)}")

    # 🔹 Step 3: Bidirectional Matching (IMPORTANT UPGRADE)
    distances = []

    print("\n🔍 Comparing frames with best-match strategy...")

    for h1 in hashes1:
        best_match = min([compare_hashes(h1, h2) for h2 in hashes2])
        distances.append(best_match)

    print("📊 Matching frames:", len(distances))

    # 🔹 Step 4: Similarity score
    similarity = calculate_similarity(distances)

    print("🔥 Similarity:", similarity)

    print("✅ Processing complete!\n")

    return similarity