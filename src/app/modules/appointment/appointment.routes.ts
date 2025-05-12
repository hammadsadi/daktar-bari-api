import { Router } from "express";
import validatedRequest from "../../shared/validatedRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { AppointmentControllers } from "./appointment.controllers";

// Init Route
const appointmentRouter = Router();

// My Appointment Get Route
appointmentRouter.get(
  "/get-my-appointments",
  auth(UserRole.PATIENT, UserRole.DOCTOR),
  AppointmentControllers.getMyAppointments
);

// Appointment Booked Route
appointmentRouter.post(
  "/booked",
  auth(UserRole.PATIENT),
  AppointmentControllers.appointBooked
);

// Export Routes
export const AppointmentRoutes = appointmentRouter;
