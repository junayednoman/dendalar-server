import { z } from "zod";

export const createChapterZod = z.object({
  name: z.string().min(1, "Name is required"),
  index: z.coerce.number().int().min(1, "Index is required"),
  levelId: z.string().uuid("Invalid level ID"),
});

export const updateChapterZod = z.object({
  name: z.string().optional(),
  index: z.coerce.number().optional(),
});

export type CreateChapterZod = z.infer<typeof createChapterZod>;
export type UpdateChapterZod = z.infer<typeof updateChapterZod>;
