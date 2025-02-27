// components/modals/OrganizationDetails.tsx

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { toast } from "@/components/hooks/use-toast";
import { getOrganizationById, deleteOrganization, Organization } from "@/services/organization.service";
import { getOrganizationMembers, updateMemberRole, removeMember, leaveOrganization } from "@/services/membership.service";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Copy } from "lucide-react";
import Modal from "@/components/ui/Modal";

interface OrganizationDetailsProps {
  orgId: string;
  onClose: () => void;
  onUpdate: () => void;
  onDelete: () => void;
}

export default function OrganizationDetails({ orgId, onClose, onUpdate, onDelete }: OrganizationDetailsProps) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showInviteCode, setShowInviteCode] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch organization details
        const orgData = await getOrganizationById(orgId);
        setOrganization(orgData);

        // Fetch members
        const membersData = await getOrganizationMembers(orgId);
        setMembers(membersData);
      } catch (error: any) {
        console.error("Error fetching organization details:", error);
        setError(error.message || "Failed to load organization details");
        toast({
          title: "Error",
          description: "Failed to load organization details",
          type: "error"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [orgId]);
  
  // Check if current user is the owner
  const isOwner = organization?.createdBy === user?.id;
  
  const handleRoleChange = async (userId: string, newRole: 'admin' | 'member') => {
    if (actionInProgress || !isOwner) return;
    
    setActionInProgress(true);
    try {
      await updateMemberRole(orgId, userId, newRole);
      
      // Update local state
      setMembers(members.map(member => 
        member.userId === userId 
          ? { ...member, role: newRole } 
          : member
      ));
      
      onUpdate();
      
      toast({
        title: "Success",
        description: `User role updated to ${newRole}`,
        type: "success",
      });
    } catch (error) {
      console.error("Failed to update member role:", error);
      toast({
        title: "Error",
        description: "Failed to update member role",
        type: "error",
      });
    } finally {
      setActionInProgress(false);
    }
  };
  
  const handleRemoveMember = async (userId: string) => {
    if (actionInProgress || !isOwner) return;
    
    setActionInProgress(true);
    try {
      await removeMember(orgId, userId);
      
      // Update local state
      setMembers(members.filter(member => member.userId !== userId));
      
      onUpdate();
      
      toast({
        title: "Success",
        description: "Member removed from organization",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to remove member:", error);
      toast({
        title: "Error",
        description: "Failed to remove member",
        type: "error",
      });
    } finally {
      setActionInProgress(false);
    }
  };
  
  const handleLeaveOrganization = async () => {
    if (actionInProgress || isOwner) return;
    
    setActionInProgress(true);
    try {
      await leaveOrganization(orgId);
      
      onDelete(); // Use same callback as delete since the result is similar
      onClose();
      
      toast({
        title: "Success",
        description: "You have left the organization",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to leave organization:", error);
      toast({
        title: "Error",
        description: "Failed to leave organization",
        type: "error",
      });
    } finally {
      setActionInProgress(false);
    }
  };
  
  const handleDeleteOrganization = async () => {
    if (actionInProgress || !isOwner) return;
    
    setActionInProgress(true);
    try {
      await deleteOrganization(orgId);
      
      onDelete();
      onClose();
      
      toast({
        title: "Success",
        description: "Organization deleted successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to delete organization:", error);
      toast({
        title: "Error",
        description: "Failed to delete organization",
        type: "error",
      });
    } finally {
      setActionInProgress(false);
      setShowDeleteConfirm(false);
    }
  };
  
  const copyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(organization?.inviteCode || "");
      toast({
        title: "Success",
        description: "Invite code copied to clipboard",
        type: "success"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy invite code",
        type: "error"
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={onClose}>Close</Button>
      </div>
    );
  }
  
  if (!organization) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Organization not found.</p>
        <Button onClick={onClose} className="mt-4">Close</Button>
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="p-6 max-h-[80vh] overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-100">{organization.name}</h2>
        <p className="text-gray-400 mt-2">{organization.description || "No description provided."}</p>
      </div>

      {/* Organization Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#404040] p-4 rounded-lg">
          <p className="text-sm text-gray-400">Total Members</p>
          <p className="text-xl font-bold text-gray-100">{organization.stats?.memberCount || 0}</p>
        </div>
        <div className="bg-[#404040] p-4 rounded-lg">
          <p className="text-sm text-gray-400">Total Tasks</p>
          <p className="text-xl font-bold text-gray-100">{organization.stats?.totalTasks || 0}</p>
        </div>
        <div className="bg-[#404040] p-4 rounded-lg">
          <p className="text-sm text-gray-400">Completed Tasks</p>
          <p className="text-xl font-bold text-gray-100">{organization.stats?.completedTasks || 0}</p>
        </div>
        <div className="bg-[#404040] p-4 rounded-lg">
          <p className="text-sm text-gray-400">Pending Tasks</p>
          <p className="text-xl font-bold text-gray-100">{organization.stats?.pendingTasks || 0}</p>
        </div>
      </div>

      {/* Members List */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-100 mb-4">Members</h3>
        <div className="space-y-4">
          {members.map((member) => (
            <motion.div
              key={member.id}
              className="bg-[#303030] p-4 rounded-lg flex items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div>
                <p className="text-gray-100 font-medium">{member.fullName}</p>
                <p className="text-gray-400 text-sm">{member.email}</p>
              </div>
              <div className="flex items-center space-x-2">
                {member.isOwner ? (
                  <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">Owner</span>
                ) : (
                  <span className="bg-gray-600 text-white px-2 py-1 rounded text-sm">Member</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Invite Code Section */}
      {organization.isOwner && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-100 mb-4">Invite Code</h3>
          <div className="flex items-center space-x-2">
            <code className="bg-[#303030] px-3 py-1 rounded text-white flex-1">
              {showInviteCode ? organization.inviteCode : "••••••••••••"}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInviteCode(!showInviteCode)}
            >
              {showInviteCode ? "Hide" : "Show"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={copyInviteCode}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-4 mt-6">
        <Button
          variant="outline"
          onClick={onClose}
          className="bg-transparent border-gray-500 text-gray-300 hover:bg-gray-700"
        >
          Close
        </Button>
        
        {!isOwner && (
          <Button
            onClick={handleLeaveOrganization}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={actionInProgress}
          >
            Leave Organization
          </Button>
        )}
        
        {isOwner && (
          <Button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={actionInProgress}
          >
            Delete Organization
          </Button>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <Modal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          title="Delete Organization"
        >
          <div className="p-6 text-center">
            <h3 className="text-lg font-medium text-white mb-4">
              Are you sure you want to delete this organization?
            </h3>
            <p className="text-gray-400 mb-6">
              This action cannot be undone. All tasks and data will be permanently deleted.
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={actionInProgress}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteOrganization}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={actionInProgress}
              >
                {actionInProgress ? "Deleting..." : "Delete Organization"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
