// frontend/src/services/auth.service.ts

import api from "@/lib/axios";

// Define types
export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  token: string;
}

// Login user
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/login", data);
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      // Set the token in axios default headers
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// Register new user
export const signup = async (data: SignupData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/signup", data);
    return response.data;
  } catch (error) {
    console.error("Signup failed:", error);
    throw error;
  }
};

// Check authentication status
export const checkAuth = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    
    // Set the token in axios default headers
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    const response = await api.get("/auth/me");
    return {
      isAuthenticated: true,
      user: response.data.user
    };
  } catch (error) {
    localStorage.removeItem("token");
    delete api.defaults.headers.common['Authorization'];
    return {
      isAuthenticated: false,
      user: null
    };
  }
};

// Logout user
export const logout = async (): Promise<void> => {
  try {
    await api.post("/auth/logout");
  } finally {
    // Always clear token and headers
    localStorage.removeItem("token");
    delete api.defaults.headers.common['Authorization'];
  }
};
