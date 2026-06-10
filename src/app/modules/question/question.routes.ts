import { Router } from "express";
import { questionController } from "./question.controller";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";
import validate from "../../middlewares/validate";
import { createQuestionZod, updateQuestionZod } from "./question.validation";

const router = Router();

router.post(
  "/",
  authorize(UserRole.ADMIN),
  validate(createQuestionZod),
  questionController.createQuestion
);

router.get(
  "/",
  authorize(UserRole.ADMIN, UserRole.USER),
  questionController.getAllQuestions
);

router.get(
  "/chapter/:chapterId",
  authorize(UserRole.ADMIN, UserRole.USER),
  questionController.getQuestionsByChapter
);

router.patch(
  "/:id",
  authorize(UserRole.ADMIN),
  validate(updateQuestionZod),
  questionController.updateQuestion
);

router.delete(
  "/:id",
  authorize(UserRole.ADMIN),
  questionController.deleteQuestion
);

export const questionRoutes = router;
