import { Request, Response, NextFunction } from "express";
import { IUser } from "../types/user.type";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(403).send("Access denied");

  jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).send("Invalid token");
    req.user = user;
    next();
  });
};

export { authenticate };
