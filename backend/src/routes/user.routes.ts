// backend/src/routes/user.routes.ts
import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getUserStats,
} from "../controllers/user.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const router = express.Router();

// All routes require authentication
router.use(authenticateUser);

router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);
router.get("/stats", getUserStats);

export default router;
