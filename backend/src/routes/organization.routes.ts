// backend/src/routes/organization.routes.ts
import express from "express";
import {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
  joinOrganization,
} from "../controllers/organization.controller";
import {
  authenticateUser,
  isOrgOwner,
  isOrgMember,
} from "../middleware/auth.middleware";

const router = express.Router();

// All routes require authentication
router.use(authenticateUser);

router.post("/", createOrganization);
router.get("/", getOrganizations);
router.get("/:orgId", isOrgMember, getOrganizationById);
router.put("/:orgId", isOrgOwner, updateOrganization);
router.delete("/:orgId", isOrgOwner, deleteOrganization);
router.post("/join", joinOrganization);

export default router;
