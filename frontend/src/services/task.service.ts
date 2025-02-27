// frontend/src/services/task.service.ts

import api from "@/lib/axios";

// Define types
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed";
  orgId: string;
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  dueAt: string;
  assignee?: {
    id: string;
    fullName: string;
    email: string;
  };
  creator?: {
    id: string;
    fullName: string;
    email: string;
  };
  organization?: {
    id: string;
    name: string;
  };
}

export interface CreateTaskData {
  title: string;
  description?: string;
  orgId: string;
  assignedTo?: string;
  dueAt: string;
  status: "pending" | "in_progress" | "completed";
}

// Get tasks for an organization
export const getTasks = async (orgId: string, filters?: { status?: string }): Promise<Task[]> => {
  try {
    let url = `/tasks/organization/${orgId}`;
    if (filters?.status) {
      url += `?status=${filters.status}`;
    }
    const response = await api.get(url);
    return response.data.tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// Get task by ID
export const getTaskById = async (taskId: string): Promise<Task> => {
  try {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data.task;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw error;
  }
};

// Create a new task
export const createTask = async (taskData: CreateTaskData): Promise<Task> => {
  try {
    // Ensure status is in the correct format
    const formattedData = {
      ...taskData,
      status: taskData.status.replace("-", "_") as "pending" | "in_progress" | "completed"
    };
    
    const response = await api.post("/tasks", formattedData);
    return response.data.task;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

// Update task status
export const updateTaskStatus = async (taskId: string, status: "pending" | "in_progress" | "completed"): Promise<Task> => {
  try {
    // Ensure status is in the correct format
    const formattedStatus = status.replace("-", "_");
    const response = await api.patch(`/tasks/${taskId}/status`, { status: formattedStatus });
    return response.data.task;
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
};

// Delete task
export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    await api.delete(`/tasks/${taskId}`);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

// Update task
export const updateTask = async (taskId: string, taskData: Partial<CreateTaskData>): Promise<Task> => {
  try {
    // Ensure status is in the correct format if it's being updated
    const formattedData = {
      ...taskData,
      status: taskData.status ? taskData.status.replace("-", "_") as "pending" | "in_progress" | "completed" : undefined
    };
    
    const response = await api.put(`/tasks/${taskId}`, formattedData);
    return response.data.task;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};
