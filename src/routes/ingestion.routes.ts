import express from "express";
import { authenticate } from "../middlewares/auth.m";
import { getIngestionStatus, triggerIngestion } from "../controllers/ingestion.controller";

const router = express.Router();

router.post("/trigger", [authenticate], triggerIngestion);
router.get("/:ingestionId", [authenticate], getIngestionStatus);

export { router as ingestionRoutes };
