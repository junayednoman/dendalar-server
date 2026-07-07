import { Prisma } from "@prisma/client";
import ApiError from "../../classes/ApiError";
import { TFile } from "../../interface/file.interface";
import { deleteFromS3, uploadToS3 } from "../../utils/awss3";
import prisma from "../../utils/prisma";
import { TMascotFieldName } from "./mascot.validation";

const MASCOT_KEY = "default";

const getMascot = async () => {
  const result = await prisma.mascot.findUnique({
    where: { key: MASCOT_KEY },
  });

  return result;
};

const upsertMascot = async (files?: Record<string, TFile[]>) => {
  const uploadedFields = Object.entries(files || {}).filter(
    ([, fieldFiles]) => Array.isArray(fieldFiles) && fieldFiles.length > 0
  );

  if (uploadedFields.length === 0) {
    throw new ApiError(400, "At least one mascot image is required!");
  }

  const existingMascot = await prisma.mascot.findUnique({
    where: { key: MASCOT_KEY },
  });

  const data: Prisma.MascotUpdateInput = {};

  for (const [field, fieldFiles] of uploadedFields) {
    data[field as TMascotFieldName] = await uploadToS3(fieldFiles[0] as TFile);
  }

  const result = await prisma.mascot.upsert({
    where: { key: MASCOT_KEY },
    create: {
      key: MASCOT_KEY,
      ...(data as Prisma.MascotCreateInput),
    },
    update: data,
  });

  if (existingMascot) {
    for (const [field] of uploadedFields) {
      const previousImage = existingMascot[field as TMascotFieldName];
      const nextImage = result[field as TMascotFieldName];

      if (previousImage && previousImage !== nextImage) {
        await deleteFromS3(previousImage);
      }
    }
  }

  return result;
};

const removeMascotField = async (field: TMascotFieldName) => {
  const mascot = await prisma.mascot.findUnique({
    where: { key: MASCOT_KEY },
  });

  if (!mascot) {
    throw new ApiError(404, "Mascot data not found!");
  }

  const currentValue = mascot[field];

  const result = await prisma.mascot.update({
    where: { key: MASCOT_KEY },
    data: {
      [field]: null,
    },
  });

  if (currentValue) {
    await deleteFromS3(currentValue);
  }

  return result;
};

export const mascotServices = {
  getMascot,
  upsertMascot,
  removeMascotField,
};
