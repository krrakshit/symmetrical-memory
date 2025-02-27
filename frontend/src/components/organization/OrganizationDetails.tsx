import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Users, CheckSquare, Clock, Copy, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "@/components/hooks/use-toast";
import {
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
} from "@/services/organization.service";
import { getTasks } from "@/services/task.service";
import TaskList from "../tasks/TaskList";
import Modal from "../ui/Modal";
import { useAtom } from "jotai";
import { userProfileAtom } from "@/atoms/authAtom";

interface OrganizationDetailsProps {
  orgId: string;
  onBack: () => void;
}

export default function OrganizationDetails({ orgId, onBack }: OrganizationDetailsProps) {
  const [organization, setOrganization] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({ name: "", description: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userProfile] = useAtom(userProfileAtom);

  const fetchOrgDetails = async () => {
    try {
      const org = await getOrganizationById(orgId);
      setOrganization(org);
      setEditData({
        name: org.name,
        description: org.description || "",
      });
    } catch (error) {
      console.error("Failed to fetch organization details:", error);
      toast({
        title: "Error",
        description: "Failed to load organization details",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgDetails();
  }, [orgId]);

  const handleCopyInviteCode = () => {
    if (organization?.inviteCode) {
      navigator.clipboard.writeText(organization.inviteCode);
      toast({
        title: "Success",
        description: "Invite code copied to clipboard",
        type: "success",
      });
    }
  };

  const handleRefreshInviteCode = async () => {
    try {
      const updatedOrg = await updateOrganization(orgId, { refreshInviteCode: true });
      setOrganization(updatedOrg);
      toast({
        title: "Success",
        description: "Invite code refreshed successfully",
        type: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh invite code",
        type: "error",
      });
    }
  };

  const handleUpdateOrg = async () => {
    try {
      const updatedOrg = await updateOrganization(orgId, editData);
      setOrganization(updatedOrg);
      setIsEditMode(false);
      toast({
        title: "Success",
        description: "Organization updated successfully",
        type: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update organization",
        type: "error",
      });
    }
  };

  const handleDeleteOrg = async () => {
    try {
      await deleteOrganization(orgId);
      toast({
        title: "Success",
        description: "Organization deleted successfully",
        type: "success",
      });
      onBack();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete organization",
        type: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          {!isEditMode ? (
            <h2 className="text-2xl font-bold text-gray-100">{organization.name}</h2>
          ) : (
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="bg-[#212121] text-white text-2xl font-bold px-2 py-1 rounded"
            />
          )}
        </div>
        {organization.isOwner && (
          <div className="flex space-x-2">
            {isEditMode ? (
              <>
                <Button onClick={() => setIsEditMode(false)} variant="ghost">
                  Cancel
                </Button>
                <Button onClick={handleUpdateOrg} className="bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setIsEditMode(true)} variant="ghost">
                  Edit
                </Button>
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="bg-[#303030] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-2">Description</h3>
        {!isEditMode ? (
          <p className="text-gray-300">{organization.description || "No description provided."}</p>
        ) : (
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="w-full bg-[#212121] text-white px-3 py-2 rounded"
            rows={3}
          />
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="bg-[#303030] rounded-lg p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-100">Members</h3>
          </div>
          <p className="text-3xl font-bold text-gray-100 mt-2">
            {organization.stats?.memberCount || 0}
          </p>
        </motion.div>

        <motion.div
          className="bg-[#303030] rounded-lg p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-3">
            <CheckSquare className="h-6 w-6 text-green-400" />
            <h3 className="text-lg font-semibold text-gray-100">Tasks</h3>
          </div>
          <p className="text-3xl font-bold text-gray-100 mt-2">
            {organization.stats?.totalTasks || 0}
          </p>
        </motion.div>

        <motion.div
          className="bg-[#303030] rounded-lg p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-3">
            <Clock className="h-6 w-6 text-yellow-400" />
            <h3 className="text-lg font-semibold text-gray-100">Pending Tasks</h3>
          </div>
          <p className="text-3xl font-bold text-gray-100 mt-2">
            {organization.stats?.pendingTasks || 0}
          </p>
        </motion.div>
      </div>

      {/* Invite Code Section */}
      {organization.isOwner && (
        <div className="bg-[#303030] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Invite Members</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-[#212121] p-3 rounded-lg">
              <code className="text-gray-100">{organization.inviteCode}</code>
            </div>
            <Button onClick={handleCopyInviteCode} variant="ghost">
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button onClick={handleRefreshInviteCode} variant="ghost">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      )}

      {/* Tasks Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-100 mb-4">Tasks</h3>
        <TaskList orgId={orgId} />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Organization"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete this organization? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteOrg}
            >
              Delete Organization
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 