// frontend/src/services/membership.service.ts

import api from "@/lib/axios";

// Define types
export interface Member {
  id: string;
  fullName: string;
  email: string;
  joinedAt?: string;
  isOwner: boolean;
}

// Get members of an organization
export const getOrganizationMembers = async (orgId: string): Promise<Member[]> => {
  try {
    const response = await api.get(`/memberships/organization/${orgId}`);
    return response.data.members;
  } catch (error) {
    console.error("Error fetching organization members:", error);
    throw error;
  }
};

// Update member role
export const updateMemberRole = async (
  orgId: string,
  userId: string,
  role: "admin" | "member"
): Promise<Member> => {
  try {
    const response = await api.put(`/memberships/organization/${orgId}/member/${userId}/role`, {
      role,
    });
    return response.data.member;
  } catch (error) {
    console.error("Error updating member role:", error);
    throw error;
  }
};

// Remove a member from an organization
export const removeMember = async (orgId: string, userId: string): Promise<void> => {
  try {
    await api.delete(`/memberships/organization/${orgId}/member/${userId}`);
  } catch (error) {
    console.error("Error removing member:", error);
    throw error;
  }
};

// Leave an organization
export const leaveOrganization = async (orgId: string): Promise<void> => {
  try {
    await api.delete(`/memberships/organization/${orgId}/leave`);
  } catch (error) {
    console.error("Error leaving organization:", error);
    throw error;
  }
};
