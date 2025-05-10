import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/SendResponse";
import { ScheduleService } from "./schedule.services";
import status from "http-status";
import pick from "../../utils/pick";
import { TAuthUser } from "../../interfaces/common";

/**
 * @Method POST
 * @Dsc Create Schedule
 * @Return Data
 */
const createSchedule = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ScheduleService.scheduleSaveToDB(req.body);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Schedule Created Successful!",
      data: result,
    });
  }
);

/**
 * @Method GET
 * @Dsc GET All Schedule
 * @Return Data
 */
const getAllSchedule = catchAsync(
  async (
    req: Request & { user?: TAuthUser },
    res: Response,
    next: NextFunction
  ) => {
    const filter = pick(req.query, ["startDate", "endDate"]);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = await ScheduleService.getScheduleList(
      filter,
      options,
      req.user as TAuthUser
    );
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Schedule Retrieved Successful!",
      data: result,
    });
  }
);
// Export Schedule Controller
export const ScheduleControllers = {
  createSchedule,
  getAllSchedule,
};
