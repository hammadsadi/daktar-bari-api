import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/SendResponse";
import { ScheduleService } from "./schedule.services";
import status from "http-status";

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

export const ScheduleControllers = {
  createSchedule,
};
