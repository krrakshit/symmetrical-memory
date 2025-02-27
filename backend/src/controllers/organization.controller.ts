// backend/src/controllers/organization.controller.ts
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { generateUniqueInviteCode } from "../utils/inviteCode";

// Create a new organization
export const createOrganization = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, description } = req.body;
    if (!name) {
      res.status(400).json({ message: "Organization name is required" });
      return;
    }

    // Generate a unique invite code
    const inviteCode = await generateUniqueInviteCode();

    // Create organization
    const organization = await prisma.organization.create({
      data: {
        name,
        description,
        inviteCode,
        createdBy: req.user!.id,
      },
    });

    res.status(201).json({
      message: "Organization created successfully",
      organization,
    });
  } catch (error) {
    console.error("Create Organization Error:", error);
    res.status(500).json({ message: "Error creating organization" });
  }
};

// Get all organizations for the current user
export const getOrganizations = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Get organizations created by the user
    const ownedOrganizations = await prisma.organization.findMany({
      where: {
        createdBy: req.user!.id,
      },
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Get organizations where the user is a member
    const memberships = await prisma.membership.findMany({
      where: {
        userId: req.user!.id,
      },
      include: {
        org: {
          include: {
            owner: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const memberOrganizations = memberships.map((m) => ({
      ...m.org,
      joinedAt: m.joinedAt,
    }));

    // Combine both lists with owner details and members
    const allOrganizations = [
      ...ownedOrganizations.map((org) => ({
        ...org,
        owner: {
          id: org.owner.id,
          fullName: org.owner.fullName,
          email: org.owner.email,
        },
        members: [
          // Include owner as a member
          {
            id: org.owner.id,
            fullName: org.owner.fullName,
            email: org.owner.email,
            isOwner: true,
            joinedAt: org.createdAt,
          },
          // Include other members
          ...org.members.map(membership => ({
            id: membership.user.id,
            fullName: membership.user.fullName,
            email: membership.user.email,
            isOwner: false,
            joinedAt: membership.joinedAt,
          })),
        ],
      })),
      ...memberOrganizations.map((org) => ({
        ...org,
        owner: {
          id: org.owner.id,
          fullName: org.owner.fullName,
          email: org.owner.email,
        },
        members: [
          // Include owner as a member
          {
            id: org.owner.id,
            fullName: org.owner.fullName,
            email: org.owner.email,
            isOwner: true,
            joinedAt: org.createdAt,
          },
          // Include other members
          ...org.members.map(membership => ({
            id: membership.user.id,
            fullName: membership.user.fullName,
            email: membership.user.email,
            isOwner: false,
            joinedAt: membership.joinedAt,
          })),
        ],
      })),
    ];

    res.json({ organizations: allOrganizations });
  } catch (error) {
    console.error("Get Organizations Error:", error);
    res.status(500).json({ message: "Error retrieving organizations" });
  }
};

// Get organization by ID
export const getOrganizationById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { orgId } = req.params;

    const organization = await prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        tasks: {
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
        },
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!organization) {
      res.status(404).json({ message: "Organization not found" });
      return;
    }

    // Add the isOwner flag
    const isOwner = organization.createdBy === req.user!.id;

    // Get task statistics
    const pendingTasks = organization.tasks.filter(
      (task) => task.status === "pending",
    ).length;
    const inProgressTasks = organization.tasks.filter(
      (task) => task.status === "in-progress",
    ).length;
    const completedTasks = organization.tasks.filter(
      (task) => task.status === "completed",
    ).length;

    // Get member count
    const memberCount = await prisma.membership.count({
      where: { orgId },
    });

    // Include owner in total members
    const totalMembers = memberCount + 1;

    res.json({
      organization: {
        ...organization,
        isOwner,
        stats: {
          pendingTasks,
          inProgressTasks,
          completedTasks,
          totalTasks: organization.tasks.length,
          memberCount: totalMembers,
        },
      },
    });
  } catch (error) {
    console.error("Get Organization Error:", error);
    res.status(500).json({ message: "Error retrieving organization" });
  }
};

// Update organization
export const updateOrganization = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { orgId } = req.params;
    const { name, description, refreshInviteCode } = req.body;

    // Build update data
    const updateData: any = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    // If requested, generate a new invite code
    if (refreshInviteCode) {
      updateData.inviteCode = await generateUniqueInviteCode();
    }

    // Update organization
    const updatedOrganization = await prisma.organization.update({
      where: { id: orgId },
      data: updateData,
    });

    res.json({
      message: "Organization updated successfully",
      organization: updatedOrganization,
    });
  } catch (error) {
    console.error("Update Organization Error:", error);
    res.status(500).json({ message: "Error updating organization" });
  }
};

// Delete organization
export const deleteOrganization = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { orgId } = req.params;

    // Delete related records (Prisma doesn't cascade automatically)
    // First delete tasks
    await prisma.task.deleteMany({
      where: { orgId },
    });

    // Delete memberships
    await prisma.membership.deleteMany({
      where: { orgId },
    });

    // Finally delete the organization
    await prisma.organization.delete({
      where: { id: orgId },
    });

    res.json({ message: "Organization deleted successfully" });
  } catch (error) {
    console.error("Delete Organization Error:", error);
    res.status(500).json({ message: "Error deleting organization" });
  }
};

// Join organization using invite code
export const joinOrganization = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      res.status(400).json({ message: "Invite code is required" });
      return;
    }

    // Find organization with the provided invite code
    const organization = await prisma.organization.findFirst({
      where: { inviteCode },
    });

    if (!organization) {
      res.status(404).json({ message: "Invalid invite code" });
      return;
    }

    // Check if user is already a member
    const existingMembership = await prisma.membership.findUnique({
      where: {
        userId_orgId: {
          userId: req.user!.id,
          orgId: organization.id,
        },
      },
    });

    // Check if user is the owner
    const isOwner = organization.createdBy === req.user!.id;

    if (existingMembership || isOwner) {
      res
        .status(400)
        .json({ message: "You are already a member of this organization" });
      return;
    }

    // Create membership
    await prisma.membership.create({
      data: {
        userId: req.user!.id,
        orgId: organization.id,
        joinedAt: new Date(),
      },
    });

    res.status(201).json({
      message: "Successfully joined organization",
      organization,
    });
  } catch (error) {
    console.error("Join Organization Error:", error);
    res.status(500).json({ message: "Error joining organization" });
  }
};
