import express from "express";
import { authenticate } from "../middlewares/auth.m";
import { getIngestionStatus, triggerIngestion } from "../controllers/ingestion.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Ingestion
 *   description: APIs for ingestion controls
 */


/**
 * @swagger
 * /api/ingestion/trigger:
 *   post:
 *     summary: Trigger a new ingestion
 *     tags: [Ingestion]
 *     responses:
 *       201:
 *         description: Ingestion triggered successfully
 */
router.post("/trigger", [authenticate], triggerIngestion);



/**
 * @swagger
 * /api/ingestion/{ingestionId}:
 *   get:
 *     summary: Get ingestion status via ingestion Id
 *     tags: [Ingestion]
 *     responses:
 *       200:
 *         description: Get ingestion status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  id: number,
 *                  status: string,
 *                  triggered_by: number,
 *                  createdAt": string,
 *                  updatedAt: string
 *
 * */
router.get("/:ingestionId", [authenticate], getIngestionStatus);

export { router as ingestionRoutes };
