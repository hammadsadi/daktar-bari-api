import { NextFunction, Request, Response, Router } from "express";

import validatedRequest from "../../shared/validatedRequest";
import { ScheduleControllers } from "./schedule.controllers";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

// Init Route
const scheduleRouter = Router();

// Create Schedule
scheduleRouter.post(
  "/create",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ScheduleControllers.createSchedule
);

// Export Routes
export const ScheduleRoutes = scheduleRouter;
