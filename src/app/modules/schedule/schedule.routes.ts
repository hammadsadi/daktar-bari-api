import { NextFunction, Request, Response, Router } from "express";

import validatedRequest from "../../shared/validatedRequest";
import { ScheduleControllers } from "./schedule.controllers";

// Init Route
const scheduleRouter = Router();

// Create Schedule
scheduleRouter.post("/create", ScheduleControllers.createSchedule);

// Export Routes
export const ScheduleRoutes = scheduleRouter;
