import { Router } from "express";
import { chapterController } from "./chapter.controller";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";
import validate from "../../middlewares/validate";
import { createChapterZod, updateChapterZod } from "./chapter.validation";

const router = Router();

router.post(
  "/",
  authorize(UserRole.ADMIN),
  validate(createChapterZod),
  chapterController.createChapter
);

router.get(
  "/",
  authorize(UserRole.ADMIN, UserRole.USER),
  chapterController.getAllChapters
);

router.patch(
  "/:id",
  authorize(UserRole.ADMIN),
  validate(updateChapterZod),
  chapterController.updateChapter
);

router.delete(
  "/:id",
  authorize(UserRole.ADMIN),
  chapterController.deleteChapter
);

export const chapterRoutes = router;
