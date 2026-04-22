import React, { useState, useEffect } from "react";
import { analyzeVideo } from "../services/api";
import "../styles/forms.css";
import toast from "react-hot-toast";

function AnalyzePanel() {
  const [videoName, setVideoName] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing scan...");
  const [scanStep, setScanStep] = useState("");

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!loading) return;

    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 92 ? prev : prev + 1));
    }, 500);

    return () => clearInterval(timer);
  }, [loading]);

  const clearFile = () => {
    setFile(null);
    setPreviewUrl("");
    setResult(null);
    setError("");
    setProgress(0);
    setScanStep("");
    setLoadingText("Initializing scan...");
  };

  const exportReport = () => {
    if (!result) return;

    const text = `
VIGILANT DETECTION REPORT
------------------------
Matched Video: ${result.matched_video}
Status: ${result.status}
Similarity: ${result.similarity}%
Confidence: ${result.confidence}
Hash Score: ${result.hash_score}%
Embedding Score: ${result.embedding_score}%
Reason: ${result.reason}

Detected Segments:
${
  result.segments?.length
    ? result.segments.map((s) => `${s.start} -> ${s.end}`).join("\n")
    : "None"
}

Generated: ${new Date().toLocaleString()}
`;

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "vigilant_report.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setResult(null);
    setError("");
    setProgress(0);

    if (!file) {
      toast.error("Select suspect video");
      return;
    }

    try {
      setLoading(true);
      setLoadingText("Uploading suspect stream...");
      setScanStep("Upload received...");

      const formData = new FormData();
      formData.append("video_name", videoName);
      formData.append("file", file);

      const res = await analyzeVideo(formData, (p) => {
        const mapped = Math.min(70, Math.round(p * 0.7));
        setProgress(mapped);

        if (mapped < 30) {
          setLoadingText("Uploading suspect stream...");
          setScanStep("Upload received...");
        } else if (mapped < 55) {
          setLoadingText("Extracting frames...");
          setScanStep("Frames received...");
        } else {
          setLoadingText("Comparing fingerprints...");
          setScanStep("Running threat engine...");
        }
      });

      setLoadingText("Finalizing detection...");
      setScanStep("Verdict ready");
      setProgress(100);

      if (res.error) {
        setError(res.error);
        toast.error("Analysis failed!");
      } else {
        setResult(res);

        if (res.status === "Safe") {
          toast.success("Safe Stream Detected");
        } else if (res.status === "Suspicious") {
          toast("Suspicious Stream Found");
        } else {
          toast.error("Pirated Content Detected!");
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Analysis failed"
      );
      toast.error("Analysis failed!");
    } finally {
      setLoading(false);
    }
  };

  const statusColor = () => {
    if (!result) return "#00e5ff";
    if (result.status === "Safe") return "#00c853";
    if (result.status === "Suspicious") return "#ffb300";
    return "#ff5252";
  };

  return (
    <div className="glass-card panel-card">
      <div className="panel-header">
        <h2 className="panel-title">SCAN SUSPECT STREAM</h2>
        <p className="panel-description">
          Compare uploaded content against stored database fingerprints.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Suspect Name</label>
          <input
            className="form-input"
            type="text"
            value={videoName}
            placeholder="Optional suspect label"
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
                objectFit: "cover",
              }}
            />
          </div>
        )}

        <div className="form-submit-area">
          <button
            className="btn btn-danger"
            type="submit"
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Stream"}
          </button>

          {file && !loading && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={clearFile}
              style={{ marginLeft: "12px" }}
            >
              Clear File
            </button>
          )}
        </div>
      </form>

      {loading && (
        <>
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

          <div className="scan-box">
            <div className="scan-title">LIVE SCAN PIPELINE</div>
            <div className="scan-step">{scanStep}</div>
          </div>
        </>
      )}

      {result && !loading && (
        <div
          className="result-card result-animate"
          style={{ borderColor: statusColor() }}
        >
          <div className="result-top">
            <h3>Detection Report</h3>

            <span
              className="status-badge"
              style={{ background: statusColor() }}
            >
              {result.status}
            </span>
          </div>

          <div className="result-grid">
            <div>
              <span>Matched Video</span>
              <strong>{result.matched_video}</strong>
            </div>

            <div>
              <span>Similarity</span>
              <strong>{result.similarity}%</strong>
            </div>

            <div>
              <span>Confidence</span>
              <strong>{result.confidence}</strong>
            </div>

            <div>
              <span>Hash Score</span>
              <strong>{result.hash_score}%</strong>
            </div>

            <div>
              <span>Embedding</span>
              <strong>{result.embedding_score}%</strong>
            </div>
          </div>

          <div className="reason-box">
            <span>Reason</span>
            <p>{result.reason}</p>
          </div>

          <div className="segment-box">
            <span>Detected Segments</span>

            {result.segments?.length ? (
              <ul>
                {result.segments.map((seg, idx) => (
                  <li key={idx}>
                    {seg.start} → {seg.end}
                  </li>
                ))}
              </ul>
            ) : (
              <p>None</p>
            )}
          </div>

          {result.thumbnails?.length > 0 && (
            <div className="evidence-box">
              <span>Matched Evidence</span>

              <div className="thumb-grid">
                {result.thumbnails.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="thumb"
                    className="thumb-img"
                  />
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: "16px" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={exportReport}
            >
              Export Report
            </button>
          </div>
        </div>
      )}

      {error && <div className="error-msg">⚠ {error}</div>}
    </div>
  );
}

export default AnalyzePanel;