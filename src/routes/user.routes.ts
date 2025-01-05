import express from "express";
import { updateUserPermissions, updateUserRole } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.m";
import { isAdmin } from "../middlewares/admin.m";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User Management
 *   description: APIs for user role management
 */

/**
 * @swagger
 * /api/user/update-role:
 *   post:
 *     summary: Update the Role of particular user
 *     tags: [User Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: number
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       403:
 *         error: userId or role is missing / invalid role
 */

router.post("/update-role", [authenticate, isAdmin], updateUserRole);
router.post("/update-permissions", [authenticate, isAdmin], updateUserPermissions);

export { router as userRoutes };
