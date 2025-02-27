//frontend/src/atoms/authAtom.ts

import { atomWithStorage } from "jotai/utils";

// Authentication state atom with persistent storage
export const authAtom = atomWithStorage("auth", {
  isAuthenticated: false,
  user: null,
  token: null
}, {
  getItem: (key, initialValue) => {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      const parsed = JSON.parse(storedValue);
      // Store userId separately for easier access
      if (parsed.user?.id) {
        localStorage.setItem("userId", parsed.user.id);
      } else {
        localStorage.removeItem("userId");
      }
      return parsed;
    }
    return initialValue;
  },
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
    // Store userId separately for easier access
    if (value.user?.id) {
      localStorage.setItem("userId", value.user.id);
    } else {
      localStorage.removeItem("userId");
    }
  },
  removeItem: (key) => {
    localStorage.removeItem(key);
    localStorage.removeItem("userId");
  },
});

// User profile details for display
export const userProfileAtom = atomWithStorage("userProfile", {
  id: "",
  fullName: "",
  email: "",
  createdAt: "",
  stats: {
    totalOrganizations: 0,
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
  },
  recentActivity: [] as {
    id: string;
    type: "task" | "organization";
    title: string;
    timestamp: string;
    status?: string;
  }[],
});

// Login form state
export const loginAtom = atomWithStorage("loginForm", {
  email: "",
  password: ""
});

// Signup form state
export const signupAtom = atomWithStorage("signupForm", {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
});
