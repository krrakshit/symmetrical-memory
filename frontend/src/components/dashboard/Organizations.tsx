//frontend/src/components/dashboard/Organizations.tsx
import { motion } from "framer-motion"
import { Plus, ArrowLeft } from "lucide-react"
import { Button } from "../ui/button"
import { useState, useEffect } from "react"
import Modal from "../ui/Modal";
import CreateOrgForm from "../forms/CreateOrgForm";
import { getUserOrganizations, getOrganizationById, Organization } from "@/services/organization.service";
import { toast } from "../hooks/use-toast";
import { useAtom } from "jotai";
import { organizationViewAtom } from "@/atoms/pageAtom";
import { organizationsAtom, memberOrganizationsAtom, isUserOrgOwner } from "@/atoms/organizations";
import OrganizationDetails from "../modals/OrganizationDetails";
import { useAuth } from "@/hooks/useAuth";

export default function Organizations() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [organizationView, setOrganizationView] = useAtom(organizationViewAtom);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [, setOrganizations] = useAtom(organizationsAtom);
  const [memberOrgs] = useAtom(memberOrganizationsAtom);
  const { user } = useAuth();

  const fetchOrganizations = async () => {
    try {
      const response = await getUserOrganizations();
      // Store the raw API response in the atom
      setOrganizations(response);
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
      toast({
        title: "Error",
        description: "Failed to load organizations",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchOrganizations();
    }
  }, [user?.id]);

  const fetchOrgDetails = async (orgId: string) => {
    try {
      const org = await getOrganizationById(orgId);
      setCurrentOrg(org);
    } catch (error) {
      console.error("Failed to fetch organization details:", error);
      toast({
        title: "Error",
        description: "Failed to load organization details",
        type: "error"
      });
    }
  };

  useEffect(() => {
    if (organizationView.selectedOrgId) {
      fetchOrgDetails(organizationView.selectedOrgId);
    }
  }, [organizationView.selectedOrgId]);

  const handleCreateOrg = async () => {
    setIsCreateModalOpen(false);
    await fetchOrganizations();
  };

  const handleOrgClick = (orgId: string) => {
    setOrganizationView({
      view: "details",
      selectedOrgId: orgId
    });
  };

  const handleBackToList = () => {
    setOrganizationView({
      view: "list",
      selectedOrgId: null
    });
    setCurrentOrg(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (organizationView.view === "details" && currentOrg) {
    return (
      <div>
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            className="mr-4"
            onClick={handleBackToList}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Organizations
          </Button>
          <h2 className="text-2xl font-bold text-gray-100">{currentOrg.name}</h2>
        </div>
        <OrganizationDetails
          orgId={organizationView.selectedOrgId!}
          onClose={handleBackToList}
          onUpdate={() => fetchOrgDetails(organizationView.selectedOrgId!)}
          onDelete={() => {
            handleBackToList();
            fetchOrganizations();
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-100">My Organizations</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Organization
        </Button>
      </div>
      {memberOrgs.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400 mb-4">You haven't joined any organizations yet.</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Create Your First Organization
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memberOrgs.map((org, index) => (
            <motion.div
              key={org.id}
              className="bg-[#303030] bg-opacity-50 backdrop-blur-lg rounded-lg shadow-lg p-6 cursor-pointer hover:bg-opacity-70 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => handleOrgClick(org.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-100">{org.name}</h3>
                {isUserOrgOwner(org, user?.id) && (
                  <span className="px-2 py-1 text-xs bg-blue-500 text-white rounded">Owner</span>
                )}
              </div>
              <p className="text-gray-300 mb-4">{org.description}</p>
              <div className="mt-4 text-sm text-gray-400">
                <p>Members: {org.members?.length || 0}</p>
                <p>Tasks: {org._count?.tasks || 0}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
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
    </div>
  );
}


