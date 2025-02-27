//frontend/src/atoms/authAtom.ts

import { atomWithStorage } from "jotai/utils";

// Authentication state atom with persistent storage
export const authAtom = atomWithStorage("auth", {
  isAuthenticated: false,
  user: null,
  token: null
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
