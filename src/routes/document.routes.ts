import express from "express";
import { authenticate } from "../middlewares/auth.m";
import { uploadDocument, getUserDocuments, deleteDocument, updateDocument } from "../controllers/document.controller";
import { upload } from "../utils/fileHandler";
const router = express.Router();

router
  .post("/upload", [authenticate, upload.single("file")], uploadDocument)
  .get("/get", [authenticate], getUserDocuments)
  .delete("/:documentId", [authenticate], deleteDocument)
  .put("/:documentId", [authenticate, upload.single("file")], updateDocument);

export { router as documentRoutes };
