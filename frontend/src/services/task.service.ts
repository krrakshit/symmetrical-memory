// frontend/src/services/task.service.ts

import api from "@/lib/axios";

// Define types
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
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
}

// Get all tasks for an organization
export const getTasks = async (
  orgId: string,
  filters?: { status?: string; assignedTo?: string }
): Promise<Task[]> => {
  try {
    let url = `/tasks/organization/${orgId}`;
    if (filters) {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.assignedTo) params.append("assignedTo", filters.assignedTo);
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    const response = await api.get(url);
    return response.data.tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// Get a single task by ID
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
    const response = await api.post("/tasks", taskData);
    return response.data.task;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

// Update a task
export const updateTask = async (
  taskId: string,
  updates: Partial<CreateTaskData>
): Promise<Task> => {
  try {
    const response = await api.put(`/tasks/${taskId}`, updates);
    return response.data.task;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    await api.delete(`/tasks/${taskId}`);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

// Assign a task to a user
export const assignTask = async (
  taskId: string,
  assignedTo: string | null
): Promise<Task> => {
  try {
    const response = await api.post(`/tasks/${taskId}/assign`, { assignedTo });
    return response.data.task;
  } catch (error) {
    console.error("Error assigning task:", error);
    throw error;
  }
};

// Update task status
export const updateTaskStatus = async (
  taskId: string,
  status: "pending" | "in-progress" | "completed"
): Promise<Task> => {
  try {
    const response = await api.patch(`/tasks/${taskId}/status`, { status });
    return response.data.task;
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
};
