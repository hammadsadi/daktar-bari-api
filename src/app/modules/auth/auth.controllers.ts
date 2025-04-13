import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { AuthServices } from "./auth.services";
import sendResponse from "../../shared/SendResponse";
import status from "http-status";

/**
 * @Method POST
 * @Dsc Auth Login
 * @Params
 * @Return Data
 */

const loginAuth = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.authLogin(req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Logged in Successful",
    data: result,
  });
});

export const AUthControllers = {
  loginAuth,
};
