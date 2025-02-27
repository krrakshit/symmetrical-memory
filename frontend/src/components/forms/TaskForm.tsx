// components/forms/TaskForm.tsx

import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "@/components/hooks/use-toast";
import { useAtom } from "jotai";
import { Organization } from "@/services/organization.service";
import { organizationsAtom } from "@/atoms/organizations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, type TaskFormData } from "@/lib/validations/task";

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  initialData?: TaskFormData;
  orgId?: string;
}

export default function TaskForm({ onSubmit, onCancel, initialData, orgId }: TaskFormProps) {
  const [organizations] = useAtom<(Organization & { isOwner: boolean })[]>(organizationsAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter organizations to only show owned orgs for task creation
  const ownedOrganizations = organizations.filter((org: Organization & { isOwner: boolean }) => org.isOwner);

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      dueAt: "",
      orgId: orgId || "",
      status: "pending"
    }
  });

  const handleSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast({
        title: "Success",
        description: "Task saved successfully!",
        type: "success"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save task",
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user is owner of the selected organization
  const selectedOrgId = form.watch("orgId");
  const selectedOrg = organizations.find(org => org.id === selectedOrgId);
  const isOwner = selectedOrg?.isOwner ?? false;

  // If not an owner, show message and disable form
  if (!isOwner && !initialData) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Only organization owners can create tasks.</p>
        <Button onClick={onCancel} className="mt-4">Close</Button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-200">Organization</label>
        <select
          {...form.register("orgId")}
          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 text-white"
          disabled={!!initialData || !!orgId} // Disable if editing existing task or orgId provided
        >
          <option value="">Select Organization</option>
          {ownedOrganizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
        {form.formState.errors.orgId && (
          <p className="text-red-500 text-sm">{form.formState.errors.orgId.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">Title</label>
        <input
          type="text"
          {...form.register("title")}
          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 text-white"
        />
        {form.formState.errors.title && (
          <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">Description</label>
        <textarea
          {...form.register("description")}
          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 text-white"
          rows={3}
        />
        {form.formState.errors.description && (
          <p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">Due Date</label>
        <input
          type="date"
          {...form.register("dueAt")}
          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 text-white"
        />
        {form.formState.errors.dueAt && (
          <p className="text-red-500 text-sm">{form.formState.errors.dueAt.message}</p>
        )}
      </div>

      {isOwner && (
        <div>
          <label className="block text-sm font-medium text-gray-200">Status</label>
          <select
            {...form.register("status")}
            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 text-white"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Task"}
        </Button>
      </div>
    </form>
  );
}
