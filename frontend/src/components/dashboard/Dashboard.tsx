//frontend/src/components/dashboard/Dashboard.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import Header from "./Header";
import Sidebar from "./Sidebar";
import Summary from "./Summary";
import Organizations from "./Organizations";
import Tasks from "./Tasks";
import Profile from "./Profile";

import { useAtom } from "jotai";
import { userProfileAtom } from "@/atoms/authAtom";

type View = "summary" | "organizations" | "tasks" | "profile";

export default function Dashboard() {
  const [view, setView] = useState<View>("summary");
  const [userProfile, setUserProfile] = useAtom(userProfileAtom);

  // You can use userProfile.stats to display statistics
  // and userProfile.recentActivity to show recent activities

  // Example: When fetching user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/profile');
        const data = await response.json();

        setUserProfile({
          id: data.id,
          fullName: data.fullName,
          email: data.email,
          createdAt: data.createdAt,
          stats: {
            totalOrganizations: data.stats.totalOrganizations,
            totalTasks: data.stats.totalTasks,
            pendingTasks: data.stats.pendingTasks,
            completedTasks: data.stats.completedTasks,
            inProgressTasks: data.stats.inProgressTasks,
          },
          recentActivity: data.recentActivity,
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserData();
  }, [setUserProfile]);

  const renderView = () => {
    switch (view) {
      case "summary":
        return <Summary user={userProfile ?? { fullName: "User" }} />;
      case "organizations":
        return <Organizations />;
      case "tasks":
        return <Tasks />;
      case "profile":
        return <Profile />;
      default:
        return <Summary user={userProfile ?? { fullName: "User" }} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#09090b] text-gray-100">
      <Sidebar setView={setView} currentView={view} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <motion.main
          className="flex-1 overflow-x-hidden overflow-y-auto bg-[#212121] p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {renderView()}
        </motion.main>
      </div>
    </div>
  );
}

