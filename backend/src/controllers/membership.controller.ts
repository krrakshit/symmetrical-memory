// backend/src/controllers/membership.controller.ts (continued)
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// Get members of an organization
export const getOrganizationMembers = async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params;

    // Verify user is a member or owner
    const isMember = await prisma.membership.findUnique({
      where: {
        userId_orgId: {
          userId: req.user!.id,
          orgId,
        },
      },
    });

    const isOwner = await prisma.organization.findFirst({
      where: {
        id: orgId,
        createdBy: req.user!.id,
      },
    });

    if (!isMember && !isOwner) {
      return res
        .status(403)
        .json({ message: "Not authorized to view members" });
    }

    // Get the organization owner
    const organization = await prisma.organization.findUnique({
      where: { id: orgId },
      include: {
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
      return res.status(404).json({ message: "Organization not found" });
    }

    // Get members
    const memberships = await prisma.membership.findMany({
      where: { orgId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    const members = memberships.map((membership) => ({
      ...membership.user,
      joinedAt: membership.joinedAt,
      isOwner: false,
    }));

    // Add owner with flag
    const allMembers = [
      {
        ...organization.owner,
        isOwner: true,
      },
      ...members,
    ];

    res.json({ members: allMembers });
  } catch (error) {
    console.error("Get Members Error:", error);
    res.status(500).json({ message: "Error retrieving members" });
  }
};

// Remove member from organization
export const removeMember = async (req: Request, res: Response) => {
  try {
    const { orgId, userId } = req.params;

    // Check if the user exists in the organization
    const membership = await prisma.membership.findUnique({
      where: {
        userId_orgId: {
          userId,
          orgId,
        },
      },
    });

    if (!membership) {
      return res
        .status(404)
        .json({ message: "Member not found in this organization" });
    }

    // Remove membership
    await prisma.membership.delete({
      where: {
        userId_orgId: {
          userId,
          orgId,
        },
      },
    });

    // Reassign tasks assigned to this user in this organization
    await prisma.task.updateMany({
      where: {
        orgId,
        assignedTo: userId,
      },
      data: {
        assignedTo: null,
      },
    });

    res.json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("Remove Member Error:", error);
    res.status(500).json({ message: "Error removing member" });
  }
};
