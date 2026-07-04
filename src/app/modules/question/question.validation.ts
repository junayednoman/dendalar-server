import { z } from "zod";

export const createQuestionZod = z
  .object({
    chapterId: z.string().uuid("Invalid chapter ID"),
    lessonId: z.string().uuid("Invalid lesson ID"),
    index: z.coerce.number().int().min(1, "Index is required"),
    sentenceInEnglish: z.string().optional(),
    sentenceInLearningLanguage: z.string().optional(),
    hint: z.string().optional(),
    fullSentence: z.string().optional(),
    missingWord: z.string().optional(),
  })
  .strict();

export const updateQuestionZod = z.object({
  chapterId: z.string().uuid("Invalid chapter ID").optional(),
  lessonId: z.string().uuid("Invalid lesson ID").optional(),
  index: z.coerce.number().int().min(1).optional(),
  sentenceInEnglish: z.string().optional(),
  sentenceInLearningLanguage: z.string().optional(),
  hint: z.string().optional(),
  fullSentence: z.string().optional(),
  missingWord: z.string().optional(),
});

export type CreateQuestionZod = z.infer<typeof createQuestionZod>;
export type UpdateQuestionZod = z.infer<typeof updateQuestionZod>;
