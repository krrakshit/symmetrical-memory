//frontend/src/components/dashboard/Profile.tsx
import { motion } from "framer-motion"
import { Button } from "../ui/button"
import { useAtom } from "jotai"
import { userProfileAtom } from "@/atoms/authAtom"
import { authAtom } from "@/atoms/pageAtom"
import { useState } from "react"
import { toast } from "../hooks/use-toast"
import Modal from "../ui/Modal"
import api from "@/lib/axios"

export default function Profile() {
  const [userProfile] = useAtom(userProfileAtom);
  const [auth, setAuth] = useAtom(authAtom);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(auth.user?.fullName || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleUpdateProfile = async () => {
    if (!newName.trim()) {
      toast({
        title: "Error",
        description: "Name cannot be empty",
        type: "error"
      });
      return;
    }

    setIsUpdating(true);
    try {
      const response = await api.put("/users/profile", {
        fullName: newName
      });

      // Update auth state with new name
      setAuth(prev => ({
        ...prev,
        user: {
          ...prev.user,
          fullName: newName
        }
      }));

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
        type: "success"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
        type: "error"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div
      className="bg-[#303030] bg-opacity-50 backdrop-blur-lg rounded-lg shadow-lg p-6 max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-100 mb-6">My Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-300">Full Name</label>
          {isEditing ? (
            <div className="mt-1">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-2 bg-[#404040] border border-gray-600 rounded text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
              <div className="mt-2 flex space-x-2">
                <Button
                  onClick={handleUpdateProfile}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Save"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setNewName(auth.user?.fullName || "");
                  }}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-lg font-medium text-gray-100">{auth.user?.fullName || 'N/A'}</p>
          )}
        </div>
        <div>
          <label className="text-sm text-gray-300">Email</label>
          <p className="text-lg font-medium text-gray-100">{auth.user?.email || 'N/A'}</p>
        </div>
        <div>
          <label className="text-sm text-gray-300">Member Since</label>
          <p className="text-lg font-medium text-gray-100">
            {formatDate(auth.user?.createdAt)}
          </p>
        </div>
        <div>
          <label className="text-sm text-gray-300">Statistics</label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="bg-[#404040] p-3 rounded-lg">
              <p className="text-sm text-gray-400">Total Organizations</p>
              <p className="text-xl font-bold text-gray-100">{userProfile?.stats?.totalOrganizations || 0}</p>
            </div>
            <div className="bg-[#404040] p-3 rounded-lg">
              <p className="text-sm text-gray-400">Total Tasks</p>
              <p className="text-xl font-bold text-gray-100">{userProfile?.stats?.totalTasks || 0}</p>
            </div>
            <div className="bg-[#404040] p-3 rounded-lg">
              <p className="text-sm text-gray-400">Completed Tasks</p>
              <p className="text-xl font-bold text-gray-100">{userProfile?.stats?.completedTasks || 0}</p>
            </div>
            <div className="bg-[#404040] p-3 rounded-lg">
              <p className="text-sm text-gray-400">Pending Tasks</p>
              <p className="text-xl font-bold text-gray-100">{userProfile?.stats?.pendingTasks || 0}</p>
            </div>
          </div>
        </div>
      </div>
      {!isEditing && (
        <Button 
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsEditing(true)}
        >
          Edit Profile
        </Button>
      )}
    </motion.div>
  );
}


