import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser } from "../utils/user.type";
import { BlacklistedTokens } from "../../../shared/models/blacklistedTokens.model";
require("dotenv").config();

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(403).json({ error: "Unauthenticated" });
    return;
  }

  const blacklisted = await BlacklistedTokens.findOne({ where: { token } });
  if (blacklisted) {
    res.status(403).json({ message: "Token has been invalidated" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).send("Invalid token");
    req.user = user as any;
    next();
  });
};
