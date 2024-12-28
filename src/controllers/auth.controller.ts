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
  if (!isUser || !isUser?.dataValues) {
    return res.status(401).json({
      success: false,
      message: "Incorrect email or password",
    });
  }
  if (bcrypt.compareSync(password, isUser.dataValues.password)) {
    let token = jwt.sign({ email }, process.env.JWT_SECRET);
    res.json({ data: isUser.dataValues, token });
  } else {
    res.json({ error: "incorrect password" });
  }
});
