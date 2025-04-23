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

export const UserControllers = {
  createAdmin,
};
