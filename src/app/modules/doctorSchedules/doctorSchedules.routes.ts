import { NextFunction, Request, Response, Router } from "express";

import validatedRequest from "../../shared/validatedRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { DoctorScheduleControllers } from "./doctorSchedules.controllers";

// Init Route
const doctorScheduleRouter = Router();

// Create Schedule
doctorScheduleRouter.post(
  "/create",
  auth(UserRole.DOCTOR),
  DoctorScheduleControllers.createDoctorSchedule
);

// Get My Schedule
doctorScheduleRouter.get(
  "/my-schedule",
  auth(UserRole.DOCTOR),
  DoctorScheduleControllers.getAllMySchedule
);
// Delete My Single Schedule
doctorScheduleRouter.delete(
  "/:scheduleId",
  auth(UserRole.DOCTOR),
  DoctorScheduleControllers.deleteMySingleSchedule
);
// Export Routes
export const DoctorScheduleRoutes = doctorScheduleRouter;
