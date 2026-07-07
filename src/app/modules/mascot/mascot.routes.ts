import { UserRole } from "@prisma/client";
import { Router } from "express";
import authorize from "../../middlewares/authorize";
import validate from "../../middlewares/validate";
import { uploadImage } from "../../utils/awss3";
import { mascotController } from "./mascot.controller";
import { mascotFieldNames, removeMascotFieldZod } from "./mascot.validation";

const router = Router();

router.get(
  "/",
  authorize(UserRole.ADMIN, UserRole.USER),
  mascotController.getMascot
);

router.patch(
  "/",
  authorize(UserRole.ADMIN),
  uploadImage.fields(
    mascotFieldNames.map(fieldName => ({
      name: fieldName,
      maxCount: 1,
    }))
  ),
  mascotController.upsertMascot
);

router.patch(
  "/remove-field",
  authorize(UserRole.ADMIN),
  validate(removeMascotFieldZod),
  mascotController.removeMascotField
);

export const mascotRoutes = router;
