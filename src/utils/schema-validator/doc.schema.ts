import { z } from "zod";

export const documentSchema = z.object({
  user_id: z.number(),
  file_name: z.string(),
  file_path: z.string(),
});
