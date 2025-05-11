import { NextFunction, Request, Response } from "express";
import sendResponse from "../../shared/SendResponse";
import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import { AppointmentServices } from "./appointment.services";
import { TAuthUser } from "../../interfaces/common";

/**
 * @Method GET
 * @Dsc GET ALL Doctors
 * @Return Data
 */

const appointBooked = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const result = await AppointmentServices.appointmentSaveToDB(
      req.user as TAuthUser,
      req.body
    );
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Appointment Booked Successful",
      data: result,
    });
  }
);

export const AppointmentControllers = {
  appointBooked,
};
