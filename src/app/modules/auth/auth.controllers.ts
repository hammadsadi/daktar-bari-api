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

  // Set Refresh Token
  const { refreshToken } = result;
  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Logged in Successful",
    data: {
      accessToken: result.accessToken,
      needPasswordChange: result.needPasswordChange,
    },
  });
});

/**
 * @Method POST
 * @Dsc Create Refresh Token
 * @Params
 * @Return Data
 */

const refreshTokenCreate = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.createRefreshToken(refreshToken);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Access Token Created Successful",
    data: result,
  });
});

/**
 * @Method POST
 * @Dsc Change User Password
 * @Params
 * @Return Data
 */

const changeUserPassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await AuthServices.userPasswordChange(req.user, req.body);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Password Changed Successfully",
      data: result,
    });
  }
);

/**
 * @Method POST
 * @Dsc Password Reset Lik Generate
 * @Params
 * @Return Data
 */

const generatePasswordResetLink = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AuthServices.forgotPasswordGenerate(req.body);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Password Reset Link Generate Successfully",
      data: result,
    });
  }
);

/**
 * @Method POST
 * @Dsc Password Reset
 * @Params
 * @Return Data
 */

const userPasswordReset = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";
  const result = await AuthServices.passwordReset(token, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Password Reset Successfully",
    data: result,
  });
});

export const AuthControllers = {
  loginAuth,
  refreshTokenCreate,
  changeUserPassword,
  generatePasswordResetLink,
  userPasswordReset,
};
