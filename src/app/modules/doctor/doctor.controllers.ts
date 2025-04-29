import { NextFunction, Request, Response } from "express";
import pick from "../../utils/pick";
import sendResponse from "../../shared/SendResponse";
import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import { AdminServices } from "../admin/admin.services";
import { validateQueryData } from "../admin/admin.constant";
import { DoctorServices } from "./doctor.services";
import { doctorValidateQueryData } from "./doctor.constant";
import { TDoctorQuery } from "./doctor.types";

/**
 * @Method GET
 * @Dsc GET ALL Doctors
 * @Return Data
 */

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
  // Select Valid Key and Value
  const filter = pick(req.query, doctorValidateQueryData);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const resData = await DoctorServices.getAllDoctorFromDB(
    filter as TDoctorQuery,
    options
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Doctor Retrieved Successful",
    meta: resData.meta,
    data: resData.result,
  });
});

/**
 * @Method GET
 * @Dsc GET Single Doctor
 * @Params doctorId
 * @Return Data
 */

const getSingleDoctor = catchAsync(async (req: Request, res: Response) => {
  // Get Id From Params
  const { doctorId } = req.params;
  const resData = await DoctorServices.findSingleDoctorFromDB(doctorId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Doctor Retrieved Successful",
    data: resData,
  });
});

/**
 * @Method PATCH
 * @Dsc Update Single Doctor Data
 * @Params doctorId
 * @Return Data
 */

const updateDoctorData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get Id From Params
    const { doctorId } = req.params;
    const resData = await DoctorServices.updateDoctorData(doctorId, req.body);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Doctor Data Updated Successful",
      data: resData,
    });
  }
);

/**
 * @Method DELETE
 * @Dsc DELETE Single DOCTOR Data
 * @Params doctorId
 * @Return Data
 */

const deleteDoctorData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get Id From Params
    const { doctorId } = req.params;
    const resData = await DoctorServices.deleteSingleDoctor(doctorId);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Doctor Data Deleted Successful",
      data: resData,
    });
  }
);

/**
 * @Method DELETE
 * @Dsc Soft DELETE Single Doctor Data
 * @Params doctorId
 * @Return Data
 */

const softDeleteDoctorData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get Id From Params
    const { doctorId } = req.params;
    const resData = await DoctorServices.softDeleteSingleDoctorFromDB(doctorId);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Doctor Data Deleted Successful",
      data: resData,
    });
  }
);

export const DoctorControllers = {
  getAllDoctors,
  getSingleDoctor,
  updateDoctorData,
  deleteDoctorData,
  softDeleteDoctorData,
};
