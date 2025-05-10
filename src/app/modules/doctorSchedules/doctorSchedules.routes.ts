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

// Export Routes
export const DoctorScheduleRoutes = doctorScheduleRouter;
