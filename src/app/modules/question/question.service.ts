import ApiError from "../../classes/ApiError";
import { TAuthUser } from "../../interface/global.interface";
import prisma from "../../utils/prisma";
import { CreateQuestionZod, UpdateQuestionZod } from "./question.validation";

const createQuestion = async (payload: CreateQuestionZod) => {
  const chapter = await prisma.chapter.findUnique({
    where: { id: payload.chapterId },
  });
  if (!chapter) throw new ApiError(404, "Chapter not found!");

  const lesson = await prisma.lesson.findUnique({
    where: { id: payload.lessonId },
  });
  if (!lesson) throw new ApiError(404, "Lesson not found!");

  const existingWithSameIndex = await prisma.question.findFirst({
    where: {
      chapterId: payload.chapterId,
      lessonId: payload.lessonId,
      index: payload.index,
      type: payload.type,
    },
  });
  if (existingWithSameIndex)
    throw new ApiError(
      400,
      "Question with same index and type already exists!"
    );

  const result = await prisma.question.create({ data: payload });
  return result;
};

const getAllQuestions = async () => {
  const questions = await prisma.question.findMany({
    orderBy: { index: "asc" },
    include: {
      chapter: { select: { id: true, name: true, index: true } },
      lesson: { select: { id: true, name: true, index: true } },
    },
  });
  return questions;
};

const getQuestionsByChapter = async (
  chapterId: string,
  authUser: TAuthUser
) => {
  const questions = await prisma.question.findMany({
    where: { chapterId },
    orderBy: { index: "asc" },
    include: {
      lesson: { select: { id: true, name: true, index: true } },
    },
  });

  if (authUser.role === "USER") {
    let activeQuestionId: string | null = null;

    const userProfile = await prisma.userProfile.findUnique({
      where: { authId: authUser.id },
      select: { activeQuestionId: true },
    });

    if (userProfile?.activeQuestionId) {
      activeQuestionId = userProfile.activeQuestionId;
    }

    const activeQuestionIndex = questions.findIndex(
      question => question.id === activeQuestionId
    );
    const result = questions.map((question, index) => {
      if (index < activeQuestionIndex) {
        return { ...question, isCompleted: true };
      }
      return { ...question, isCompleted: false };
    });
    return result;
  }

  return questions;
};

const updateQuestion = async (
  questionId: string,
  payload: UpdateQuestionZod
) => {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
  });
  if (!question) throw new ApiError(404, "Question not found!");

  if (payload.chapterId || payload.lessonId || payload.index || payload.type) {
    const targetChapterId = payload.chapterId || question.chapterId;
    const targetLessonId = payload.lessonId || question.lessonId;
    const targetIndex = payload.index || question.index;
    const targetType = payload.type || question.type;

    const existingWithSameIndex = await prisma.question.findFirst({
      where: {
        chapterId: targetChapterId,
        lessonId: targetLessonId,
        index: targetIndex,
        type: targetType,
        id: { not: questionId },
      },
    });
    if (existingWithSameIndex)
      throw new ApiError(
        400,
        "Question with same index and type already exists!"
      );
  }

  if (payload.chapterId) {
    const chapter = await prisma.chapter.findUnique({
      where: { id: payload.chapterId },
    });
    if (!chapter) throw new ApiError(404, "Chapter not found!");
  }

  if (payload.lessonId) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: payload.lessonId },
    });
    if (!lesson) throw new ApiError(404, "Lesson not found!");
  }

  const result = await prisma.question.update({
    where: { id: questionId },
    data: payload,
  });
  return result;
};

const deleteQuestion = async (questionId: string) => {
  const result = await prisma.question.delete({
    where: { id: questionId },
  });
  return result;
};

export const questionServices = {
  createQuestion,
  getAllQuestions,
  getQuestionsByChapter,
  updateQuestion,
  deleteQuestion,
};
