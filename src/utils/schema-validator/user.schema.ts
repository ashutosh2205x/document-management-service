import { z } from "zod";

export const IUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
