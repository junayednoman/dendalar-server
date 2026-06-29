import { Prisma } from "@prisma/client";
import { TFile } from "../../interface/file.interface";
import { deleteFromS3, uploadToS3 } from "../../utils/awss3";
import prisma from "../../utils/prisma";

const getProfile = async (authId: string) => {
  const profile = await prisma.profile.findUniqueOrThrow({
    where: {
      authId,
    },
  });

  return profile;
};

const updateProfile = async (
  authId: string,
  payload: Prisma.ProfileUpdateInput,
  file?: TFile
) => {
  const profile = await prisma.profile.findUniqueOrThrow({
    where: {
      authId,
    },
  });

  if (file) {
    payload.image = await uploadToS3(file);
  }

  const result = await prisma.profile.update({
    where: {
      authId,
    },
    data: payload,
  });

  if (result && payload.image && profile.image) {
    await deleteFromS3(profile.image);
  }

  return result;
};

const getDashboardStats = async (year?: number) => {
  const selectedYear =
    typeof year === "number" && Number.isInteger(year)
      ? year
      : new Date().getFullYear();
  const yearStart = new Date(selectedYear, 0, 1);
  const yearEnd = new Date(selectedYear + 1, 0, 1);

  const [totalUsers, totalLevels, totalLessons, users] = await Promise.all([
    prisma.auth.count({
      where: {
        role: "USER",
      },
    }),
    prisma.level.count(),
    prisma.lesson.count(),
    prisma.auth.findMany({
      where: {
        role: "USER",
        createdAt: {
          gte: yearStart,
          lt: yearEnd,
        },
      },
      select: {
        createdAt: true,
      },
    }),
  ]);

  const monthNames = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  const monthlyUsers = new Array(12).fill(0);

  users.forEach(user => {
    const monthIndex = user.createdAt.getMonth();
    monthlyUsers[monthIndex] += 1;
  });

  const userOverview = monthNames.map((month, index) => ({
    month,
    users: monthlyUsers[index],
  }));

  return {
    stats: {
      totalUsers,
      totalLevels,
      totalLessons,
    },
    userOverview,
  };
};

export const adminServices = {
  getProfile,
  updateProfile,
  getDashboardStats,
};
