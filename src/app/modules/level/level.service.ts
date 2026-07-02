import ApiError from "../../classes/ApiError";
import { TFile } from "../../interface/file.interface";
import { TAuthUser } from "../../interface/global.interface";
import { deleteFromS3, uploadToS3 } from "../../utils/awss3";
import prisma from "../../utils/prisma";
import { CreateLevelZod, UpdateLevelZod } from "./level.validation";

const createLevel = async (payload: CreateLevelZod, file: TFile) => {
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

  payload.image = await uploadToS3(file);
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

const updateLevel = async (
  levelId: string,
  payload: UpdateLevelZod,
  file?: TFile
) => {
  const level = await prisma.level.findUnique({
    where: { id: levelId },
  });
  if (!level) throw new ApiError(404, "Level not found!");

  if (payload.name) {
    const existingWithSameName = await prisma.level.findFirst({
      where: { name: payload.name, id: { not: levelId } },
    });
    if (existingWithSameName)
      throw new ApiError(400, "Level name already exists!");
  }

  if (payload.index) {
    const existingWithSameIndex = await prisma.level.findFirst({
      where: { index: payload.index, id: { not: levelId } },
    });
    if (existingWithSameIndex)
      throw new ApiError(400, "Level index already exists!");
  }

  if (file) {
    payload.image = await uploadToS3(file);
  }

  const result = await prisma.level.update({
    where: { id: levelId },
    data: payload,
  });

  if (file && result.image) {
    await deleteFromS3(level.image);
  }

  return result;
};

const deleteLevel = async (levelId: string) => {
  const result = await prisma.level.delete({ where: { id: levelId } });
  if (result.image) {
    await deleteFromS3(result.image);
  }
  return result;
};

export const levelServices = {
  createLevel,
  getAllLevels,
  updateLevel,
  deleteLevel,
};
