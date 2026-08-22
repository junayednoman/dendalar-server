import { Router } from "express";
import validate from "../../middlewares/validate";
import {
  changeAccountStatusZod,
  changePasswordZod,
  loginZodSchema,
  resetPasswordZod,
  userSignUpZod,
} from "./auth.validation";
import { authController } from "./auth.controller";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/:id", authorize(UserRole.ADMIN), authController.getSingle);
router.get("/refresh-token", authController.refreshToken);
router.get("/", authorize(UserRole.ADMIN), authController.getAll);
router.post("/signup", validate(userSignUpZod), authController.signup);
router.post("/login", validate(loginZodSchema), authController.login);

router.post(
  "/reset-password",
  validate(resetPasswordZod),
  authController.resetPassword
);

router.post(
  "/change-password",
  authorize(UserRole.ADMIN, UserRole.USER),
  validate(changePasswordZod),
  authController.changePassword
);

router.delete(
  "/delete-account",
  authorize(UserRole.ADMIN, UserRole.USER),
  authController.deleteAccount
);

router.patch(
  "/change-account-status/:userId",
  authorize(UserRole.ADMIN),
  validate(changeAccountStatusZod),
  authController.changeAccountStatus
);

router.post(
  "/logout",
  authorize(UserRole.ADMIN, UserRole.USER),
  authController.logout
);

export const authRoutes = router;
