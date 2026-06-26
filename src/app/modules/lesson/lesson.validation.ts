import { z } from "zod";

export const createLessonZod = z.object({
  chapterId: z.string().uuid("Invalid chapter ID"),
  index: z.coerce.number().int().min(1, "Index is required"),
  lessonType: z.enum(["SENTENCE", "DIALOGUE"]),
});

export const updateLessonInputZod = z.object({
  chapterId: z.string().uuid("Invalid chapter ID").optional(),
  index: z.coerce.number().optional(),
  lessonType: z.enum(["SENTENCE", "DIALOGUE"]).optional(),
});

export const updateLessonZod = z.object({
  lessonId: z.string().min(1, "Lesson id is required").trim(),
});

export type CreateLessonZod = z.infer<typeof createLessonZod>;
export type UpdateLessonInputZod = z.infer<typeof updateLessonInputZod>;
