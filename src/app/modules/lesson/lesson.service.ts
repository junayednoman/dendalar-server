import ApiError from "../../classes/ApiError";
import { TFile } from "../../interface/file.interface";
import { TAuthUser } from "../../interface/global.interface";
import { deleteFromS3, uploadToS3 } from "../../utils/awss3";
import prisma from "../../utils/prisma";
import { CreateLessonZod, UpdateLessonZod } from "./lesson.validation";

const createLesson = async (payload: CreateLessonZod, file: TFile) => {
  const existingWithSameName = await prisma.lesson.findFirst({
    where: { name: payload.name },
  });
  if (existingWithSameName)
    throw new ApiError(400, "Lesson name already exists!");

  const existingWithSameIndex = await prisma.lesson.findFirst({
    where: { index: payload.index },
  });
  if (existingWithSameIndex)
    throw new ApiError(400, "Lesson index already exists!");

  payload.icon = await uploadToS3(file);
  const result = await prisma.lesson.create({ data: payload });
  return result;
};

const getAllLessons = async (authUser: TAuthUser) => {
  const lessons = await prisma.lesson.findMany({
    orderBy: { index: "asc" },
  });

  if (authUser.role === "USER") {
    let activeLessonId: string | null = null;

    const userProfile = await prisma.userProfile.findUnique({
      where: { authId: authUser.id },
      select: { activeLessonId: true },
    });

    if (userProfile?.activeLessonId) {
      activeLessonId = userProfile.activeLessonId;
    }

    const activeLessonIndex = lessons.findIndex(
      lesson => lesson.id === activeLessonId
    );
    const result = lessons.map((lesson, index) => {
      if (index < activeLessonIndex) {
        return { ...lesson, isCompleted: true };
      }
      return { ...lesson, isCompleted: false };
    });
    return result;
  }

  return lessons;
};

const updateLesson = async (
  lessonId: string,
  payload: UpdateLessonZod,
  file?: TFile
) => {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
  });
  if (!lesson) throw new ApiError(404, "Lesson not found!");

  if (payload.name) {
    const existingWithSameName = await prisma.lesson.findFirst({
      where: { name: payload.name, id: { not: lessonId } },
    });
    if (existingWithSameName)
      throw new ApiError(400, "Lesson name already exists!");
  }

  if (payload.index) {
    const existingWithSameIndex = await prisma.lesson.findFirst({
      where: { index: payload.index, id: { not: lessonId } },
    });
    if (existingWithSameIndex)
      throw new ApiError(400, "Lesson index already exists!");
  }
  if (file) {
    payload.icon = await uploadToS3(file);
  }
  const result = await prisma.lesson.update({
    where: { id: lessonId },
    data: payload,
  });

  if (file && result) {
    await deleteFromS3(lesson.icon);
  }
  return result;
};

const deleteLesson = async (lessonId: string) => {
  const result = await prisma.lesson.delete({
    where: { id: lessonId },
  });
  if (result) {
    await deleteFromS3(result.icon);
  }
  return result;
};

export const lessonServices = {
  createLesson,
  getAllLessons,
  updateLesson,
  deleteLesson,
};
