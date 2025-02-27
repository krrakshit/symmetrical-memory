import { atomWithStorage } from "jotai/utils";
import { Organization } from "@/services/organization.service";

// Store organizations with their ownership status
export const organizationsAtom = atomWithStorage<(Organization & { isOwner: boolean })[]>("organizations", []);

// Store current organization view state
export const currentOrgAtom = atomWithStorage<string | null>("currentOrg", null);

// Re-export auth atom for convenience
export { authAtom } from "./authAtom"; 