import express from "express";
import { authenticate } from "../middlewares/auth.m";
import { uploadDocument, getUserDocuments, deleteDocument, updateDocument } from "../controllers/document.controller";
import { upload } from "../utils/fileHandler";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: API for managing documents
 */

/**
 * @swagger
 * /api/documents:
 *   post:
 *     summary: Create a new document
 *     tags: [Documents]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       201:
 *         description: Document created successfully
 */
router.post("/", [authenticate, upload.single("file")], uploadDocument);

/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Retrieve all documents
 *     tags: [Documents]
 *     responses:
 *       200:
 *         description: List of documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  id: number,
 *                  user_id: number,
 *                  file_name: string,
 *                  file_path: string,
 *                  createdAt": string,
 *                  updatedAt: string
 *
 * */
router.get("/", [authenticate], getUserDocuments);

/**
 * @swagger
 * /api/documents/{documentId}:
 *   delete:
 *     summary: Delete a document by documentId
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Document ID
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *       404:
 *         error: Document not found
 *       500:
 *         description: Error deleting file
 */
router.delete("/:documentId", [authenticate], deleteDocument);

// /**
//  * @swagger
//  * /api/documents/{documentId}:
//  *   put:
//  *     summary: Update an existing document
//  *     tags: [Documents]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               file:
//  *                 type: string
//  *                 format: binary
//  *                 description: The file to upload
//  *     responses:
//  *       200:
//  *         description: Document deleted successfully
//  *       400:
//  *         error: No file uploaded
//  *       404:
//  *         error: Document is missing / Document not found
//  *       500:
//  *         description: Error deleting file
//  */

/**
 * @swagger
 * /api/documents/{documentId}:
 *   put:
 *     summary: Update an existing document
 *     tags: [Documents]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       200:
 *         description: Document updated successfully
 */
router.put("/:documentId", [authenticate, upload.single("file")], updateDocument);

export { router as documentRoutes };
