// backend/src/routes/auth.routes.ts
import express from "express";
import { signup, login, logout, getMe } from "../controllers/auth.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticateUser, getMe);

export default router;
