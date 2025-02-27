import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  orgId: z.string().min(1, "Organization is required"),
  dueAt: z.string().min(1, "Due date is required"),
  status: z.enum(["pending", "in_progress", "completed"]).default("pending"),
});

export type TaskFormData = z.infer<typeof taskSchema>; 