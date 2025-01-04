import { Request, Response } from "express";
import axios from "axios";
import { Ingestion } from "../models/ingestion.model";
import { catchAsync } from "../utils/catchAsync";

export const triggerIngestion = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.user!;
  const ingestion = await Ingestion.create({ status: "pending", triggered_by: id });

  // call python backend webhook to start ingestion
  // let response = await axios.post(process.env.PYTHON_BACKEND_URL!, { ingestionId: ingestion.id });

  // if response if failed, then status remains in 'pending' state otherwise update the status to 'in_progress';
  // await Ingestion.update({ status:'in_progress' }, { where: { id: ingestion.id } });
  // after completion of python api process, the status will be updated to 'completed'. If an error occurs, the status wil be set to 'failed'
  res.status(200).json({ message: "Ingestion triggered successfully", ingestion });
});

export const getIngestionStatus = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { ingestionId } = req.params;
  const ingestion = await Ingestion.findByPk(ingestionId);
  if (!ingestion) {
    res.status(404).json({ error: "Ingestion not found" });
    return;
  }
  res.status(200).json(ingestion);
});
