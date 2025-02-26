// backend/src/controllers/user.controller.ts
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

// Get user profile
export const getUserProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Error retrieving profile" });
  }
};

// Update user profile
export const updateUserProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { fullName, email, currentPassword, newPassword } = req.body;

    // Prepare update data
    const updateData: any = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;

    // If changing password
    if (newPassword && currentPassword) {
      // Verify current password
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        select: { password: true },
      });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );

      if (!isPasswordValid) {
        res.status(400).json({ message: "Current password is incorrect" });
        return;
      }

      // Hash new password
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: req.user!.id },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
      },
    });

    res.json({ user: updatedUser, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update Profile Error:", error);

    // Handle unique constraint violations
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }

    res.status(500).json({ message: "Error updating profile" });
  }
};

// Get user statistics
export const getUserStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Get user's organizations (both owned and joined)
    const ownedOrgs = await prisma.organization.count({
      where: { createdBy: req.user!.id },
    });

    const memberships = await prisma.membership.count({
      where: { userId: req.user!.id },
    });

    // Get user's tasks
    const totalTasks = await prisma.task.count({
      where: { assignedTo: req.user!.id },
    });

    const pendingTasks = await prisma.task.count({
      where: {
        assignedTo: req.user!.id,
        status: "pending",
      },
    });

    const inProgressTasks = await prisma.task.count({
      where: {
        assignedTo: req.user!.id,
        status: "in-progress",
      },
    });

    const completedTasks = await prisma.task.count({
      where: {
        assignedTo: req.user!.id,
        status: "completed",
      },
    });

    // Recent activity (tasks & organizations)
    const recentTasks = await prisma.task.findMany({
      where: {
        OR: [{ assignedTo: req.user!.id }, { createdBy: req.user!.id }],
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
      },
    });

    // Return statistics
    res.json({
      stats: {
        totalOrganizations: ownedOrgs + memberships,
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      },
      recentActivity: recentTasks.map((task) => ({
        id: task.id,
        type: "task",
        title: task.title,
        status: task.status,
        timestamp: task.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get Stats Error:", error);
    res.status(500).json({ message: "Error retrieving user statistics" });
  }
};
