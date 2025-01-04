import { Request, Response, NextFunction } from "express";

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  console.log("role is: ", req.user.role);
  if (req.user.role !== "admin") {
    res.status(403).json({ error: "Unauthorized access" });
    return;
  }
  next();
};
