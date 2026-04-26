import React, { useState, useEffect } from "react";
import "../styles/forms.css";
import toast from "react-hot-toast";

function UploadPanel() {
  const [videoName, setVideoName] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Uploading asset...");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? prev : prev + 10));
      }, 300);
    }
    return () => clearInterval(timer);
  }, [loading]);

  useEffect(() => {
    if (!loading) return;

    const steps = [
      "Encrypting asset...",
      "Extracting fingerprints...",
      "Syncing database...",
      "Finalizing upload..."
    ];

    let i = 0;
    const timer = setInterval(() => {
      setLoadingText(steps[i % steps.length]);
      i++;
    }, 1200);

    return () => clearInterval(timer);
  }, [loading]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const resetForm = () => {
    setVideoName("");
    setFile(null);
    setPreviewUrl("");
    setMsg("");
    setError("");
    setProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMsg("");
    setError("");
    setProgress(0);

    if (!videoName.trim()) {
      setError("Please enter a video name");
      toast.error("Enter video name");
      return;
    }

    if (!file) {
      setError("Please select a video file");
      toast.error("Select a video file");
      return;
    }

    try {
      setLoading(true);

      // 🔥 STEP 1: GET GCS URL
      const res1 = await fetch(`${API_URL}/gcs/generate-upload-url`);
      const { upload_url, video_url } = await res1.json();

      // 🔥 STEP 2: UPLOAD TO GCS
      await fetch(upload_url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "video/mp4"
        },
        body: file
      });

      // 🔥 STEP 3: REGISTER
      const formData = new FormData();
      formData.append("video_id", videoName);
      formData.append("video_url", video_url);

      const res2 = await fetch(`${API_URL}/register`, {
        method: "POST",
        body: formData
      });

      const data = await res2.json();

      if (data.error) {
        setError(data.error);
        toast.error("Upload failed!");
      } else {
        setProgress(100);
        setMsg(`Video "${videoName}" uploaded successfully`);
        toast.success("Video uploaded successfully!");
        resetForm();
      }

    } catch (err) {
      setError(err.message || "Upload failed");
      toast.error("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card panel-card">
      <div className="panel-header">
        <h2 className="panel-title">STORE ORIGINAL ASSET</h2>
        <p className="panel-description">
          Save original content fingerprints into detection database.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Video Name</label>
          <input
            className="form-input"
            type="text"
            value={videoName}
            placeholder="Enter unique video name"
            onChange={(e) => setVideoName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Upload Video</label>

          <label className="file-upload-box">
            <input
              type="file"
              accept="video/*"
              className="hidden-file-input"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <span className="file-upload-btn">Select Video</span>

            <span className="file-upload-name">
              {file ? file.name : "No file selected"}
            </span>
          </label>
        </div>

        {previewUrl && (
          <div className="form-group">
            <label className="form-label">Preview</label>

            <video
              src={previewUrl}
              controls
              preload="metadata"
              style={{
                width: "320px",
                height: "180px",
                borderRadius: "12px",
                border: "1px solid rgba(0,255,255,0.2)",
                background: "#000",
                objectFit: "cover"
              }}
            />
          </div>
        )}

        <div className="form-submit-area">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload & Save"}
          </button>

          {!loading && file && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
              style={{ marginLeft: "10px" }}
            >
              CLEAR
            </button>
          )}
        </div>
      </form>

      {loading && (
        <div className="progress-wrap">
          <div className="spinner"></div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <p className="progress-text">
            {progress}% • {loadingText}
          </p>
        </div>
      )}

      {msg && !loading && (
        <div className="success-msg result-animate">
          ✅ {msg}
        </div>
      )}

      {error && <div className="error-msg">⚠ {error}</div>}
    </div>
  );
}

export default UploadPanel;