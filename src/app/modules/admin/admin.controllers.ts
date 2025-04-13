import { NextFunction, Request, Response } from "express";
import { AdminServices } from "./admin.services";
import pick from "../../utils/pick";
import { validateQueryData } from "./admin.constant";
import sendResponse from "../../shared/SendResponse";
import status from "http-status";
import catchAsync from "../../shared/catchAsync";

/**
 * @Method GET
 * @Dsc GET ALL ADMINS
 * @Return Data
 */

const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
  // Select Valid Key and Value
  const filter = pick(req.query, validateQueryData);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const resData = await AdminServices.getAllAdminFromDB(filter, options);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin Retrieved Successful",
    meta: resData.meta,
    data: resData.result,
  });
});

/**
 * @Method GET
 * @Dsc GET Single ADMIN
 * @Params adminId
 * @Return Data
 */

const getSingleAdmin = catchAsync(async (req: Request, res: Response) => {
  // Get Id From Params
  const { adminId } = req.params;
  const resData = await AdminServices.findSingleAdminFromDB(adminId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin Retrieved Successful",
    data: resData,
  });
});

/**
 * @Method PATCH
 * @Dsc Update Single ADMIN Data
 * @Params adminId
 * @Return Data
 */

const updateAdminData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get Id From Params
    const { adminId } = req.params;
    const resData = await AdminServices.adminDataUpdate(adminId, req.body);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Admin Data Updated Successful",
      data: resData,
    });
  }
);

/**
 * @Method DELETE
 * @Dsc DELETE Single ADMIN Data
 * @Params adminId
 * @Return Data
 */

const deleteAdminData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get Id From Params
    const { adminId } = req.params;
    const resData = await AdminServices.deleteSingleAdmin(adminId);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Admin Data Deleted Successful",
      data: resData,
    });
  }
);

/**
 * @Method DELETE
 * @Dsc Soft DELETE Single ADMIN Data
 * @Params adminId
 * @Return Data
 */

const softDeleteAdminData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get Id From Params
    const { adminId } = req.params;
    const resData = await AdminServices.softDeleteSingleAdminFromDB(adminId);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Admin Data Deleted Successful",
      data: resData,
    });
  }
);
export const AdminControllers = {
  getAllAdmin,
  getSingleAdmin,
  updateAdminData,
  deleteAdminData,
  softDeleteAdminData,
};
