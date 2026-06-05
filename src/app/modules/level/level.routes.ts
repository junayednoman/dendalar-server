import { Router } from "express";
import { levelController } from "./level.controller";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";
import validate from "../../middlewares/validate";
import { createLevelZod, updateLevelZod } from "./level.validation";

const router = Router();

router.post(
  "/",
  authorize(UserRole.ADMIN),
  validate(createLevelZod),
  levelController.createLevel
);

router.get("/", authorize(UserRole.ADMIN), levelController.getAllLevels);

router.patch(
  "/:id",
  authorize(UserRole.ADMIN),
  validate(updateLevelZod),
  levelController.updateLevel
);

router.delete("/:id", authorize(UserRole.ADMIN), levelController.deleteLevel);

export const levelRoutes = router;
