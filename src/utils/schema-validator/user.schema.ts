import { z } from "zod";

export const signupUserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string().min(6),
});

export const IUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
