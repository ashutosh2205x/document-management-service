import { Request, Response, NextFunction } from "express";

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== "admin") {
    res.status(403).json({ error: "Unauthorized access" });
    return;
  }
  next();
};
