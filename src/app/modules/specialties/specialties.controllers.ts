import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/SendResponse";
import status from "http-status";
import { SpecialtiesServices } from "./specialties.services";

/**
 * @Method POST
 * @Dsc CREATE specialties
 * @Return Data
 */

const createSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesServices.specialtiesSaveToDB(req);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Specialties Created Successful",
    data: result,
  });
});

/**
 * @Method GET
 * @Dsc GET All specialties
 * @Return Data
 */

const getAllSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesServices.getAllSpecialtiesFromDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Specialties Retrieved Successful",
    data: result,
  });
});

/**
 * @Method DELETE
 * @Dsc DELETE Single specialties
 * @Return Data
 * @Params specialtiesId
 */

const deleteSingleSpecialties = catchAsync(
  async (req: Request, res: Response) => {
    const { specialtiesId } = req.params;
    const result = await SpecialtiesServices.specialtiesDeleteFromDB(
      specialtiesId
    );
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Specialties Deleted Successful",
      data: result,
    });
  }
);

export const SpecialtiesControllers = {
  createSpecialties,
  getAllSpecialties,
  deleteSingleSpecialties,
};
