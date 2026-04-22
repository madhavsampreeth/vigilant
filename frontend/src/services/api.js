import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const registerVideo = async (formData, onProgress) => {
  const response = await api.post("/register/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (event) => {
      if (!event.total) return;

      const percent = Math.round(
        (event.loaded * 100) / event.total
      );

      if (onProgress) onProgress(percent);
    },
  });

  return response.data;
};

export const analyzeVideo = async (formData, onProgress) => {
  const response = await api.post("/analyze/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (event) => {
      if (!event.total) return;

      const percent = Math.round(
        (event.loaded * 100) / event.total
      );

      if (onProgress) onProgress(percent);
    },
  });

  return response.data;
};

export const getDashboardData = async () => {
  const response = await api.get("/result/");
  return response.data;
};

export default api;