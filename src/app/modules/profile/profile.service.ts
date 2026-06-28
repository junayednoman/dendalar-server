import ApiError from "../../classes/ApiError";
import { TFile } from "../../interface/file.interface";
import { deleteFromS3, uploadToS3 } from "../../utils/awss3";
import prisma from "../../utils/prisma";
import { TUpdateProfile } from "./profile.validation";

const findFirstChapterByLevelId = async (levelId: string) => {
  const chapter = await prisma.chapter.findFirst({
    where: { levelId },
    orderBy: { index: "asc" },
  });

  if (!chapter) throw new ApiError(404, "Next chapter not found!");
  return chapter;
};

const findFirstLessonByChapterId = async (chapterId: string) => {
  const lesson = await prisma.lesson.findFirst({
    where: { chapterId },
    orderBy: [{ index: "asc" }, { lessonType: "asc" }],
  });

  if (!lesson) throw new ApiError(404, "Next lesson not found!");
  return lesson;
};

const findFirstQuestionByLessonId = async (
  lessonId: string,
  chapterId: string
) => {
  const question = await prisma.question.findFirst({
    where: { lessonId, chapterId },
    orderBy: [{ index: "asc" }, { createdAt: "asc" }],
  });

  if (!question) throw new ApiError(404, "Next question not found!");
  return question;
};

const getProfile = async (userId: string) => {
  const profile = await prisma.profile.findUnique({
    where: { authId: userId },
    include: {
      auth: {
        select: {
          email: true,
          status: true,
          role: true,
        },
      },
    },
  });

  if (!profile) throw new ApiError(404, "Profile not found!");

  return profile;
};

const updateProfile = async (
  userId: string,
  payload: TUpdateProfile,
  file?: TFile
) => {
  const profile = await prisma.profile.findUnique({
    where: { authId: userId },
  });

  if (!profile) throw new ApiError(404, "Profile not found!");

  if (file) {
    payload.image = await uploadToS3(file);
  }

  const result = await prisma.profile.update({
    where: { authId: userId },
    data: payload,
  });

  if (result && file) {
    await deleteFromS3(profile.image);
  }

  return result;
};

const updateActiveLevel = async (userId: string) => {
  const userProfile = await prisma.userProfile.findUnique({
    where: { authId: userId },
    select: { activeLevelId: true },
  });

  if (!userProfile?.activeLevelId) {
    throw new ApiError(404, "No active level found for this user!");
  }

  const currentLevel = await prisma.level.findUniqueOrThrow({
    where: { id: userProfile.activeLevelId },
  });
  const nextLevel = await prisma.level.findUniqueOrThrow({
    where: { index: currentLevel.index + 1 },
  });
  const result = await prisma.userProfile.update({
    where: { authId: userId },
    data: { activeLevelId: nextLevel.id },
  });
  return result;
};

const updateActiveChapter = async (userId: string, chapterId: string) => {
  const currentChapter = await prisma.chapter.findUniqueOrThrow({
    where: { id: chapterId },
    include: {
      level: {
        select: {
          id: true,
          index: true,
        },
      },
    },
  });

  let nextChapter = await prisma.chapter.findFirst({
    where: {
      levelId: currentChapter.levelId,
      index: { gt: currentChapter.index },
    },
    orderBy: { index: "asc" },
  });

  let nextLevelId = currentChapter.levelId;

  if (!nextChapter) {
    const nextLevel = await prisma.level.findFirst({
      where: { index: { gt: currentChapter.level.index } },
      orderBy: { index: "asc" },
    });

    if (!nextLevel) throw new ApiError(404, "Next chapter not found!");

    nextLevelId = nextLevel.id;
    nextChapter = await findFirstChapterByLevelId(nextLevel.id);
  }

  const result = await prisma.userProfile.update({
    where: { authId: userId },
    data: {
      activeLevelId: nextLevelId,
      activeChapterId: nextChapter.id,
    },
  });
  return result;
};

const updateActiveLesson = async (userId: string, lessonId: string) => {
  const currentLesson = await prisma.lesson.findUniqueOrThrow({
    where: { id: lessonId },
    include: {
      chapter: {
        include: {
          level: {
            select: {
              id: true,
              index: true,
            },
          },
        },
      },
    },
  });

  let nextLesson = await prisma.lesson.findFirst({
    where: {
      chapterId: currentLesson.chapterId,
      index: { gt: currentLesson.index },
    },
    orderBy: [{ index: "asc" }, { lessonType: "asc" }],
  });

  let nextChapterId = currentLesson.chapterId;
  let nextLevelId = currentLesson.chapter.levelId;

  if (!nextLesson) {
    let nextChapter = await prisma.chapter.findFirst({
      where: {
        levelId: currentLesson.chapter.levelId,
        index: { gt: currentLesson.chapter.index },
      },
      orderBy: { index: "asc" },
    });

    if (!nextChapter) {
      const nextLevel = await prisma.level.findFirst({
        where: { index: { gt: currentLesson.chapter.level.index } },
        orderBy: { index: "asc" },
      });

      if (!nextLevel) throw new ApiError(404, "Next lesson not found!");

      nextLevelId = nextLevel.id;
      nextChapter = await findFirstChapterByLevelId(nextLevel.id);
    }

    nextChapterId = nextChapter.id;
    nextLevelId = nextChapter.levelId;
    nextLesson = await findFirstLessonByChapterId(nextChapter.id);
  }

  const result = await prisma.userProfile.update({
    where: { authId: userId },
    data: {
      activeLevelId: nextLevelId,
      activeChapterId: nextChapterId,
      activeLessonId: nextLesson.id,
    },
  });
  return result;
};

const updateActiveQuestion = async (userId: string, questionId: string) => {
  const currentQuestion = await prisma.question.findUniqueOrThrow({
    where: { id: questionId },
    include: {
      lesson: {
        include: {
          chapter: {
            include: {
              level: {
                select: {
                  id: true,
                  index: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!currentQuestion.lessonId) {
    throw new ApiError(
      404,
      "Current question is not associated with a lesson!"
    );
  }

  const questions = await prisma.question.findMany({
    where: {
      chapterId: currentQuestion.chapterId,
      lessonId: currentQuestion.lessonId,
    },
    orderBy: [{ index: "asc" }, { createdAt: "asc" }],
  });

  const currentQuestionIndex = questions.findIndex(
    question => question.id === questionId
  );
  let nextQuestion = questions[currentQuestionIndex + 1];
  let nextLessonId = currentQuestion.lessonId;
  let nextChapterId = currentQuestion.chapterId;
  let nextLevelId = currentQuestion.lesson?.chapter.levelId;

  if (!nextQuestion) {
    let nextLesson = await prisma.lesson.findFirst({
      where: {
        chapterId: currentQuestion.chapterId,
        index: { gt: currentQuestion.lesson?.index },
      },
      orderBy: [{ index: "asc" }, { lessonType: "asc" }],
    });

    let nextChapter = currentQuestion.lesson?.chapter ?? null;

    if (!nextLesson) {
      nextChapter = await prisma.chapter.findFirst({
        where: {
          levelId: currentQuestion.lesson?.chapter.levelId,
          index: { gt: currentQuestion.lesson?.chapter.index },
        },
        orderBy: { index: "asc" },
        include: {
          level: {
            select: {
              id: true,
              index: true,
            },
          },
        },
      });

      if (!nextChapter) {
        const nextLevel = await prisma.level.findFirst({
          where: { index: { gt: currentQuestion.lesson?.chapter.level.index } },
          orderBy: { index: "asc" },
        });

        if (!nextLevel) throw new ApiError(404, "Next question not found!");

        nextLevelId = nextLevel.id;
        nextChapter = await prisma.chapter.findFirst({
          where: { levelId: nextLevel.id },
          orderBy: { index: "asc" },
          include: {
            level: {
              select: {
                id: true,
                index: true,
              },
            },
          },
        });

        if (!nextChapter) throw new ApiError(404, "Next question not found!");
      } else {
        nextLevelId = nextChapter.levelId;
      }

      nextLesson = await findFirstLessonByChapterId(nextChapter.id);
    }

    nextLessonId = nextLesson.id;
    nextChapterId = nextLesson.chapterId;
    nextQuestion = await findFirstQuestionByLessonId(
      nextLesson.id,
      nextLesson.chapterId
    );
  }

  const result = await prisma.userProfile.update({
    where: { authId: userId },
    data: {
      activeLevelId: nextLevelId,
      activeChapterId: nextChapterId,
      activeLessonId: nextLessonId,
      activeQuestionId: nextQuestion.id,
    },
  });
  return result;
};

const resetLevel = async (userId: string) => {
  const firstLevel = await prisma.level.findFirst({
    orderBy: { index: "asc" },
  });
  if (!firstLevel) throw new ApiError(404, "No level found!");

  const firstChapter = await prisma.chapter.findFirst({
    where: { levelId: firstLevel.id },
    orderBy: { index: "asc" },
  });
  if (!firstChapter) throw new ApiError(404, "No chapter found!");

  const firstLesson = await prisma.lesson.findFirst({
    where: { chapterId: firstChapter.id },
    orderBy: [{ index: "asc" }, { lessonType: "asc" }],
  });
  if (!firstLesson) throw new ApiError(404, "No lesson found!");

  const firstQuestion = await prisma.question.findFirst({
    where: {
      chapterId: firstChapter.id,
      lessonId: firstLesson.id,
    },
    orderBy: [{ index: "asc" }, { createdAt: "asc" }],
  });
  if (!firstQuestion) throw new ApiError(404, "No question found!");

  const result = await prisma.userProfile.update({
    where: { authId: userId },
    data: {
      activeLevelId: firstLevel.id,
      activeChapterId: firstChapter.id,
      activeLessonId: firstLesson.id,
      activeQuestionId: firstQuestion.id,
    },
  });

  return result;
};

export const profileServices = {
  getProfile,
  updateProfile,
  updateActiveLevel,
  updateActiveChapter,
  updateActiveLesson,
  updateActiveQuestion,
  resetLevel,
};
