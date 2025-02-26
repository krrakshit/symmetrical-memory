// backend/src/middleware/auth.middleware.ts
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        fullName: string;
      };
    }
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Check for token in Authorization header
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      // Alternatively check cookies
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, fullName: true },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Check if user is organization member
export const isOrgMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const orgId = req.params.orgId || req.body.orgId;

    if (!orgId) {
      return res.status(400).json({ message: "Organization ID required" });
    }

    // Check if user is a member or owner
    const membership = await prisma.membership.findUnique({
      where: {
        userId_orgId: {
          userId: req.user.id,
          orgId,
        },
      },
    });

    const isOwner = await prisma.organization.findFirst({
      where: {
        id: orgId,
        createdBy: req.user.id,
      },
    });

    if (!membership && !isOwner) {
      return res
        .status(403)
        .json({ message: "Not a member of this organization" });
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Check if user is organization owner
export const isOrgOwner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const orgId = req.params.orgId || req.body.orgId;

    if (!orgId) {
      return res.status(400).json({ message: "Organization ID required" });
    }

    const org = await prisma.organization.findFirst({
      where: {
        id: orgId,
        createdBy: req.user.id,
      },
    });

    if (!org) {
      return res
        .status(403)
        .json({ message: "Only organization owner can perform this action" });
    }

    next();
  } catch (error) {
    next(error);
  }
};
