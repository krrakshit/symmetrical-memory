// components/forms/JoinOrgForm.tsx
import { useState } from "react";
import { Button } from "../ui/button";

interface JoinOrgFormProps {
  onSubmit: (joinCode: string) => void;
  onCancel: () => void;
}

export default function JoinOrgForm({ onSubmit, onCancel }: JoinOrgFormProps) {
  const [joinCode, setJoinCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(joinCode);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Organization Join Code *
        </label>
        <input
          type="text"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          className="w-full p-2 bg-[#212121] border border-[#404040] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter the organization join code"
          required
        />
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <Button
          variant="outline"
          onClick={onCancel}
          className="bg-transparent border-gray-500 text-gray-300 hover:bg-[#404040] hover:text-white"
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          Join Organization
        </Button>
      </div>
    </form>
  );
}

