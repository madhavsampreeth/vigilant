


def extract_frames(video_path, fps=1):
    """
    Extract frames at a fixed rate (default: 1 frame per second)
    """
    import cv2

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        print("❌ Cannot open video")
        return []

    video_fps = cap.get(cv2.CAP_PROP_FPS)

    if video_fps == 0 or video_fps is None:
        video_fps = 25  # fallback FPS

    frame_interval = int(video_fps / fps)

    if frame_interval == 0:
        frame_interval = 1

    frames = []
    count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if count % frame_interval == 0:
            frames.append(frame)

        count += 1

    cap.release()

    print(f"🎞️ Extracted {len(frames)} frames at {fps} fps")

    return frames