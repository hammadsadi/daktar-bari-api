import { TAuthUser } from "./../../interfaces/common";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/SendResponse";
import status from "http-status";
import { DoctorScheduleServices } from "./doctorSchedules.services";
import pick from "../../utils/pick";

/**
 * @Method POST
 * @Dsc Create Doctor Schedule
 * @Return Data
 */
const createDoctorSchedule = catchAsync(
  async (
    req: Request & { user?: TAuthUser },
    res: Response,
    next: NextFunction
  ) => {
    const result = await DoctorScheduleServices.doctorScheduleSaveToDB(
      req.user as TAuthUser,
      req.body
    );
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Doctor Schedule Created Successful!",
      data: result,
    });
  }
);

/**
 * @Method GET
 * @Dsc GET All My Schedule
 * @Return Data
 */
const getAllMySchedule = catchAsync(
  async (
    req: Request & { user?: TAuthUser },
    res: Response,
    next: NextFunction
  ) => {
    const filter = pick(req.query, ["startDate", "endDate", "isBooked"]);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = await DoctorScheduleServices.getMyScheduleList(
      filter,
      options,
      req.user as TAuthUser
    );
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "My Schedule Retrieved Successful!",
      data: result,
    });
  }
);

// Export Schedule Controller
export const DoctorScheduleControllers = {
  createDoctorSchedule,
  getAllMySchedule,
};
