import { Request, Response } from "express";
import { Document } from "../models/doc.model";
import { catchAsync } from "../utils/catchAsync";
import { documentSchema } from "../utils/schema-validator/doc.schema";

export const uploadDocument = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded!" });
  }
  let payload = {
    user_id: req.user.id,
    file_name: req.file?.filename || `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    file_path: req.file?.path,
  };
  console.log("payload", payload);
  documentSchema.parse(payload);
  const document = await Document.create(payload);
  console.log("document", document);
  res.status(200).send({
    message: "File uploaded successfully!",
    data: {
      id: req.user.id,
      file: req.file,
      document,
    },
  });
});

export const getDocuments = catchAsync(async (req: Request, res: Response) => {
  const documents = await Document.findAll({
    where: { user_id: req.user.id },
  });
  res.json(documents);
});
