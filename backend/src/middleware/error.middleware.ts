// backend/src/middleware/error.middleware.ts
import type { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error(err.stack);

  // Handle Prisma errors specifically
  if (err.name === "PrismaClientKnownRequestError") {
    res.status(400).json({
      message: "Database error",
      error: err.message,
    });
    return;
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    res.status(400).json({
      message: "Validation error",
      error: err.message,
    });
    return;
  }

  // Default error response
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "production" ? undefined : err.message,
  });
};
