// components/forms/TaskForm.tsx

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { toast } from "@/components/hooks/use-toast";
import { useAtom } from "jotai";
import { ownerOrganizationsAtom, isUserOrgOwner } from "@/atoms/organizations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, type TaskFormData } from "@/lib/validations/task";
import { getOrganizationMembers } from "@/services/membership.service";
import { createTask, updateTask } from "@/services/task.service";
import { useAuth } from "@/hooks/useAuth";

interface TaskFormProps {
  onSubmit: () => void;
  onCancel: () => void;
  initialData?: TaskFormData;
  orgId?: string;
}

export default function TaskForm({ onSubmit, onCancel, initialData, orgId }: TaskFormProps) {
  const [ownerOrgs] = useAtom(ownerOrganizationsAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      dueAt: "",
      orgId: orgId || "",
      status: "pending",
      assignedTo: ""
    }
  });

  // Fetch members when organization is selected
  useEffect(() => {
    const fetchMembers = async () => {
      const selectedOrgId = form.watch("orgId");
      if (selectedOrgId) {
        try {
          setLoading(true);
          const orgMembers = await getOrganizationMembers(selectedOrgId);
          setMembers(orgMembers);
        } catch (error) {
          console.error("Failed to fetch members:", error);
          toast({
            title: "Error",
            description: "Failed to load organization members",
            type: "error"
          });
        } finally {
          setLoading(false);
        }
      } else {
        setMembers([]);
      }
    };

    fetchMembers();
  }, [form.watch("orgId")]);

  const handleSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      // Ensure we have all required fields
      if (!data.title || !data.orgId || !data.dueAt) {
        throw new Error("Please fill in all required fields");
      }

      // Format the data
      const taskData = {
        title: data.title,
        description: data.description,
        orgId: data.orgId,
        assignedTo: data.assignedTo || undefined,
        dueAt: data.dueAt,
        status: data.status || "pending"
      };

      if (initialData?.id) {
        // Update existing task
        await updateTask(initialData.id, taskData);
      } else {
        // Create new task
        await createTask(taskData);
      }
      
      toast({
        title: "Success",
        description: `Task ${initialData ? 'updated' : 'created'} successfully!`,
        type: "success"
      });
      onSubmit();
    } catch (error: any) {
      console.error("Task submission error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || `Failed to ${initialData ? 'update' : 'create'} task`,
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user is owner of the selected organization
  const selectedOrgId = form.watch("orgId");
  const selectedOrg = ownerOrgs.find(org => org.id === selectedOrgId);
  const isOwner = selectedOrg && isUserOrgOwner(selectedOrg, user?.id);

  // If not an owner and trying to create a new task, show message
  if (!isOwner && !initialData && selectedOrgId) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Only organization owners can create tasks.</p>
        <Button onClick={onCancel} className="mt-4">Close</Button>
      </div>
    );
  }

  // If user is not an owner of any organization, show message
  if (ownerOrgs.length === 0 && !initialData && !orgId) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">You must be an organization owner to create tasks.</p>
        <Button onClick={onCancel} className="mt-4">Close</Button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto p-4">
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">Organization</label>
        <select
          {...form.register("orgId")}
          className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
          disabled={!!initialData || !!orgId}
        >
          <option value="">Select Organization</option>
          {ownerOrgs.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
        {form.formState.errors.orgId && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.orgId.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">Title</label>
        <input
          type="text"
          {...form.register("title")}
          className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
          placeholder="Enter task title"
        />
        {form.formState.errors.title && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">Description</label>
        <textarea
          {...form.register("description")}
          className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
          placeholder="Enter task description"
          rows={4}
        />
        {form.formState.errors.description && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.description.message}</p>
        )}
      </div>

      {selectedOrgId && (
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Assign To</label>
          <select
            {...form.register("assignedTo")}
            className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="">Select Member</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.fullName}
              </option>
            ))}
          </select>
          {loading && (
            <p className="text-gray-400 text-sm mt-1">Loading members...</p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">Due Date</label>
        <input
          type="date"
          {...form.register("dueAt")}
          className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
        />
        {form.formState.errors.dueAt && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.dueAt.message}</p>
        )}
      </div>

      {isOwner && (
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Status</label>
          <select
            {...form.register("status")}
            className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
}
