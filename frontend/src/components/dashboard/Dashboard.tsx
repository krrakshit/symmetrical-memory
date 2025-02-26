import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import Header from "./Header";
import Sidebar from "./Sidebar";
import Summary from "./Summary";
import Organizations from "./Organizations";
import Tasks from "./Tasks";
import Profile from "./Profile";

import { useAtom } from "jotai";
import { loginAtom } from "@/atoms/authAtom";

type View = "summary" | "organizations" | "tasks" | "profile";

export default function Dashboard() {
  const [view, setView] = useState<View>("summary"); // State to track active view
  const [user] = useAtom(loginAtom);

  useEffect(() => {
    // Fetch user data here if not already in the atom
  }, []);

  const renderView = () => {
    switch (view) {
      case "summary":
        return <Summary />;
      case "organizations":
        return <Organizations />;
      case "tasks":
        return <Tasks />;
      case "profile":
        return <Profile />;
      default:
        return <Summary />;
    }
  };

  return (
    <div className="flex h-screen bg-[#09090b] text-gray-100">
      {/* Pass `view` as `currentView` to Sidebar */}
      <Sidebar setView={setView} currentView={view} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user ?? { fullName: "User" }} />

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

