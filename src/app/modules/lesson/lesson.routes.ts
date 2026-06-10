import { Router } from "express";
import { lessonController } from "./lesson.controller";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";
import validate from "../../middlewares/validate";
import { createLessonZod, updateLessonZod } from "./lesson.validation";
import { upload } from "../../utils/awss3";

const router = Router();

router.post(
  "/",
  authorize(UserRole.ADMIN),
  upload.single("icon"),
  validate(createLessonZod, { formData: true }),
  lessonController.createLesson
);

router.get(
  "/",
  authorize(UserRole.ADMIN, UserRole.USER),
  lessonController.getAllLessons
);

router.patch(
  "/:id",
  authorize(UserRole.ADMIN),
  upload.single("icon"),
  validate(updateLessonZod, { formData: true }),
  lessonController.updateLesson
);

router.delete("/:id", authorize(UserRole.ADMIN), lessonController.deleteLesson);

export const lessonRoutes = router;
