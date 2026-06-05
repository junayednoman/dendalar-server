import { TFile } from "../../interface/file.interface";
import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { sendResponse } from "../../utils/sendResponse";
import { lessonServices } from "./lesson.service";

const createLesson = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await lessonServices.createLesson(req.body, req.file as TFile);

  sendResponse(res, {
    status: 201,
    message: "Lesson created successfully!",
    data: result,
  });
});

const getAllLessons = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await lessonServices.getAllLessons();

  sendResponse(res, {
    message: "All lessons retrieved successfully!",
    data: result,
  });
});

const updateLesson = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await lessonServices.updateLesson(
    req.params.id as string,
    req.body,
    req.file as TFile
  );

  sendResponse(res, {
    message: "Lesson updated successfully!",
    data: result,
  });
});

const deleteLesson = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await lessonServices.deleteLesson(req.params.id as string);

  sendResponse(res, {
    message: "Lesson deleted successfully!",
    data: result,
  });
});

export const lessonController = {
  createLesson,
  getAllLessons,
  updateLesson,
  deleteLesson,
};
