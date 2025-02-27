// components/forms/JoinOrgForm.tsx
import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "@/components/hooks/use-toast";
import { joinOrganization } from "@/services/organization.service";

interface JoinOrgFormProps {
  onSubmit: (joinCode: string) => void;
  onCancel: () => void;
}

export default function JoinOrgForm({ onSubmit, onCancel }: JoinOrgFormProps) {
  const [inviteCode, setInviteCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter an invite code",
        type: "error"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const organization = await joinOrganization(inviteCode);
      toast({
        title: "Success",
        description: `Successfully joined ${organization.name}`,
        type: "success"
      });
      onSubmit(inviteCode);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to join organization",
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Organization Invite Code *
        </label>
        <input
          type="text"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          className="w-full p-2 bg-[#212121] border border-[#404040] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter the organization invite code"
          required
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
          {isSubmitting ? "Joining..." : "Join Organization"}
        </Button>
      </div>
    </form>
  );
}

