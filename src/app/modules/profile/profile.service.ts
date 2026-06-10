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
  await prisma.level.findUniqueOrThrow({
    where: { id: levelId },
  });
  const result = await prisma.userProfile.update({
    where: { authId: userId },
    data: { activeLevelId: levelId },
  });
  return result;
};

const updateActiveChapter = async (userId: string, chapterId: string) => {
  await prisma.chapter.findUniqueOrThrow({
    where: { id: chapterId },
  });
  const result = await prisma.userProfile.update({
    where: { authId: userId },
    data: { activeChapterId: chapterId },
  });
  return result;
};

const updateActiveLesson = async (userId: string, lessonId: string) => {
  await prisma.lesson.findUniqueOrThrow({
    where: { id: lessonId },
  });
  const result = await prisma.userProfile.update({
    where: { authId: userId },
    data: { activeLessonId: lessonId },
  });
  return result;
};

const updateActiveQuestion = async (userId: string, questionId: string) => {
  await prisma.question.findUniqueOrThrow({
    where: { id: questionId },
  });
  const result = await prisma.userProfile.update({
    where: { authId: userId },
    data: { activeQuestionId: questionId },
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
