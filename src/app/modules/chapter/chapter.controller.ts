import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { sendResponse } from "../../utils/sendResponse";
import { chapterServices } from "./chapter.service";

const createChapter = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await chapterServices.createChapter(req.body);

  sendResponse(res, {
    status: 201,
    message: "Chapter created successfully!",
    data: result,
  });
});

const getAllChapters = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await chapterServices.getAllChapters();

  sendResponse(res, {
    message: "All chapters retrieved successfully!",
    data: result,
  });
});

const updateChapter = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await chapterServices.updateChapter(
    req.params.id as string,
    req.body
  );

  sendResponse(res, {
    message: "Chapter updated successfully!",
    data: result,
  });
});

const deleteChapter = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await chapterServices.deleteChapter(req.params.id as string);

  sendResponse(res, {
    message: "Chapter deleted successfully!",
    data: result,
  });
});

export const chapterController = {
  createChapter,
  getAllChapters,
  updateChapter,
  deleteChapter,
};
