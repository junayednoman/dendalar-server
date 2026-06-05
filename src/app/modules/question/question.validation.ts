import { z } from "zod";
import { QuestionType } from "@prisma/client";

export const createQuestionZod = z
  .object({
    chapterId: z.string().uuid("Invalid chapter ID"),
    lessonId: z.string().uuid("Invalid lesson ID"),
    index: z.coerce.number().int().min(1, "Index is required"),
    type: z.enum([QuestionType.SENTENCE, QuestionType.DIALOGUE]),
    sentenceInEnglish: z.string().optional(),
    sentenceInLearningLanguage: z.string().optional(),
    hint: z.string().optional(),
    fullSentence: z.string().optional(),
    missingWord: z.string().optional(),
  })
  .refine(
    data => {
      if (data.type === QuestionType.SENTENCE) {
        return (
          !!data.sentenceInEnglish &&
          !!data.sentenceInLearningLanguage &&
          !!data.hint
        );
      }
      return true;
    },
    {
      message:
        "For sentence type, sentenceInEnglish, sentenceInLearningLanguage, and hint are required",
      path: ["type"],
    }
  )
  .refine(
    data => {
      if (data.type === QuestionType.DIALOGUE) {
        return !!data.fullSentence && !!data.missingWord;
      }
      return true;
    },
    {
      message: "For dialogue type, fullSentence and missingWord are required",
      path: ["type"],
    }
  );

export const updateQuestionZod = z.object({
  chapterId: z.string().uuid("Invalid chapter ID").optional(),
  lessonId: z.string().uuid("Invalid lesson ID").optional(),
  index: z.coerce.number().int().min(1).optional(),
  type: z.enum([QuestionType.SENTENCE, QuestionType.DIALOGUE]).optional(),
  sentenceInEnglish: z.string().optional(),
  sentenceInLearningLanguage: z.string().optional(),
  hint: z.string().optional(),
  fullSentence: z.string().optional(),
  missingWord: z.string().optional(),
});

export type CreateQuestionZod = z.infer<typeof createQuestionZod>;
export type UpdateQuestionZod = z.infer<typeof updateQuestionZod>;
