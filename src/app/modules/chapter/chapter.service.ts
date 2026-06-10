import { Prisma } from "@prisma/client";
import ApiError from "../../classes/ApiError";
import { TAuthUser } from "../../interface/global.interface";
import prisma from "../../utils/prisma";
import { CreateChapterZod, UpdateChapterZod } from "./chapter.validation";

const createChapter = async (payload: CreateChapterZod) => {
  const level = await prisma.level.findUnique({
    where: { id: payload.levelId },
  });
  if (!level) throw new ApiError(404, "Invalid level id!");

  const existingWithSameIndex = await prisma.chapter.findFirst({
    where: { levelId: payload.levelId, index: payload.index },
  });
  if (existingWithSameIndex)
    throw new ApiError(400, "Chapter index already exists for this level!");

  const result = await prisma.chapter.create({ data: payload });
  return result;
};

const getAllChapters = async (authUser: TAuthUser, levelId?: string) => {
  const andConditions: Prisma.ChapterWhereInput[] = [];
  if (levelId) andConditions.push({ levelId });
  const whereConditions: Prisma.ChapterWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const chapters = await prisma.chapter.findMany({
    where: whereConditions,
    orderBy: { index: "asc" },
    include: { level: { select: { id: true, name: true, index: true } } },
  });

  if (authUser.role === "USER") {
    let activeChapterId: string | null = null;

    const userProfile = await prisma.userProfile.findUnique({
      where: { authId: authUser.id },
      select: { activeChapterId: true },
    });

    if (userProfile?.activeChapterId) {
      activeChapterId = userProfile.activeChapterId;
    }

    const activeChapterIndex = chapters.findIndex(
      chapter => chapter.id === activeChapterId
    );
    const result = chapters.map((chapter, index) => {
      if (index < activeChapterIndex) {
        return { ...chapter, isCompleted: true };
      }
      return { ...chapter, isCompleted: false };
    });
    return result;
  }

  return chapters;
};

const updateChapter = async (chapterId: string, payload: UpdateChapterZod) => {
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
  });
  if (!chapter) throw new ApiError(404, "Chapter not found!");

  if (payload.index) {
    const targetLevelId = chapter.levelId;
    const existingWithSameIndex = await prisma.chapter.findFirst({
      where: {
        levelId: targetLevelId,
        index: payload.index,
        id: { not: chapterId },
      },
    });
    if (existingWithSameIndex)
      throw new ApiError(400, "Chapter index already exists for this level!");
  }

  const result = await prisma.chapter.update({
    where: { id: chapterId },
    data: payload,
  });
  return result;
};

const deleteChapter = async (chapterId: string) => {
  const result = await prisma.chapter.delete({
    where: { id: chapterId },
  });
  return result;
};

export const chapterServices = {
  createChapter,
  getAllChapters,
  updateChapter,
  deleteChapter,
};
