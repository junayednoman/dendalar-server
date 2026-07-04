import ApiError from "../../classes/ApiError";
import { TAuthUser } from "../../interface/global.interface";
import {
  calculatePagination,
  TPaginationOptions,
} from "../../utils/paginationCalculation";
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

  if (
    lesson.lessonType === "SENTENCE" &&
    (!payload.sentenceInEnglish ||
      !payload.sentenceInLearningLanguage ||
      !payload.hint)
  ) {
    throw new ApiError(
      400,
      "For sentence type, sentenceInEnglish, sentenceInLearningLanguage, and hint are required"
    );
  }

  if (
    lesson.lessonType === "DIALOGUE" &&
    (!payload.fullSentence || !payload.missingWord)
  ) {
    throw new ApiError(
      400,
      "For dialogue type, fullSentence and missingWord are required"
    );
  }

  const existingWithSameIndex = await prisma.question.findFirst({
    where: {
      chapterId: payload.chapterId,
      lessonId: payload.lessonId,
      index: payload.index,
      type: lesson.lessonType,
    },
  });
  if (existingWithSameIndex)
    throw new ApiError(
      400,
      "Question with same index and type already exists!"
    );

  const result = await prisma.question.create({
    data: {
      ...payload,
      type: lesson.lessonType,
    },
  });
  return result;
};

const getAllQuestions = async (
  options: TPaginationOptions,
  filters?: { lessonId?: string }
) => {
  const { page, take, skip, sortBy, orderBy } = calculatePagination({
    page: options.page || 1,
    limit: options.limit || 7,
    sortBy: options.sortBy,
    orderBy: options.orderBy,
  });

  const questions = await prisma.question.findMany({
    where: {
      ...(filters?.lessonId ? { lessonId: filters.lessonId } : {}),
    },
    skip,
    take,
    orderBy: sortBy && orderBy ? { [sortBy]: orderBy } : { index: "asc" },
    include: {
      chapter: { select: { id: true, name: true, index: true } },
      lesson: { select: { id: true, index: true, lessonType: true } },
    },
  });

  const total = await prisma.question.count({
    where: {
      ...(filters?.lessonId ? { lessonId: filters.lessonId } : {}),
    },
  });

  return {
    meta: {
      page,
      limit: take,
      total,
    },
    questions,
  };
};

const getQuestionsByLesson = async (
  lessonId: string,
  authUser: TAuthUser,
  options: TPaginationOptions
) => {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      chapter: {
        select: {
          id: true,
          index: true,
          levelId: true,
          level: { select: { index: true, id: true } },
        },
      },
    },
  });
  if (!lesson) throw new ApiError(404, "Lesson not found!");

  const { page, take, skip, sortBy, orderBy } = calculatePagination({
    page: options.page || 1,
    limit: options.limit || 7,
    sortBy: options.sortBy,
    orderBy: options.orderBy,
  });

  const questions = await prisma.question.findMany({
    where: {
      lessonId,
    },
    skip,
    take,
    orderBy:
      sortBy && orderBy
        ? { [sortBy]: orderBy }
        : [{ index: "asc" }, { createdAt: "asc" }],
    include: {
      lesson: { select: { id: true, index: true, lessonType: true } },
    },
  });

  const total = await prisma.question.count({
    where: { lessonId },
  });

  if (authUser.role !== "USER") {
    return {
      meta: {
        page,
        limit: take,
        total,
      },
      questions,
    };
  }

  const userProfile = await prisma.userProfile.findUnique({
    where: { authId: authUser.id },
    select: {
      activeLevelId: true,
      activeChapterId: true,
      activeLessonId: true,
      activeQuestionId: true,
    },
  });

  const [
    activeLevel,
    activeChapter,
    activeLesson,
    activeQuestion,
    firstLevel,
    firstChapterOfFirstLevel,
    firstLessonOfFirstChapter,
    orderedLessonQuestions,
  ] = await Promise.all([
    userProfile?.activeLevelId
      ? prisma.level.findUnique({
          where: { id: userProfile.activeLevelId },
          select: { id: true, index: true },
        })
      : Promise.resolve(null),
    userProfile?.activeChapterId
      ? prisma.chapter.findUnique({
          where: { id: userProfile.activeChapterId },
          select: { id: true, index: true, levelId: true },
        })
      : Promise.resolve(null),
    userProfile?.activeLessonId
      ? prisma.lesson.findUnique({
          where: { id: userProfile.activeLessonId },
          select: { id: true, index: true, chapterId: true },
        })
      : Promise.resolve(null),
    userProfile?.activeQuestionId
      ? prisma.question.findUnique({
          where: { id: userProfile.activeQuestionId },
          select: { id: true, index: true, lessonId: true, chapterId: true },
        })
      : Promise.resolve(null),
    prisma.level.findFirst({
      orderBy: { index: "asc" },
      select: { id: true },
    }),
    prisma.chapter.findFirst({
      orderBy: [{ level: { index: "asc" } }, { index: "asc" }],
      select: { id: true, levelId: true },
    }),
    prisma.lesson.findFirst({
      orderBy: [
        { chapter: { level: { index: "asc" } } },
        { chapter: { index: "asc" } },
        { index: "asc" },
      ],
      select: { id: true, chapterId: true },
    }),
    prisma.question.findMany({
      where: { lessonId },
      orderBy: [{ index: "asc" }, { createdAt: "asc" }],
      select: { id: true },
    }),
  ]);

  const activeQuestionPosition = orderedLessonQuestions.findIndex(
    question => question.id === activeQuestion?.id
  );
  const questionPositionMap = new Map(
    orderedLessonQuestions.map((question, index) => [question.id, index])
  );

  const result = questions.map((question, index) => {
    let isCompleted = false;
    const questionPosition = questionPositionMap.get(question.id) ?? -1;

    if (activeQuestion && activeQuestion.lessonId === lesson.id) {
      if (
        activeQuestionPosition >= 0 &&
        questionPosition >= 0 &&
        questionPosition < activeQuestionPosition
      ) {
        isCompleted = true;
      }
    } else if (!activeLevel) {
      if (
        firstLevel?.id === lesson.chapter.level.id &&
        firstChapterOfFirstLevel?.id === lesson.chapter.id &&
        firstLessonOfFirstChapter?.id === lesson.id &&
        index === 0
      ) {
        isCompleted = false;
      }
    } else if (lesson.chapter.level.index < activeLevel.index) {
      isCompleted = true;
    } else if (activeChapter && lesson.chapter.index < activeChapter.index) {
      isCompleted = true;
    } else if (activeLesson && lesson.index < activeLesson.index) {
      isCompleted = true;
    }

    return { ...question, isCompleted };
  });

  return {
    meta: {
      page,
      limit: take,
      total,
    },
    questions: result,
  };
};

const updateQuestion = async (
  questionId: string,
  payload: UpdateQuestionZod
) => {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
  });
  if (!question) throw new ApiError(404, "Question not found!");

  let targetType = question.type;

  if (payload.lessonId) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: payload.lessonId },
    });
    if (!lesson) throw new ApiError(404, "Lesson not found!");
    targetType = lesson.lessonType;
  }

  if (payload.chapterId || payload.lessonId || payload.index) {
    const targetChapterId = payload.chapterId || question.chapterId;
    const targetLessonId = payload.lessonId || question.lessonId;
    const targetIndex = payload.index || question.index;

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

  if (
    targetType === "SENTENCE" &&
    ((payload.sentenceInEnglish !== undefined && !payload.sentenceInEnglish) ||
      (payload.sentenceInLearningLanguage !== undefined &&
        !payload.sentenceInLearningLanguage) ||
      (payload.hint !== undefined && !payload.hint))
  ) {
    throw new ApiError(
      400,
      "For sentence type, sentenceInEnglish, sentenceInLearningLanguage, and hint cannot be empty"
    );
  }

  if (
    targetType === "DIALOGUE" &&
    ((payload.fullSentence !== undefined && !payload.fullSentence) ||
      (payload.missingWord !== undefined && !payload.missingWord))
  ) {
    throw new ApiError(
      400,
      "For dialogue type, fullSentence and missingWord cannot be empty"
    );
  }

  const result = await prisma.question.update({
    where: { id: questionId },
    data: {
      ...payload,
      type: targetType,
    },
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
  getQuestionsByLesson,
  updateQuestion,
  deleteQuestion,
};
