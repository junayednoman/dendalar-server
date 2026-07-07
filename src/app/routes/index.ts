import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { adminRoutes } from "../modules/admin/admin.routes";
import { fileRoutes } from "../modules/uploadFile/uploadFile.routes";
import { otpRoutes } from "../modules/otp/otp.routes";
import { legalRoutes } from "../modules/legal/legal.routes";
import { levelRoutes } from "../modules/level/level.routes";
import { chapterRoutes } from "../modules/chapter/chapter.routes";
import { lessonRoutes } from "../modules/lesson/lesson.routes";
import { questionRoutes } from "../modules/question/question.routes";
import { profileRoutes } from "../modules/profile/profile.routes";
import { mascotRoutes } from "../modules/mascot/mascot.routes";
const router = Router();

const routes = [
  { path: "/auths", route: authRoutes },
  { path: "/admins", route: adminRoutes },
  { path: "/otps", route: otpRoutes },
  { path: "/legal", route: legalRoutes },
  { path: "/levels", route: levelRoutes },
  { path: "/chapters", route: chapterRoutes },
  { path: "/lessons", route: lessonRoutes },
  { path: "/questions", route: questionRoutes },
  { path: "/profile", route: profileRoutes },
  { path: "/mascots", route: mascotRoutes },
  { path: "/upload-files", route: fileRoutes },
];

routes.forEach(route => {
  router.use(route.path, route.route);
});

export default router;
