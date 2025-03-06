// frontend/src/lib/axios.ts

import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { toast } from "@/components/hooks/use-toast";

const api = axios.create({
  baseURL: "http://52.66.237.233:3000/api", // Your existing backend URL
  withCredentials: true, // Ensures cookies are sent
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear auth state and redirect to login
      localStorage.removeItem("token");
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      toast({
        title: "Session Expired",
        description: "Please log in again",
        type: "error"
      });
    } else if (error.response?.status === 403) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to perform this action",
        type: "error"
      });
    } else if (error.response?.status === 500) {
      toast({
        title: "Server Error",
        description: "Something went wrong. Please try again later.",
        type: "error"
      });
    }
    return Promise.reject(error);
  },
);

// Helper methods for more convenient API calls
export const apiService = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    api.get<T>(url, config).then((response) => response.data),

  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    api.post<T>(url, data, config).then((response) => response.data),

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    api.put<T>(url, data, config).then((response) => response.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    api.delete<T>(url, config).then((response) => response.data),

  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    api.patch<T>(url, data, config).then((response) => response.data),
};

export default api;
