import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.services";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/SendResponse";
import status from "http-status";
import pick from "../../utils/pick";
import { userValidateQueryData } from "./user.constants";

/**
 * @Method GET
 * @Dsc GET ALL ADMINS
 * @Return Data
 */

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  // Select Valid Key and Value
  const filter = pick(req.query, userValidateQueryData);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const resData = await UserServices.getAllUsersFromDB(filter, options);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Users Retrieved Successful",
    meta: resData.meta,
    data: resData.result,
  });
});

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

/**
 * @Method PATCH
 * @Dsc User Status Update
 * @Return Data
 */
const updateUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await UserServices.updateUserStatus(id, req.body);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "User Status Changed!",
      data: result,
    });
  }
);

/**
 * @Method GET
 * @Dsc Get My Profile Data
 * @Return Data
 */
const getProfileData = catchAsync(
  async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const user = req.user;
    const result = await UserServices.getMyProfileData(user);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Profile Data Retrieved Successful!",
      data: result,
    });
  }
);

export const UserControllers = {
  createAdmin,
  doctorCreate,
  patientCreate,
  getAllUsers,
  updateUserStatus,
  getProfileData,
};
