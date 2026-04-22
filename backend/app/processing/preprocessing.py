

def preprocess_frame(frame):
    """
    Preprocess frame for robust hashing
    """
    import cv2
    # Resize (smaller = more robust)
    frame = cv2.resize(frame, (64, 64))

    # Convert to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Normalize brightness (helps against filters)
    normalized = cv2.equalizeHist(gray)

    return normalized