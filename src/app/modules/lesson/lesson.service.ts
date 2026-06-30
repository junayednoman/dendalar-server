import ApiError from "../../classes/ApiError";
import { TAuthUser } from "../../interface/global.interface";
import prisma from "../../utils/prisma";
import { CreateLessonZod, UpdateLessonInputZod } from "./lesson.validation";

const createLesson = async (payload: CreateLessonZod) => {
  const chapter = await prisma.chapter.findUnique({
    where: { id: payload.chapterId },
  });
  if (!chapter) throw new ApiError(404, "Chapter not found!");

  const existingLesson = await prisma.lesson.findFirst({
    where: {
      chapterId: payload.chapterId,
      index: payload.index,
    },
  });
  if (existingLesson)
    throw new ApiError(
      400,
      "Lesson with same index already exists for this chapter!"
    );

  const result = await prisma.lesson.create({ data: payload });
  return result;
};

const getAllLessons = async (authUser: TAuthUser, chapterId?: string) => {
  if (chapterId) {
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
    });

    if (!chapter) throw new ApiError(404, "Invalid chapter id!");
  }

  const lessons = await prisma.lesson.findMany({
    where: chapterId ? { chapterId } : undefined,
    orderBy: [{ chapterId: "asc" }, { index: "asc" }, { lessonType: "asc" }],
    include: {
      chapter: {
        select: {
          id: true,
          name: true,
          index: true,
          levelId: true,
        },
      },
    },
  });

  if (authUser.role !== "USER") {
    return lessons;
  }

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
    firstChapterOfFirstLevel,
    selectedChapter,
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
      select: { id: true },
    }),
    prisma.chapter.findFirst({
      orderBy: [{ level: { index: "asc" } }, { index: "asc" }],
      select: { id: true, index: true, levelId: true },
    }),
    chapterId
      ? prisma.chapter.findUnique({
          where: { id: chapterId },
          select: {
            id: true,
            index: true,
            levelId: true,
            level: { select: { index: true } },
          },
        })
      : Promise.resolve(null),
    userProfile?.activeLevelId
      ? prisma.chapter.findFirst({
          where: { levelId: userProfile.activeLevelId },
          orderBy: { index: "asc" },
          select: { id: true, index: true, levelId: true },
        })
      : Promise.resolve(null),
  ]);

  const result = lessons.map((lesson, index) => {
    let isCompleted = false;
    let isLocked = true;

    const chapter = lesson.chapter;

    if (selectedChapter) {
      if (!activeLevel) {
        if (
          firstLevel?.id === selectedChapter.levelId &&
          firstChapterOfFirstLevel?.id === selectedChapter.id &&
          index === 0
        ) {
          isLocked = false;
        }
      } else if (selectedChapter.level.index < activeLevel.index) {
        isCompleted = true;
        isLocked = false;
      } else if (selectedChapter.level.index > activeLevel.index) {
        isLocked = true;
      } else if (
        activeChapter &&
        activeChapter.levelId === selectedChapter.levelId
      ) {
        if (selectedChapter.index < activeChapter.index) {
          isCompleted = true;
          isLocked = false;
        } else if (selectedChapter.index > activeChapter.index) {
          isLocked = true;
        } else if (
          activeLesson &&
          activeLesson.chapterId === selectedChapter.id
        ) {
          if (lesson.index < activeLesson.index) {
            isCompleted = true;
            isLocked = false;
          } else if (lesson.id === activeLesson.id) {
            isLocked = false;
          }
        } else if (index === 0) {
          isLocked = false;
        }
      } else if (selectedChapter.index === 1 && index === 0) {
        isLocked = false;
      }
    } else if (!activeLevel) {
      if (
        firstLevel?.id === chapter.levelId &&
        firstChapterOfFirstLevel?.id === chapter.id &&
        index === 0
      ) {
        isLocked = false;
      }
    } else if (activeChapter && chapter.levelId === activeChapter.levelId) {
      if (chapter.index < activeChapter.index) {
        isCompleted = true;
        isLocked = false;
      } else if (chapter.index > activeChapter.index) {
        isLocked = true;
      } else if (activeLesson && activeLesson.chapterId === chapter.id) {
        if (lesson.index < activeLesson.index) {
          isCompleted = true;
          isLocked = false;
        } else if (lesson.id === activeLesson.id) {
          isLocked = false;
        }
      }
    } else if (
      !activeChapter &&
      firstChapterOfActiveLevel?.id === chapter.id &&
      index === 0
    ) {
      isLocked = false;
    }

    return { ...lesson, isCompleted, isLocked };
  });

  return result;
};

const updateLesson = async (
  lessonId: string,
  payload: UpdateLessonInputZod
) => {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
  });
  if (!lesson) throw new ApiError(404, "Lesson not found!");

  if (payload.chapterId) {
    const chapter = await prisma.chapter.findUnique({
      where: { id: payload.chapterId },
    });
    if (!chapter) throw new ApiError(404, "Chapter not found!");
  }

  if (payload.chapterId || payload.index || payload.lessonType) {
    const targetChapterId = payload.chapterId || lesson.chapterId;
    const targetIndex = payload.index || lesson.index;
    const targetLessonType = payload.lessonType || lesson.lessonType;

    const existingLesson = await prisma.lesson.findFirst({
      where: {
        chapterId: targetChapterId,
        index: targetIndex,
        lessonType: targetLessonType,
        id: { not: lessonId },
      },
    });

    if (existingLesson)
      throw new ApiError(
        400,
        "Lesson with same index and type already exists for this chapter!"
      );
  }

  const result = await prisma.lesson.update({
    where: { id: lessonId },
    data: payload,
  });
  return result;
};

const deleteLesson = async (lessonId: string) => {
  const result = await prisma.lesson.delete({
    where: { id: lessonId },
  });
  return result;
};

export const lessonServices = {
  createLesson,
  getAllLessons,
  updateLesson,
  deleteLesson,
};
