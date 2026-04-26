import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// REGISTER (NOT USED NOW BUT SAFE)
export const registerVideo = async (formData, onProgress) => {
  const response = await api.post("/register/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (event) => {
      if (!event.total) return;
      const percent = Math.round((event.loaded * 100) / event.total);
      if (onProgress) onProgress(percent);
    },
  });
  return response.data;
};

// 🔥 ANALYZE (URL BASED)
export const analyzeByUrl = async (videoUrl) => {
  const response = await api.post(
    "/analyze/",
    new URLSearchParams({ video_url: videoUrl }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return response.data;
};

// 🔥 SIGNED URL
export const getSignedUrl = async () => {
  const response = await api.get("/gcs/generate-upload-url");
  return response.data;
};

// DASHBOARD
export const getDashboardData = async () => {
  const response = await api.get("/result/");
  return response.data;
};

export default api;