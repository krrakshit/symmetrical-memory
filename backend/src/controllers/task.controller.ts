// backend/src/controllers/task.controller.ts
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// Create a new task
export const createTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, description, orgId, assignedTo, dueAt } = req.body;
    if (!title || !orgId || !dueAt) {
      res.status(400).json({
        message: "Title, organization ID, and due date are required",
      });
      return;
    }

    // Verify user is a member of the organization
    const isOwner = await prisma.organization.findFirst({
      where: {
        id: orgId,
        createdBy: req.user!.id,
      },
    });

    const isMember = await prisma.membership.findUnique({
      where: {
        userId_orgId: {
          userId: req.user!.id,
          orgId,
        },
      },
    });

    if (!isOwner && !isMember) {
      res.status(403).json({ message: "Not a member of this organization" });
      return;
    }

    // If assignedTo is provided, verify that user is a member
    if (assignedTo) {
      const assigneeIsMember = await prisma.membership.findUnique({
        where: {
          userId_orgId: {
            userId: assignedTo,
            orgId,
          },
        },
      });

      const isOrgOwner = await prisma.organization.findFirst({
        where: {
          id: orgId,
          createdBy: assignedTo,
        },
      });

      if (!assigneeIsMember && !isOrgOwner) {
        res.status(400).json({
          message: "Assigned user is not a member of this organization",
        });
        return;
      }
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        title,
        description,
        orgId,
        assignedTo,
        createdBy: req.user!.id,
        dueAt: new Date(dueAt),
        status: "pending",
      },
      include: {
        assignee: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(500).json({ message: "Error creating task" });
  }
};

// Get tasks for an organization
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orgId } = req.params;
    const { status, assignedTo } = req.query;

    // Build filter conditions
    const where: any = { orgId };
    if (status) {
      where.status = status;
    }

    if (assignedTo === "me") {
      where.assignedTo = req.user!.id;
    } else if (assignedTo === "unassigned") {
      where.assignedTo = null;
    } else if (assignedTo) {
      where.assignedTo = assignedTo;
    }

    // Get tasks
    const tasks = await prisma.task.findMany({
      where,
      orderBy: { dueAt: "asc" },
      include: {
        assignee: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    res.json({ tasks });
  } catch (error) {
    console.error("Get Tasks Error:", error);
    res.status(500).json({ message: "Error retrieving tasks" });
  }
};

// Get task by ID
export const getTaskById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { taskId } = req.params;
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignee: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    // Verify user has access to this task
    const isOrgOwner = await prisma.organization.findFirst({
      where: {
        id: task.orgId,
        createdBy: req.user!.id,
      },
    });

    const isOrgMember = await prisma.membership.findUnique({
      where: {
        userId_orgId: {
          userId: req.user!.id,
          orgId: task.orgId,
        },
      },
    });

    if (!isOrgOwner && !isOrgMember) {
      res.status(403).json({ message: "Not authorized to view this task" });
      return;
    }

    res.json({ task });
  } catch (error) {
    console.error("Get Task Error:", error);
    res.status(500).json({ message: "Error retrieving task" });
  }
};

// Update task
export const updateTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { title, description, dueAt } = req.body;

    // Get the task
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { organization: true },
    });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    // Check if user is authorized to update this task
    const isOrgOwner = task.organization.createdBy === req.user!.id;
    const isTaskCreator = task.createdBy === req.user!.id;

    if (!isOrgOwner && !isTaskCreator) {
      res.status(403).json({ message: "Not authorized to update this task" });
      return;
    }

    // Update data
    const updateData: any = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (dueAt) updateData.dueAt = new Date(dueAt);

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        assignee: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({ message: "Error updating task" });
  }
};

// Delete task
export const deleteTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { taskId } = req.params;

    // Get the task
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { organization: true },
    });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    // Check if user is authorized to delete this task
    const isOrgOwner = task.organization.createdBy === req.user!.id;
    const isTaskCreator = task.createdBy === req.user!.id;

    if (!isOrgOwner && !isTaskCreator) {
      res.status(403).json({ message: "Not authorized to delete this task" });
      return;
    }

    // Delete task
    await prisma.task.delete({
      where: { id: taskId },
    });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete Task Error:", error);
    res.status(500).json({ message: "Error deleting task" });
  }
};

// Assign task to user
export const assignTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { assignedTo } = req.body;

    // Get the task
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { organization: true },
    });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    // Check if user is authorized to assign this task
    const isOrgOwner = task.organization.createdBy === req.user!.id;
    const isTaskCreator = task.createdBy === req.user!.id;

    if (!isOrgOwner && !isTaskCreator) {
      res.status(403).json({ message: "Not authorized to assign this task" });
      return;
    }

    // If assignedTo is provided, verify that user is a member
    if (assignedTo) {
      const assigneeIsMember = await prisma.membership.findUnique({
        where: {
          userId_orgId: {
            userId: assignedTo,
            orgId: task.orgId,
          },
        },
      });

      const isAssigneeOrgOwner = await prisma.organization.findFirst({
        where: {
          id: task.orgId,
          createdBy: assignedTo,
        },
      });

      if (!assigneeIsMember && !isAssigneeOrgOwner) {
        res.status(400).json({
          message: "Assigned user is not a member of this organization",
        });
        return;
      }
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { assignedTo },
      include: {
        assignee: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json({
      message: "Task assigned successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Assign Task Error:", error);
    res.status(500).json({ message: "Error assigning task" });
  }
};

// Update task status
export const updateTaskStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!status || !["pending", "in-progress", "completed"].includes(status)) {
      res.status(400).json({ message: "Valid status is required" });
      return;
    }

    // Get the task
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { organization: true },
    });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    // Check if user is authorized to update this task
    const isOrgOwner = task.organization.createdBy === req.user!.id;
    const isTaskCreator = task.createdBy === req.user!.id;
    const isAssignee = task.assignedTo === req.user!.id;

    if (!isOrgOwner && !isTaskCreator && !isAssignee) {
      res
        .status(403)
        .json({ message: "Not authorized to update this task status" });
      return;
    }

    // Update task status
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status },
      include: {
        assignee: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json({
      message: "Task status updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update Task Status Error:", error);
    res.status(500).json({ message: "Error updating task status" });
  }
};
