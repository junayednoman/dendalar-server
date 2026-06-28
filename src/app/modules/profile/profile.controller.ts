import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { sendResponse } from "../../utils/sendResponse";
import { profileServices } from "./profile.service";

const getProfile = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await profileServices.getProfile(req.user?.id as string);

  sendResponse(res, {
    message: "Profile retrieved successfully!",
    data: result,
  });
});

const updateProfile = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await profileServices.updateProfile(
    req.user?.id as string,
    req.body,
    req.file
  );

  sendResponse(res, {
    message: "Profile updated successfully!",
    data: result,
  });
});

const updateActiveLevel = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await profileServices.updateActiveLevel(req.user?.id as string);

  sendResponse(res, {
    message: "Active level updated successfully!",
    data: result,
  });
});

const updateActiveChapter = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await profileServices.updateActiveChapter(
    req.user?.id as string,
    req.body.chapterId
  );

  sendResponse(res, {
    message: "Active chapter updated successfully!",
    data: result,
  });
});

const updateActiveLesson = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await profileServices.updateActiveLesson(
    req.user?.id as string,
    req.body.lessonId
  );

  sendResponse(res, {
    message: "Active lesson updated successfully!",
    data: result,
  });
});

const updateActiveQuestion = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await profileServices.updateActiveQuestion(
    req.user?.id as string,
    req.body.questionId
  );

  sendResponse(res, {
    message: "Active question updated successfully!",
    data: result,
  });
});

const resetLevel = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await profileServices.resetLevel(req.user?.id as string);

  sendResponse(res, {
    message: "Level reset successfully!",
    data: result,
  });
});

export const profileController = {
  getProfile,
  updateProfile,
  updateActiveLevel,
  updateActiveChapter,
  updateActiveLesson,
  updateActiveQuestion,
  resetLevel,
};
