// backend/src/controllers/organization.controller.ts
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { generateJoinCode } from "../utils/generateCode";

// Create a new organization
export const createOrganization = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Organization name is required" });
    }

    // Generate a unique join code
    let joinCode = generateJoinCode();
    let existingOrg = await prisma.organization.findUnique({
      where: { joinCode },
    });

    // Ensure the join code is unique
    while (existingOrg) {
      joinCode = generateJoinCode();
      existingOrg = await prisma.organization.findUnique({
        where: { joinCode },
      });
    }

    // Create the organization
    const organization = await prisma.organization.create({
      data: {
        name,
        description,
        joinCode,
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

// Get all organizations for current user
export const getOrganizations = async (req: Request, res: Response) => {
  try {
    // Organizations created by the user
    const ownedOrganizations = await prisma.organization.findMany({
      where: { createdBy: req.user!.id },
    });

    // Organizations the user is a member of
    const memberships = await prisma.membership.findMany({
      where: { userId: req.user!.id },
      include: { org: true },
    });

    const memberOrganizations = memberships.map((membership) => membership.org);

    // Combine and deduplicate (in case a user is both owner and member)
    const allOrganizations = [...ownedOrganizations];

    // Add member organizations that are not also owned
    for (const org of memberOrganizations) {
      if (!allOrganizations.some((ownedOrg) => ownedOrg.id === org.id)) {
        allOrganizations.push(org);
      }
    }

    res.json({ organizations: allOrganizations });
  } catch (error) {
    console.error("Get Organizations Error:", error);
    res.status(500).json({ message: "Error retrieving organizations" });
  }
};

// Get organization by ID
export const getOrganizationById = async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params;

    const organization = await prisma.organization.findUnique({
      where: { id: orgId },
      include: {
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
        tasks: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Check if current user is the owner
    const isOwner = organization.createdBy === req.user!.id;

    res.json({
      organization: {
        ...organization,
        joinCode: isOwner ? organization.joinCode : undefined, // Only show join code to owner
        isOwner,
      },
    });
  } catch (error) {
    console.error("Get Organization Error:", error);
    res.status(500).json({ message: "Error retrieving organization" });
  }
};

// Update organization
export const updateOrganization = async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params;
    const { name, description } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    const organization = await prisma.organization.update({
      where: { id: orgId },
      data: updateData,
    });

    res.json({
      message: "Organization updated successfully",
      organization,
    });
  } catch (error) {
    console.error("Update Organization Error:", error);
    res.status(500).json({ message: "Error updating organization" });
  }
};

// Delete organization
export const deleteOrganization = async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params;

    // Delete all memberships
    await prisma.membership.deleteMany({
      where: { orgId },
    });

    // Delete all tasks
    await prisma.task.deleteMany({
      where: { orgId },
    });

    // Delete the organization
    await prisma.organization.delete({
      where: { id: orgId },
    });

    res.json({ message: "Organization deleted successfully" });
  } catch (error) {
    console.error("Delete Organization Error:", error);
    res.status(500).json({ message: "Error deleting organization" });
  }
};

// Join organization with join code
export const joinOrganization = async (req: Request, res: Response) => {
  try {
    const { joinCode } = req.body;

    if (!joinCode) {
      return res.status(400).json({ message: "Join code is required" });
    }

    // Find organization with the provided join code
    const organization = await prisma.organization.findUnique({
      where: { joinCode },
    });

    if (!organization) {
      return res.status(404).json({ message: "Invalid join code" });
    }

    // Check if user is already a member or owner
    if (organization.createdBy === req.user!.id) {
      return res
        .status(400)
        .json({ message: "You are already the owner of this organization" });
    }

    const existingMembership = await prisma.membership.findUnique({
      where: {
        userId_orgId: {
          userId: req.user!.id,
          orgId: organization.id,
        },
      },
    });

    if (existingMembership) {
      return res
        .status(400)
        .json({ message: "You are already a member of this organization" });
    }

    // Create membership
    await prisma.membership.create({
      data: {
        userId: req.user!.id,
        orgId: organization.id,
      },
    });

    res.json({
      message: "Successfully joined organization",
      organization: {
        id: organization.id,
        name: organization.name,
        description: organization.description,
      },
    });
  } catch (error) {
    console.error("Join Organization Error:", error);
    res.status(500).json({ message: "Error joining organization" });
  }
};
