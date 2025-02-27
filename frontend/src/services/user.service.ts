// frontend/src/services/user.service.ts

import api from "@/lib/axios";

// Define types
export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

export interface UserStats {
  totalOrganizations: number;
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
}

export interface RecentActivity {
  id: string;
  type: "task";
  title: string;
  status?: string;
  timestamp: string;
}

export interface UserData {
  user: UserProfile;
  stats?: UserStats;
  recentActivity?: RecentActivity[];
}

// Get current user profile
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await api.get("/user/profile");
    return response.data.user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (updates: {
  fullName?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}): Promise<UserProfile> => {
  try {
    const response = await api.put("/user/profile", updates);
    return response.data.user;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Get user statistics
export const getUserStats = async (): Promise<{
  stats: UserStats;
  recentActivity: RecentActivity[];
}> => {
  try {
    const response = await api.get("/user/stats");
    return {
      stats: response.data.stats,
      recentActivity: response.data.recentActivity,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
};

// Get comprehensive user data (profile + stats)
export const getUserData = async (): Promise<UserData> => {
  try {
    // Fetch profile and stats in parallel
    const [profileResponse, statsResponse] = await Promise.all([
      api.get("/user/profile"),
      api.get("/user/stats"),
    ]);

    return {
      user: profileResponse.data.user,
      stats: statsResponse.data.stats,
      recentActivity: statsResponse.data.recentActivity,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
