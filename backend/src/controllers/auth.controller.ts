import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";

// Signup Function (unchanged)
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req);
    const { fullName, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { fullName, email, password: hashedPassword },
    });

    res
      .status(201)
      .json({ message: "User created successfully", userId: user.id });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Error creating user" });
  }
};

// 🔹 Login Function (updated)
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    // ✅ Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d", // Token valid for 7 days
    });

    // ✅ Store the token in cookies
    res.cookie("token", token, {
      httpOnly: true, // Prevents XSS attacks
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ✅ Send response with user info for frontend state
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
      redirectTo: "Dashboard", // For updating frontend state
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};
