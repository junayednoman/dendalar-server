import ApiError from "../../classes/ApiError";
import { TFile } from "../../interface/file.interface";
import { deleteFromS3, uploadToS3 } from "../../utils/awss3";
import prisma from "../../utils/prisma";
import { TUpdateProfile } from "./profile.validation";

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

const updateActiveLevel = async (userId: string, levelId: string) => {
  const currentLevel = await prisma.level.findUniqueOrThrow({
    where: { id: levelId },
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
  });

  const nextChapter = await prisma.chapter.findUniqueOrThrow({
    where: {
      levelId_index: {
        levelId: currentChapter.levelId,
        index: currentChapter.index + 1,
      },
    },
  });
  const result = await prisma.userProfile.update({
    where: { authId: userId },
    data: { activeChapterId: nextChapter.id },
  });
  return result;
};

const updateActiveLesson = async (userId: string, lessonId: string) => {
  const currentLesson = await prisma.lesson.findUniqueOrThrow({
    where: { id: lessonId },
  });

  const nextLesson = await prisma.lesson.findUniqueOrThrow({
    where: {
      index: currentLesson.index + 1,
    },
  });
  const result = await prisma.userProfile.update({
    where: { authId: userId },
    data: { activeLessonId: nextLesson.id },
  });
  return result;
};

const updateActiveQuestion = async (userId: string, questionId: string) => {
  const currentQuestion = await prisma.question.findUniqueOrThrow({
    where: { id: questionId },
  });

  const nextQuestion = await prisma.question.findUniqueOrThrow({
    where: {
      index_type_chapterId_lessonId: {
        index: currentQuestion.index + 1,
        type: currentQuestion.type,
        chapterId: currentQuestion.chapterId,
        lessonId: currentQuestion.lessonId,
      },
    },
  });
  const result = await prisma.userProfile.update({
    where: { authId: userId },
    data: { activeQuestionId: nextQuestion.id },
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
};
