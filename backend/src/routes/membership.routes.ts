// backend/src/routes/membership.routes.ts
import express from "express";
import {
  getOrganizationMembers,
  removeMember,
} from "../controllers/membership.controller";
import { authenticateUser, isOrgOwner } from "../middleware/auth.middleware";

const router = express.Router();

// All routes require authentication
router.use(authenticateUser);

router.get("/organization/:orgId", getOrganizationMembers);
router.delete("/organization/:orgId/member/:userId", isOrgOwner, removeMember);

export default router;
