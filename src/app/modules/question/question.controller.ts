import { TAuthUser, TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { sendResponse } from "../../utils/sendResponse";
import { questionServices } from "./question.service";

const createQuestion = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await questionServices.createQuestion(req.body);

  sendResponse(res, {
    status: 201,
    message: "Question created successfully!",
    data: result,
  });
});

const getAllQuestions = handleAsyncRequest(async (_req: TRequest, res) => {
  const result = await questionServices.getAllQuestions();

  sendResponse(res, {
    message: "All questions retrieved successfully!",
    data: result,
  });
});

const getQuestionsByChapter = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await questionServices.getQuestionsByChapter(
    req.params.chapterId as string,
    req.user as TAuthUser
  );

  sendResponse(res, {
    message: "Questions retrieved successfully!",
    data: result,
  });
});

const updateQuestion = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await questionServices.updateQuestion(
    req.params.id as string,
    req.body
  );

  sendResponse(res, {
    message: "Question updated successfully!",
    data: result,
  });
});

const deleteQuestion = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await questionServices.deleteQuestion(req.params.id as string);

  sendResponse(res, {
    message: "Question deleted successfully!",
    data: result,
  });
});

export const questionController = {
  createQuestion,
  getAllQuestions,
  getQuestionsByChapter,
  updateQuestion,
  deleteQuestion,
};
