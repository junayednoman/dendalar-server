import { TFile } from "../../interface/file.interface";
import { TAuthUser, TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { sendResponse } from "../../utils/sendResponse";
import { levelServices } from "./level.service";

const createLevel = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await levelServices.createLevel(req.body, req.file as TFile);

  sendResponse(res, {
    status: 201,
    message: "Level created successfully!",
    data: result,
  });
});

const getAllLevels = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await levelServices.getAllLevels(req.user as TAuthUser);

  sendResponse(res, {
    message: "All levels retrieved successfully!",
    data: result,
  });
});

const updateLevel = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await levelServices.updateLevel(
    req.params.id as string,
    req.body,
    req.file as TFile
  );

  sendResponse(res, {
    message: "Level updated successfully!",
    data: result,
  });
});

const deleteLevel = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await levelServices.deleteLevel(req.params.id as string);

  sendResponse(res, {
    message: "Level deleted successfully!",
    data: result,
  });
});

export const levelController = {
  createLevel,
  getAllLevels,
  updateLevel,
  deleteLevel,
};
