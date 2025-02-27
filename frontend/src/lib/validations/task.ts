import { z } from "zod";

export const taskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().optional(),
  orgId: z.string().min(1, "Organization is required"),
  dueAt: z.string().min(1, "Due date is required"),
  status: z.enum(["pending", "in_progress", "completed"]).default("pending"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  tags: z.array(z.string()).optional().default([]),
  estimatedHours: z.number().min(0).max(100).optional(),
  assignedTo: z.string().optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>; 