//frontend/src/components/dashboard/Header.tsx
import { Settings, LogOut, User } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "../hooks/use-toast";
import { useState } from "react";
import { useAtom } from "jotai";
import { userProfileAtom } from "@/atoms/authAtom";
import Modal from "../ui/Modal";
import Profile from "./Profile";

export default function Header() {
  const { logout } = useAuth();
  const [userProfile] = useAtom(userProfileAtom);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Success",
        description: "Logged out successfully",
        type: "success"
      });
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Error",
        description: "Failed to logout",
        type: "error"
      });
    }
  };

  return (
    <>
      <motion.header
        className="bg-[#2e2e2e] shadow-md p-4 flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>

        <div className="flex items-center space-x-4">
          {/* Profile Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:bg-[#212121] hover:text-gray-100 focus:bg-[#4d4d4d] focus:text-gray-100 transition duration-200"
            onClick={() => setShowProfileModal(true)}
          >
            <User className="h-5 w-5" />
          </Button>

          {/* Settings Icon Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:bg-[#212121] hover:text-gray-100 focus:bg-[#4d4d4d] focus:text-gray-100 transition duration-200"
          >
            <Settings className="h-5 w-5" />
          </Button>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:bg-red-500 hover:text-gray-100 cursor-pointer transition duration-200"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </motion.header>

      {/* Profile Modal */}
      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="Profile"
      >
        <Profile />
      </Modal>
    </>
  );
}

