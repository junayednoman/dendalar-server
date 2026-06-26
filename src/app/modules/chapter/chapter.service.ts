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
    include: {
      level: { select: { id: true, name: true, index: true } },
      lessons: {
        orderBy: [{ index: "asc" }, { lessonType: "asc" }],
      },
    },
  });

  if (authUser.role === "USER") {
    const userProfile = await prisma.userProfile.findUnique({
      where: { authId: authUser.id },
      select: {
        activeLevelId: true,
        activeChapterId: true,
        activeLessonId: true,
      },
    });

    const [
      activeLevel,
      activeChapter,
      activeLesson,
      firstLevel,
      firstChapter,
      firstChapterOfActiveLevel,
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
      prisma.level.findFirst({
        orderBy: { index: "asc" },
        select: { id: true, index: true },
      }),
      levelId
        ? prisma.chapter.findFirst({
            where: { levelId },
            orderBy: { index: "asc" },
            select: { id: true },
          })
        : prisma.chapter.findFirst({
            orderBy: [{ level: { index: "asc" } }, { index: "asc" }],
            select: { id: true },
          }),
      userProfile?.activeLevelId
        ? prisma.chapter.findFirst({
            where: { levelId: userProfile.activeLevelId },
            orderBy: { index: "asc" },
            select: { id: true },
          })
        : Promise.resolve(null),
    ]);

    const result = chapters.map(chapter => {
      let isCompleted = false;
      let isLocked = true;

      if (!activeLevel) {
        if (
          firstLevel?.id === chapter.levelId &&
          firstChapter?.id === chapter.id
        ) {
          isLocked = false;
        }
      } else if (chapter.level.index < activeLevel.index) {
        isCompleted = true;
        isLocked = false;
      } else if (chapter.level.index > activeLevel.index) {
        isLocked = true;
      } else if (activeChapter && activeChapter.levelId === chapter.levelId) {
        if (chapter.index < activeChapter.index) {
          isCompleted = true;
          isLocked = false;
        } else if (chapter.id === activeChapter.id) {
          isLocked = false;
        }
      } else if (
        (levelId ? firstChapter?.id : firstChapterOfActiveLevel?.id) ===
        chapter.id
      ) {
        isLocked = false;
      }

      const lessons = chapter.lessons.map((lesson, lessonIndex) => {
        let lessonCompleted = false;
        let lessonLocked = true;

        if (isCompleted) {
          lessonCompleted = true;
          lessonLocked = false;
        } else if (isLocked) {
          lessonLocked = true;
        } else if (activeLesson && activeLesson.chapterId === chapter.id) {
          if (lesson.index < activeLesson.index) {
            lessonCompleted = true;
            lessonLocked = false;
          } else if (lesson.id === activeLesson.id) {
            lessonLocked = false;
          }
        } else if (lessonIndex === 0) {
          lessonLocked = false;
        }

        return {
          ...lesson,
          isCompleted: lessonCompleted,
          isLocked: lessonLocked,
        };
      });

      return { ...chapter, lessons, isCompleted, isLocked };
    });

    return result;
  }

  return chapters.map(chapter => ({
    ...chapter,
    lessons: chapter.lessons.map(lesson => ({
      ...lesson,
      isCompleted: false,
      isLocked: false,
    })),
  }));
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
