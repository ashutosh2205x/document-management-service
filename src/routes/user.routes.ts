import express from "express";
import { updateUserRole } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.m";
import { isAdmin } from "../middlewares/admin.m";

const router = express.Router();

router.post("/update-role", [authenticate, isAdmin], updateUserRole);

export { router as userRoutes };
