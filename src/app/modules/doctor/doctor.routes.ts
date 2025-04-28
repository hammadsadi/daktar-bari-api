import { Router } from "express";
import validatedRequest from "../../shared/validatedRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { DoctorControllers } from "./doctor.controllers";

// Init Route
const doctorRouter = Router();

// Get All Doctors
doctorRouter.get("/", DoctorControllers.getAllDoctors);
// Get Single Doctor
doctorRouter.get(
  "/:doctorId",
  //   auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DoctorControllers.getSingleDoctor
);

// Update Single Doctor Data
doctorRouter.patch(
  "/:doctorId",
  //   auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  //   validatedRequest(AdminValidation.adminValidationSchema),
  DoctorControllers.updateDoctorData
);

// Delete Single Doctor Data
doctorRouter.delete(
  "/:doctorId",
  //   auth(UserRole.SUPER_ADMIN),
  DoctorControllers.deleteDoctorData
);

// Soft Delete Single Doctor Data
doctorRouter.delete(
  "/soft/:doctorId",
  //   auth(UserRole.SUPER_ADMIN),
  DoctorControllers.softDeleteDoctorData
);

// Export Routes
export const DoctorRoutes = doctorRouter;
