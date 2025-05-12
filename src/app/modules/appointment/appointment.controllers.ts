import { NextFunction, Request, Response } from "express";
import sendResponse from "../../shared/SendResponse";
import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import { AppointmentServices } from "./appointment.services";
import { TAuthUser } from "../../interfaces/common";
import pick from "../../utils/pick";

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

/**
 * @Method GET
 * @Dsc GET ALL My Appointments
 * @Return Data
 */

const getMyAppointments = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    // Select Valid Key and Value
    const filter = pick(req.query, ["status", "paymentStatus"]);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = await AppointmentServices.getMyAppointmentsFromDB(
      req.user as TAuthUser,
      filter,
      options
    );
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "My Appointment Retrieved Successful",
      data: result,
    });
  }
);

/**
 * @Method GET
 * @Dsc GET ALL  Appointments
 * @Return Data
 */

const getAllAppointments = catchAsync(async (req: Request, res: Response) => {
  // Select Valid Key and Value
  const filter = pick(req.query, ["status", "paymentStatus"]);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await AppointmentServices.getAllAppointmentsFromDB(
    filter,
    options
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Appointment Retrieved Successful",
    data: result,
  });
});

export const AppointmentControllers = {
  appointBooked,
  getMyAppointments,
  getAllAppointments,
};
