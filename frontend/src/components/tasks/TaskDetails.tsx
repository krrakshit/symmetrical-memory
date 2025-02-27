import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { organizationsAtom } from '@/atoms/organizations';

export function TaskDetails({ task, onStatusChange }: TaskDetailsProps) {
  const [organizations] = useAtom(organizationsAtom);
  const org = organizations.find(o => o.id === task.orgId);
  const isOwner = org?.isOwner ?? false;

  const handleStatusChange = async (newStatus: string) => {
    try {
      await onStatusChange(newStatus);
      toast.success("Task status updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update task status");
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white">{task.title}</h3>
        <p className="text-gray-400">{task.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400">Organization</label>
          <p className="text-white">{org?.name}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400">Created By</label>
          <p className="text-white">{task.creator?.fullName}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400">Due Date</label>
          <p className="text-white">{new Date(task.dueAt).toLocaleDateString()}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400">Status</label>
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {isOwner && (
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => {}}>
            Edit
          </Button>
        </div>
      )}
    </div>
  );
} 