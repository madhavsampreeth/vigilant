# VIGIL.ANT — Anti-Piracy Detection Dashboard

A premium dark-theme React frontend for the VIGIL.ANT piracy detection platform.

## Quick Start

```bash
npm install
npm run dev
```

Requires FastAPI backend running at `http://127.0.0.1:8000`.

## API Endpoints Used
- `POST /analyze` — `{ original_path, suspect_path }` → `{ similarity, status }`
- `POST /register` — `{ video_path, video_id }` → `{ message }`

## Stack
- React 18 + Vite
- React Router DOM v6
- Axios
- Vanilla CSS (Orbitron + Rajdhani + Share Tech Mono fonts)