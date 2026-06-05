import { z } from "zod";

export const createLessonZod = z.object({
  name: z.string().min(1, "Name is required"),
  index: z.coerce.number().int().min(1, "Index is required"),
});

export const updateLessonZod = z.object({
  name: z.string().optional(),
  index: z.coerce.number().optional(),
});

export type CreateLessonZod = z.infer<typeof createLessonZod> & {
  icon: string;
};
export type UpdateLessonZod = z.infer<typeof updateLessonZod> & {
  icon?: string;
};
