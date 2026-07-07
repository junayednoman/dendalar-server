import { Response } from "express";
import { TFile } from "../../interface/file.interface";
import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { sendResponse } from "../../utils/sendResponse";
import { mascotServices } from "./mascot.service";

const getMascot = handleAsyncRequest(async (_req: TRequest, res: Response) => {
  const result = await mascotServices.getMascot();

  sendResponse(res, {
    message: "Mascot data fetched successfully!",
    data: result,
  });
});

const upsertMascot = handleAsyncRequest(async (req: TRequest, res: Response) => {
  const result = await mascotServices.upsertMascot(
    req.files as Record<string, TFile[]>
  );

  sendResponse(res, {
    message: "Mascot data upserted successfully!",
    data: result,
  });
});

const removeMascotField = handleAsyncRequest(
  async (req: TRequest, res: Response) => {
    const result = await mascotServices.removeMascotField(req.body.field);

    sendResponse(res, {
      message: "Mascot field removed successfully!",
      data: result,
    });
  }
);

export const mascotController = {
  getMascot,
  upsertMascot,
  removeMascotField,
};
