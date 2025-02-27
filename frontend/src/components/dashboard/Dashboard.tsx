//frontend/src/components/dashboard/Dashboard.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import Header from "./Header";
import Sidebar from "./Sidebar";
import Summary from "./Summary";
import Organizations from "./Organizations";
import Tasks from "./Tasks";

import { useAtom } from "jotai";
import { userProfileAtom } from "@/atoms/authAtom";
import { authAtom } from "@/atoms/pageAtom";
import { toast } from "../hooks/use-toast";

type View = "summary" | "organizations" | "tasks";

export default function Dashboard() {
  const [view, setView] = useState<View>("summary");
  const [userProfile, setUserProfile] = useAtom(userProfileAtom);
  const [auth] = useAtom(authAtom);

  // You can use userProfile.stats to display statistics
  // and userProfile.recentActivity to show recent activities

  useEffect(() => {
    const initializeUserProfile = () => {
      if (auth.user) {
        setUserProfile(prev => ({
          ...prev,
          id: auth.user.id,
          fullName: auth.user.fullName,
          email: auth.user.email,
          createdAt: auth.user.createdAt,
          stats: prev?.stats || {
            totalOrganizations: 0,
            totalTasks: 0,
            pendingTasks: 0,
            completedTasks: 0,
            inProgressTasks: 0,
          }
        }));
      }
    };

    initializeUserProfile();
  }, [auth.user, setUserProfile]);

  const renderView = () => {
    switch (view) {
      case "summary":
        return <Summary user={auth.user || { fullName: "User" }} />;
      case "organizations":
        return <Organizations />;
      case "tasks":
        return <Tasks />;
      default:
        return <Summary user={auth.user || { fullName: "User" }} />;
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

