//frontend/src/atoms/authAtom.ts
import { atom } from "jotai";

// Basic login state
export const loginAtom = atom({}); // Default empty auth state

// Signup form state
export const signupAtom = atom({
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
});

// User profile details for display on home/summary page
export const userProfileAtom = atom({
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
