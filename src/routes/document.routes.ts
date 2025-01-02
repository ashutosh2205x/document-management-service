import express from "express";
import { authenticate } from "../middlewares/auth.m";
import { uploadDocument, getDocuments } from "../controllers/document.controller";
import { upload } from "../utils/fileUploader";
const router = express.Router();

router.post("/upload", [authenticate, upload.single("file")], uploadDocument);
router.get("/documents", getDocuments);

export { router as documentRoutes };
