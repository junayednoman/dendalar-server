import prisma from "../../utils/prisma";
import { TUpdateLegal } from "./legal.validation";

const upsertLegalData = async (payload: TUpdateLegal) => {
  const legalData = await prisma.legal.findFirst({});

  if (legalData) {
    const result = await prisma.legal.update({
      where: {
        id: legalData.id,
      },
      data: payload,
    });

    return result;
  } else {
    const result = await prisma.legal.create({
      data: payload,
    });

    return result;
  }
};

const getLegalData = async () => {
  const result = await prisma.legal.findFirst({});
  return result;
};

export const LegalService = {
  upsertLegalData,
  getLegalData,
};
