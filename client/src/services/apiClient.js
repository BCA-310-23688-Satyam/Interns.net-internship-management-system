import axios from "axios";

import { clearStoredAuth, getStoredAuth } from "../lib/authStorage";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

apiClient.interceptors.request.use((config) => {
  const storedAuth = getStoredAuth();
  config.headers = config.headers || {};

  if (storedAuth.token) {
    config.headers.Authorization = `Bearer ${storedAuth.token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredAuth();
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Request failed";

    return Promise.reject(new Error(message));
  }
);
