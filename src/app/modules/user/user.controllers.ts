import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.services";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/SendResponse";
import status from "http-status";

/**
 * @Method POST
 * @Dsc Admin Create
 * @Return Data
 */
const createAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.adminSaveToDB(req);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Admin Created Successful",
      data: result,
    });
  }
);

/**
 * @Method POST
 * @Dsc Doctor Create
 * @Return Data
 */
const doctorCreate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.doctorSaveToDB(req);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Doctor Created Successful",
      data: result,
    });
  }
);

/**
 * @Method POST
 * @Dsc Patient Create
 * @Return Data
 */
const patientCreate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.patientSaveToDB(req);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Patient Created Successful",
      data: result,
    });
  }
);
export const UserControllers = {
  createAdmin,
  doctorCreate,
  patientCreate,
};
