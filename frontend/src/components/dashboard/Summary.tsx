//frontend/src/components/dashboard/Summary.tsx
import { motion } from "framer-motion";
import { Users, CheckSquare, Star, Plus, UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import CreateOrgForm from "../forms/CreateOrgForm";
import JoinOrgForm from "../forms/JoinOrgForm";
import { useAtom } from "jotai";
import { userProfileAtom } from "@/atoms/authAtom";
import { getUserOrganizations } from "@/services/organization.service";
import { getTasks } from "@/services/task.service";
import { authAtom } from "@/atoms/pageAtom";

interface SummaryProps {
  user: { fullName: string };
}

export default function Summary({ user }: SummaryProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useAtom(userProfileAtom);
  const [auth] = useAtom(authAtom);

  const summaryItems = [
    { 
      icon: Users, 
      label: "Organizations", 
      count: userProfile?.stats?.totalOrganizations || 0 
    },
    { 
      icon: CheckSquare, 
      label: "Tasks", 
      count: userProfile?.stats?.totalTasks || 0 
    },
    { 
      icon: Star, 
      label: "Completed Tasks", 
      count: userProfile?.stats?.completedTasks || 0 
    },
  ];

  const handleCreateOrg = (orgData: { name: string; description: string }) => {
    setIsCreateModalOpen(false);
  };

  const handleJoinOrg = (joinCode: string) => {
    setIsJoinModalOpen(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Set basic user info from auth
        setUserProfile(prev => ({
          ...prev,
          id: auth.user?.id || "",
          fullName: auth.user?.fullName || "",
          email: auth.user?.email || "",
          createdAt: auth.user?.createdAt || "",
        }));

        // Fetch organizations
        const orgs = await getUserOrganizations();
        
        // Fetch tasks for all organizations
        let allTasks = [];
        for (const org of orgs) {
          const tasks = await getTasks(org.id);
          allTasks.push(...tasks);
        }
        
        // Update user profile atom with stats
        setUserProfile(prev => ({
          ...prev,
          stats: {
            totalOrganizations: orgs.length,
            totalTasks: allTasks.length,
            pendingTasks: allTasks.filter(t => t.status === 'pending').length,
            completedTasks: allTasks.filter(t => t.status === 'completed').length,
            inProgressTasks: allTasks.filter(t => t.status === 'in-progress').length,
          }
        }));
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (auth.user) {
      fetchUserData();
    }
  }, [auth.user, setUserProfile]);

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-100">
          Welcome, {auth.user?.fullName || "User"}
        </h1>
        <p className="text-gray-400 mt-1">Here's an overview of your activity</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryItems.map((item, index) => (
          <motion.div
            key={item.label}
            className="bg-[#303030] bg-opacity-50 backdrop-blur-lg rounded-lg shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <item.icon className="h-8 w-8 text-blue-400 mr-3" />
                <h3 className="text-xl font-semibold text-gray-100">{item.label}</h3>
              </div>
              <span className="text-3xl font-bold text-gray-100">{item.count}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Organization Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Organization
        </Button>
        <Button
          onClick={() => setIsJoinModalOpen(true)}
          className="flex items-center justify-center bg-[#404040] hover:bg-[#505050] text-white"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Join Organization
        </Button>
      </div>

      {/* Create Organization Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create a New Organization"
      >
        <CreateOrgForm
          onSubmit={handleCreateOrg}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Join Organization Modal */}
      <Modal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        title="Join an Organization"
      >
        <JoinOrgForm
          onSubmit={handleJoinOrg}
          onCancel={() => setIsJoinModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

