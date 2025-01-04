import { Request, Response } from "express";
import { Document } from "../models/doc.model";
import { catchAsync } from "../utils/catchAsync";
import { documentSchema } from "../utils/schema-validator/doc.schema";
import path from "path";
import fs from "fs";

export const uploadDocument = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded!" });
  }
  let payload = {
    user_id: req.user.id,
    file_name: req.file?.filename || `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    file_path: req.file?.path,
  };
  documentSchema.parse(payload);
  const document = await Document.create(payload);
  res.status(200).send({
    message: "File uploaded successfully!",
    document,
  });
});

export const getUserDocuments = catchAsync(async (req: Request, res: Response) => {
  const documents = await Document.findAll({
    where: { user_id: req.user.id },
  });
  res.json(documents);
});

export const deleteDocument = catchAsync(async (req: Request, res: Response) => {
  const { documentId } = req.params;
  if (!documentId) {
    return res.status(404).json({ error: "Document id missing" });
  }
  let document = await Document.findByPk(documentId);
  if (!document) {
    return res.status(404).json({ error: "Document not found" });
  }
  const filePath = path.join(__dirname, "../../uploads/", document.dataValues.file_name);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: `Error deleting file: ${filePath}` });
    }
  });
  await document.destroy();
  res.status(200).json({ message: "Document deleted successfully", document: document.dataValues });
});

export const updateDocument = catchAsync(async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded!" });
    return;
  }
  const { documentId } = req.params;
  if (!documentId) {
    res.status(404).json({ error: "Document id missing" });
    return;
  }
  const document = await Document.findByPk(documentId);
  if (!document) {
    res.status(404).json({ error: "Document not found" });
    return;
  }
  const filePath = path.join(__dirname, "../../uploads/", document.dataValues.file_name);
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: `Error deleting file: ${filePath}` });
    }
  });
  let payload = {
    user_id: req.user.id,
    file_name: req.file?.filename || `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    file_path: req.file?.path,
  };
  documentSchema.parse(payload);
  await Document.update({ file_name: req.file?.filename, file_path: req.file.path }, { where: { id: documentId } });
  res.status(200).json({ message: "document updated succesfully" });
});
