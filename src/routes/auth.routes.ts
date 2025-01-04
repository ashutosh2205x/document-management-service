import express from "express";
import { login, signup } from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signup).post("/login", login);

export { router as authRoutes };
