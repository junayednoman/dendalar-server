import { TAuthUser, TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import pick from "../../utils/pick";
import { sendResponse } from "../../utils/sendResponse";
import { questionServices } from "./question.service";

const getQuestionFilters = (
  req: TRequest
): {
  lessonId?: string;
} => ({
  lessonId: typeof req.query.lessonId === "string" ? req.query.lessonId : undefined,
});

const createQuestion = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await questionServices.createQuestion(req.body);

  sendResponse(res, {
    status: 201,
    message: "Question created successfully!",
    data: result,
  });
});

const getAllQuestions = handleAsyncRequest(async (req: TRequest, res) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "orderBy"]);
  const result = await questionServices.getAllQuestions(
    options,
    getQuestionFilters(req)
  );

  sendResponse(res, {
    message: "All questions retrieved successfully!",
    data: result,
  });
});

const getQuestionsByLesson = handleAsyncRequest(async (req: TRequest, res) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "orderBy"]);
  const result = await questionServices.getQuestionsByLesson(
    req.params.lessonId as string,
    req.user as TAuthUser,
    options
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
  getQuestionsByLesson,
  updateQuestion,
  deleteQuestion,
};
