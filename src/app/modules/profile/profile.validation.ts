import { z } from "zod";

export const updateProfileZod = z.object({
  name: z.string().min(1, "Name is required").trim(),
});

export const updateActiveLevelId = z.object({
  levelId: z.string().min(1, "Level id is required").trim(),
});

export const updateActiveChapterId = z.object({
  chapterId: z.string().min(1, "Level id is required").trim(),
});

export const updateActiveLessonId = z.object({
  lessonId: z.string().min(1, "Level id is required").trim(),
});

export const updateActiveQuestionId = z.object({
  questionId: z.string().min(1, "Level id is required").trim(),
});
export type TUpdateProfile = z.infer<typeof updateProfileZod> & {
  image: string;
};
