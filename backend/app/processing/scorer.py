def calculate_similarity(distances, threshold=20):
    """
    Balanced scoring for phash
    """

    if not distances:
        return 0, 0

    matched_frames = sum(1 for d in distances if d <= threshold)
    total_frames = len(distances)

    similarity = (matched_frames / total_frames) * 100

    return round(similarity, 2), matched_frames