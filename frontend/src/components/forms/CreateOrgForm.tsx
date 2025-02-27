// components/forms/CreateOrgForm.tsx

import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "@/components/hooks/use-toast"; // Fixed import
import { createOrganization } from "@/services/organization.service";

interface CreateOrgFormProps {
  onSubmit: (orgData: { name: string; description: string }) => void;
  onCancel: () => void;
}

export default function CreateOrgForm({ onSubmit, onCancel }: CreateOrgFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   
    // Validate form
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Organization name is required",
        type: "error", // Changed from variant to type to match your toast implementation
      });
      return;
    }
   
    setIsSubmitting(true);
   
    try {
      // Call the API service to create organization
      await createOrganization({ name, description }); // Removed unused newOrg variable
     
      // Call the parent component's onSubmit with new org data
      onSubmit({ name, description });
     
      toast({
        title: "Success!",
        description: "Organization created successfully",
        type: "success", // Changed from variant to type
      });
     
      // Reset form fields
      setName("");
      setDescription("");
    } catch (err) {
      console.error("Failed to create organization:", err);
      toast({
        title: "Error",
        description: "Failed to create organization. Please try again.",
        type: "error", // Changed from variant to type
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Organization Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 bg-[#212121] border border-[#404040] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Description (Optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 bg-[#212121] border border-[#404040] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <Button
          variant="outline"
          onClick={onCancel}
          className="bg-transparent border-gray-500 text-gray-300 hover:bg-[#404040] hover:text-white"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Organization"}
        </Button>
      </div>
    </form>
  );
}
