import ApiError from "../../classes/ApiError";
import { TAuthUser } from "../../interface/global.interface";
import prisma from "../../utils/prisma";
import { CreateLevelZod, UpdateLevelZod } from "./level.validation";

const createLevel = async (payload: CreateLevelZod) => {
  const existingWithSameName = await prisma.level.findFirst({
    where: { name: payload.name },
  });
  if (existingWithSameName)
    throw new ApiError(400, "Level name already exists!");

  const existingWithSameIndex = await prisma.level.findFirst({
    where: { index: payload.index },
  });
  if (existingWithSameIndex)
    throw new ApiError(400, "Level index already exists!");

  const result = await prisma.level.create({ data: payload });
  return result;
};

const getAllLevels = async (authUser: TAuthUser) => {
  const levels = await prisma.level.findMany({
    orderBy: { index: "asc" },
  });

  if (authUser.role !== "USER") {
    return levels;
  }

  let activeLevelId: string | null = null;
  const userProfile = await prisma.userProfile.findUnique({
    where: { authId: authUser.id },
    select: { activeLevelId: true },
  });

  if (userProfile?.activeLevelId) {
    activeLevelId = userProfile.activeLevelId;
  }

  if (activeLevelId) {
    const activeLevelIndex = levels.findIndex(
      level => level.id === activeLevelId
    );
    const result = levels.map((level, index) => {
      if (index < activeLevelIndex) {
        return { ...level, isCompleted: true, isLocked: false };
      }

      if (index === activeLevelIndex) {
        return { ...level, isCompleted: false, isLocked: false };
      }

      return { ...level, isCompleted: false, isLocked: true };
    });
    return result;
  } else {
    const result = levels.map((level, index) => {
      if (index === 0) return { ...level, isCompleted: false, isLocked: false };
      return { ...level, isCompleted: false, isLocked: true };
    });

    return result;
  }
};

const updateLevel = async (levelId: string, payload: UpdateLevelZod) => {
  if (payload.name) {
    const existingWithSameName = await prisma.level.findFirst({
      where: { name: payload.name },
    });
    if (existingWithSameName)
      throw new ApiError(400, "Level name already exists!");
  }

  if (payload.index) {
    const existingWithSameIndex = await prisma.level.findFirst({
      where: { index: payload.index },
    });
    if (existingWithSameIndex)
      throw new ApiError(400, "Level index already exists!");
  }

  const result = await prisma.level.update({
    where: { id: levelId },
    data: payload,
  });
  return result;
};

const deleteLevel = async (levelId: string) => {
  const result = await prisma.level.delete({ where: { id: levelId } });
  return result;
};

export const levelServices = {
  createLevel,
  getAllLevels,
  updateLevel,
  deleteLevel,
};
