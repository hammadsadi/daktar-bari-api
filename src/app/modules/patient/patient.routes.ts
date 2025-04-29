import { Router } from "express";
import { PatientsControllers } from "./patient.controllers";

// Init Route
const patientRouter = Router();

// Get All Patients
patientRouter.get(
  "/",
  //   auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  PatientsControllers.getAllPatients
);

// Get Single Patient
patientRouter.get(
  "/:patientId",
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  PatientsControllers.getSinglePatient
);

// Delete Single Patient Data
patientRouter.delete(
  "/:patientId",
  // auth(UserRole.SUPER_ADMIN),
  PatientsControllers.deletePatientData
);

// Soft Delete Single Patient Data
patientRouter.delete(
  "/soft/:patientId",
  // auth(UserRole.SUPER_ADMIN),
  PatientsControllers.softDeletePatientData
);

export const PatientsRoutes = patientRouter;
