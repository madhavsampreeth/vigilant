import os

embedder = None


def get_model():
    global embedder

    if embedder is None:
        import mediapipe as mp

        BASE_DIR = os.path.dirname(os.path.abspath(__file__))

        MODEL_PATH = os.path.abspath(
            os.path.join(BASE_DIR, "..", "..", "models", "image_embedder.tflite")
        )

        # 🔥 SAFETY CHECK
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model not found at {MODEL_PATH}")

        BaseOptions = mp.tasks.BaseOptions
        ImageEmbedder = mp.tasks.vision.ImageEmbedder
        ImageEmbedderOptions = mp.tasks.vision.ImageEmbedderOptions
        VisionRunningMode = mp.tasks.vision.RunningMode

        options = ImageEmbedderOptions(
            base_options=BaseOptions(model_asset_path=MODEL_PATH),
            running_mode=VisionRunningMode.IMAGE
        )

        embedder = ImageEmbedder.create_from_options(options)

    return embedder


def get_embedding(frame):
    try:
        import mediapipe as mp   # 🔥 FIX: import here also

        embedder = get_model()

        mp_image = mp.Image(
            image_format=mp.ImageFormat.SRGB,
            data=frame
        )

        result = embedder.embed(mp_image)

        if not result.embeddings:
            return [0.0] * 64

        return result.embeddings[0].embedding[:64]

    except Exception as e:
        print("Embedding error:", e)
        return [0.0] * 64