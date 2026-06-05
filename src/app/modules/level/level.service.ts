import ApiError from "../../classes/ApiError";
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

const getAllLevels = async () => {
  const levels = await prisma.level.findMany({
    orderBy: { index: "asc" },
  });
  return levels;
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
