// frontend/src/services/organization.service.ts

import api from "@/lib/axios";
import { Member } from "@/atoms/organizations";

// Define types
export interface Organization {
  id: string;
  name: string;
  description?: string;
  inviteCode: string;
  createdBy: string;
  createdAt: string;
  isOwner?: boolean;
  stats?: {
    pendingTasks: number;
    inProgressTasks: number;
    completedTasks: number;
    totalTasks: number;
    memberCount: number;
  };
  owner?: {
    id: string;
    fullName: string;
    email: string;
  };
  members: Member[];
  _count?: {
    members: number;
    tasks: number;
  };
}

export interface CreateOrgData {
  name: string;
  description?: string;
}

// Get all organizations the user is part of
export const getUserOrganizations = async (): Promise<Organization[]> => {
  try {
    const response = await api.get("/organizations");
    return response.data.organizations;
  } catch (error) {
    console.error("Error fetching organizations:", error);
    throw error;
  }
};

// Get a single organization by ID
export const getOrganizationById = async (orgId: string): Promise<Organization> => {
  try {
    const response = await api.get(`/organizations/${orgId}`);
    return response.data.organization;
  } catch (error) {
    console.error("Error fetching organization:", error);
    throw error;
  }
};

// Create a new organization
export const createOrganization = async (orgData: CreateOrgData): Promise<Organization> => {
  try {
    const response = await api.post("/organizations", orgData);
    return response.data.organization;
  } catch (error) {
    console.error("Error creating organization:", error);
    throw error;
  }
};

// Update an organization
export const updateOrganization = async (
  orgId: string,
  updates: Partial<CreateOrgData> & { refreshInviteCode?: boolean }
): Promise<Organization> => {
  try {
    const response = await api.put(`/organizations/${orgId}`, updates);
    return response.data.organization;
  } catch (error) {
    console.error("Error updating organization:", error);
    throw error;
  }
};

// Delete an organization
export const deleteOrganization = async (orgId: string): Promise<void> => {
  try {
    await api.delete(`/organizations/${orgId}`);
  } catch (error) {
    console.error("Error deleting organization:", error);
    throw error;
  }
};

// Join organization with invite code
export const joinOrganization = async (inviteCode: string): Promise<Organization> => {
  try {
    const response = await api.post("/organizations/join", { inviteCode });
    return response.data.organization;
  } catch (error) {
    console.error("Error joining organization:", error);
    throw error;
  }
};

// Generate a new join code for an organization
export const generateJoinCode = async (orgId: string): Promise<string> => {
  try {
    const response = await api.post(`/organizations/${orgId}/joinCode`);
    return response.data.joinCode;
  } catch (error) {
    console.error("Error generating join code:", error);
    throw error;
  }
};
