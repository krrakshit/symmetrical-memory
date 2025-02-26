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
): Promise<void> => {
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
      res.status(401).json({ message: "Authentication required" });
      return;
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
      res.status(401).json({ message: "User not found" });
      return;
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Apply the same fixes to these middlewares
export const isOrgMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const orgId = req.params.orgId || req.body.orgId;

    if (!orgId) {
      res.status(400).json({ message: "Organization ID required" });
      return;
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
      res.status(403).json({ message: "Not a member of this organization" });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const isOrgOwner = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const orgId = req.params.orgId || req.body.orgId;

    if (!orgId) {
      res.status(400).json({ message: "Organization ID required" });
      return;
    }

    const org = await prisma.organization.findFirst({
      where: {
        id: orgId,
        createdBy: req.user.id,
      },
    });

    if (!org) {
      res
        .status(403)
        .json({ message: "Only organization owner can perform this action" });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};
