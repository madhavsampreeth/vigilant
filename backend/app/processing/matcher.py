import numpy as np


def cosine_similarity(a, b):
    a = np.array(a, dtype=float)
    b = np.array(b, dtype=float)

    na = np.linalg.norm(a)
    nb = np.linalg.norm(b)

    if na == 0 or nb == 0:
        return 0

    return float(np.dot(a, b) / (na * nb))


def hamming_distance(h1, h2):
    return bin(int(h1, 16) ^ int(h2, 16)).count("1")


def compare_pair(h1, h2, e1, e2):
    emb = cosine_similarity(e1, e2)

    dist = hamming_distance(h1, h2)
    hsim = 1 - (dist / 64)

    # Hybrid score
    score = (0.45 * emb) + (0.55 * hsim)

    return score, hsim, emb


def match_videos(
    suspect_hashes,
    suspect_embeddings,
    stored_hashes,
    stored_embeddings,
    window=5
):
    # 🔥 FIX: fallback if embeddings missing
    if not stored_embeddings:
        stored_embeddings = ["0"] * len(stored_hashes)

    # convert embeddings string → list
    stored_emb = []
    for item in stored_embeddings:
        try:
            stored_emb.append([float(x) for x in item.split(",")])
        except:
            stored_emb.append([0])

    max_compare = min(len(suspect_hashes), len(suspect_embeddings))

    if max_compare == 0:
        return 0, 0, 0, []

    timeline_scores = []
    hash_scores = []
    emb_scores = []

    for i in range(max_compare):
        best_local = 0
        best_hash = 0
        best_emb = 0

        search_start = max(0, i - 8)
        search_end = min(len(stored_emb), i + 9)

        for j in range(search_start, search_end):
            if j >= len(stored_hashes):
                continue

            score, hs, es = compare_pair(
                suspect_hashes[i],
                stored_hashes[j],
                suspect_embeddings[i],
                stored_emb[j]
            )

            if score > best_local:
                best_local = score
                best_hash = hs
                best_emb = es

        timeline_scores.append(best_local)
        hash_scores.append(best_hash)
        emb_scores.append(best_emb)

    avg_score = sum(timeline_scores) / len(timeline_scores)

    top_scores = sorted(timeline_scores, reverse=True)[:window]
    top_avg = sum(top_scores) / len(top_scores)

    final_score = (0.65 * avg_score) + (0.35 * top_avg)

    avg_hash = sum(hash_scores) / len(hash_scores)
    avg_emb = sum(emb_scores) / len(emb_scores)

    return (
        round(final_score * 100, 2),
        round(avg_hash * 100, 2),
        round(avg_emb * 100, 2),
        timeline_scores
    )