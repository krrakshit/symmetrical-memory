// backend/src/routes/task.routes.ts
import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  assignTask,
  updateTaskStatus,
} from "../controllers/task.controller";
import { authenticateUser, isOrgMember } from "../middleware/auth.middleware";

const router = express.Router();

// All routes require authentication
router.use(authenticateUser);

router.post("/", createTask);
router.get("/organization/:orgId", isOrgMember, getTasks);
router.get("/:taskId", getTaskById);
router.put("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);
router.post("/:taskId/assign", assignTask);
router.patch("/:taskId/status", updateTaskStatus);

export default router;
