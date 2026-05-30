import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const safariAPI = {
  discover: (preferences) => api.post("/safari/discover", preferences).then((response) => response.data),
  getActivity: (activityId, params = {}) => api.get(`/safari/activity/${activityId}`, { params }).then((response) => response.data),
  getMeta: () => api.get("/safari/meta").then((response) => response.data),
};

export default api;
