import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { User } from "../models/user.model";
import { ROLES } from "../utils/const";

export const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const { userId, role } = req.body;
  if (!userId || !role) {
    return res.status(403).json({ error: "userId or role is missing" });
  }
  if (!ROLES.includes(role)) {
    return res.status(403).json({ error: "invalid role" });
  }
  await User.update({ role }, { where: { id: userId } });
  res.json({ message: "role updated succesfully" });
});
