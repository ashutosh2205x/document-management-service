import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUserSchema, addEmailToFilter, isEmailInFilter } from "../utils/utilities";
import { User, BlacklistedTokens } from "../../../shared/models/index";
import { catchAsync } from "../../../shared/utils/catchAsync";

export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, role } = req.body;
  if (isEmailInFilter(email)) {
    // Perform database check to avoid false positives
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ email, password: hashedPassword, role: role || "viewer" });
  addEmailToFilter(email);
  res.status(201).json({ email: email, message: "User created succesfully" });
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  IUserSchema.parse(req.body);
  if (!isEmailInFilter(email)) {
    // check in filter if the email exists or not, reject immediately
    return res.status(400).json({ message: "invalid email or password" });
  }
  const isUser = await User.findOne({ where: { email: email } });

  if (!isUser || !isUser?.dataValues) {
    return res.status(401).json({
      success: false,
      message: "user not found",
    });
  }
  if (bcrypt.compareSync(password, isUser.dataValues.password)) {
    const { id, role, permissions } = isUser.dataValues;
    const token = jwt.sign({ email, id, role, permissions }, process.env.JWT_SECRET!, { expiresIn: "24h" });
    res.json({ token });
  } else {
    res.json({ error: "incorrect password" });
  }
});

export const logout = catchAsync(async (req: Request, res: Response): Promise<void> => {
  let token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "token required" });
    return;
  }
  await BlacklistedTokens.create({ token });
  res.status(200).json({ message: "logged out successfully" });
});
