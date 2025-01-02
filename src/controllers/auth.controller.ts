import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { catchAsync } from "../utils/catchAsync";
import { IUserSchema } from "../utils/schema-validator/user.schema";
import db from "../configs/db";

export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ email, password: hashedPassword, role: role || "viewer" });
  res.status(201).json({ email: email, message: "user created succesfully" });
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  IUserSchema.parse(req.body);
  const isUser = await User.findOne({ where: { email: email } });
  console.log();
  if (!isUser || !isUser?.dataValues) {
    return res.status(401).json({
      success: false,
      message: "User not found",
    });
  }
  if (bcrypt.compareSync(password, isUser.dataValues.password)) {
    const { id, role } = isUser.dataValues;
    const token = jwt.sign({ email, id, role }, process.env.JWT_SECRET!, { expiresIn: "24h" });
    res.json({ token });
  } else {
    res.json({ error: "incorrect password" });
  }
});
