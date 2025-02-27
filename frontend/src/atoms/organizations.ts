import { atom } from "jotai";
import { Organization } from "@/services/organization.service";
import { authAtom } from "./authAtom";

// Define member type
export interface Member {
  id: string;
  fullName: string;
  email: string;
  isOwner: boolean;
  joinedAt: string;
}

// Extend Organization type to include members
export interface OrganizationWithMembers extends Organization {
  members: Member[];
}

// Main atom to store all organizations
export const organizationsAtom = atom<OrganizationWithMembers[]>([]);

// Helper functions for filtering organizations
export const filterOrganizationsForMember = (organizations: OrganizationWithMembers[], userId?: string) => {
  if (!userId) return [];
  return organizations.filter(org => 
    org.members.some(member => member.id === userId)
  );
};

export const filterOrganizationsForOwner = (organizations: OrganizationWithMembers[], userId?: string) => {
  if (!userId) return [];
  return organizations.filter(org => 
    org.members.some(member => 
      member.id === userId && member.isOwner === true
    )
  );
};

// Helper function to check if user is owner of specific organization
export const isUserOrgOwner = (org: OrganizationWithMembers | undefined, userId?: string) => {
  if (!org || !userId) return false;
  return org.members.some(member => 
    member.id === userId && member.isOwner === true
  );
};

// Derived atom for organizations where user is a member
export const memberOrganizationsAtom = atom((get) => {
  const organizations = get(organizationsAtom);
  const auth = get(authAtom);
  const userId = auth.user?.id;
  return filterOrganizationsForMember(organizations, userId);
});

// Derived atom for organizations where user is an owner
export const ownerOrganizationsAtom = atom((get) => {
  const organizations = get(organizationsAtom);
  const auth = get(authAtom);
  const userId = auth.user?.id;
  return filterOrganizationsForOwner(organizations, userId);
});

// Store current organization view state
export const currentOrgAtom = atom((get) => {
  const organizations = get(organizationsAtom);
  const userId = localStorage.getItem("userId");
  const currentOrg = organizations.find(org => org.members?.some(member => member.id === userId));
  return currentOrg ? currentOrg.id : null;
});

// Re-export auth atom for convenience
export { authAtom } from "./authAtom"; 