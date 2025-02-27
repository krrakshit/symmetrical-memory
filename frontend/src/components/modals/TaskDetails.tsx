// components/modals/TaskDetails.tsx

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { toast } from "@/components/hooks/use-toast";
import { 
  getTaskById, 
  updateTaskStatus,
  deleteTask,
  Task 
} from "@/services/task.service";
import { getOrganizationById } from "@/services/organization.service";
import { useAuth } from "@/hooks/useAuth";

interface TaskDetailsProps {
  taskId: string;
  onClose: () => void;
  onUpdate: () => void;
  onDelete: () => void;
}

export default function TaskDetails({ taskId, onClose, onUpdate, onDelete }: TaskDetailsProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        setLoading(true);
        const taskData = await getTaskById(taskId);
        setTask(taskData);
        setSelectedStatus(taskData.status);
        
        // Check if user is owner of the organization
        const orgData = await getOrganizationById(taskData.orgId);
        setIsOwner(orgData.createdBy === user?.id);
      } catch (error: any) {
        console.error("Failed to fetch task details:", error);
        toast({
          title: "Error",
          description: "Failed to load task details",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTaskDetails();
  }, [taskId, user?.id]);
  
  const handleStatusChange = async (status: string) => {
    if (!task || updating) return;
    
    setUpdating(true);
    try {
      const updatedTask = await updateTaskStatus(
        taskId, 
        status as "pending" | "in-progress" | "completed"
      );
      setTask(updatedTask);
      setSelectedStatus(updatedTask.status);
      onUpdate();
      
      toast({
        title: "Success",
        description: "Task status updated",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to update task status:", error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        type: "error",
      });
    } finally {
      setUpdating(false);
    }
  };
  
  const handleDelete = async () => {
    if (updating) return;
    
    setUpdating(true);
    try {
      await deleteTask(taskId);
      onDelete();
      
      toast({
        title: "Success",
        description: "Task deleted successfully",
        type: "success",
      });
      
      onClose();
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        type: "error",
      });
    } finally {
      setUpdating(false);
      setShowDeleteConfirm(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!task) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Task not found or was deleted.</p>
        <Button onClick={onClose} className="mt-4">
          Close
        </Button>
      </div>
    );
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="max-h-[80vh] overflow-y-auto p-1">
      {showDeleteConfirm ? (
        <div className="p-6 text-center">
          <h3 className="text-lg font-medium text-white mb-4">
            Are you sure you want to delete this task?
          </h3>
          <p className="text-gray-400 mb-6">
            This action cannot be undone. The task will be permanently deleted.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              className="bg-transparent border-gray-500 text-gray-300 hover:bg-gray-700"
              disabled={updating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={updating}
            >
              {updating ? "Deleting..." : "Delete Task"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-white">{task.title}</h2>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="bg-transparent border-gray-500 text-gray-300 hover:bg-gray-700"
              >
                Close
              </Button>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Description</h3>
            <p className="text-white whitespace-pre-line">
              {task.description || "No description provided."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Status</h3>
              <select
                value={selectedStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full p-2 bg-[#212121] border border-[#404040] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={updating}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            {isOwner && (
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Assigned To</h3>
                <p className="text-white">{task.assignee?.fullName || "Unassigned"}</p>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Organization</h3>
              <p className="text-white">{task.organization?.name || "Unknown"}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Due Date</h3>
              <p className="text-white">
                {task.dueAt ? formatDate(task.dueAt) : "No due date"}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Created By</h3>
              <p className="text-white">{task.creator?.fullName || "Unknown"}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Created Date</h3>
              <p className="text-white">{formatDate(task.createdAt)}</p>
            </div>
          </div>
          
          {isOwner && (
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={updating}
              >
                Delete Task
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
