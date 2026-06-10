import { Router } from "express";
import { profileController } from "./profile.controller";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";
import validate from "../../middlewares/validate";
import {
  updateActiveChapterId,
  updateActiveLevelId,
  updateProfileZod,
} from "./profile.validation";
import { upload } from "../../utils/awss3";
import { updateLessonZod } from "../lesson/lesson.validation";
import { updateQuestionZod } from "../question/question.validation";

const router = Router();

router.get(
  "/",
  authorize(UserRole.USER, UserRole.ADMIN),
  profileController.getProfile
);

router.patch(
  "/",
  authorize(UserRole.USER, UserRole.ADMIN),
  upload.single("image"),
  validate(updateProfileZod, { formData: true }),
  profileController.updateProfile
);

router.patch(
  "/active-level",
  authorize(UserRole.USER),
  validate(updateActiveLevelId),
  profileController.updateActiveLevel
);

router.patch(
  "/active-chapter",
  authorize(UserRole.USER),
  validate(updateActiveChapterId),
  profileController.updateActiveChapter
);

router.patch(
  "/active-lesson",
  authorize(UserRole.USER),
  validate(updateLessonZod),
  profileController.updateActiveLesson
);

router.patch(
  "/active-question",
  authorize(UserRole.USER),
  validate(updateQuestionZod),
  profileController.updateActiveQuestion
);

export const profileRoutes = router;
