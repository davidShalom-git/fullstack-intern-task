import axios from "axios";
import { useAuthStore } from "../Auth/AuthStore.js";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getErrorMessage(error) {
  return (
    error.response?.data?.message ||
    "We could not complete that request. Please try again."
  );
}
