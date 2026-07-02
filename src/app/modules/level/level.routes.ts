import { Router } from "express";
import { levelController } from "./level.controller";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";
import validate from "../../middlewares/validate";
import { createLevelZod, updateLevelZod } from "./level.validation";
import { uploadImage } from "../../utils/awss3";

const router = Router();

router.post(
  "/",
  authorize(UserRole.ADMIN),
  uploadImage.single("image"),
  validate(createLevelZod, { formData: true }),
  levelController.createLevel
);

router.get(
  "/",
  authorize(UserRole.ADMIN, UserRole.USER),
  levelController.getAllLevels
);

router.patch(
  "/:id",
  authorize(UserRole.ADMIN),
  uploadImage.single("image"),
  validate(updateLevelZod, { formData: true }),
  levelController.updateLevel
);

router.delete("/:id", authorize(UserRole.ADMIN), levelController.deleteLevel);

export const levelRoutes = router;
