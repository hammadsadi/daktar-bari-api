import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controllers";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../utils/fileUploader";
import { AdminValidation } from "./user.validation";
import { UserRole } from "@prisma/client";
import validatedRequest from "../../shared/validatedRequest";

// Init Route
const userRouter = Router();

// Get All Users
userRouter.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  UserControllers.getAllUsers
);

// Get Profile Data
userRouter.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  UserControllers.getProfileData
);

// Create Admin
userRouter.post(
  "/admin",
  auth("ADMIN", "SUPER_ADMIN"),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = AdminValidation.adminCreateValidation.parse(
      JSON.parse(req.body.data)
    );
    return UserControllers.createAdmin(req, res, next);
  }
);

// Create Doctor
userRouter.post(
  "/doctor",
  auth("ADMIN", "SUPER_ADMIN"),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = AdminValidation.doctorCreateValidation.parse(
      JSON.parse(req.body.data)
    );
    return UserControllers.doctorCreate(req, res, next);
  }
);

// Patient Doctor
userRouter.post(
  "/patient",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = AdminValidation.patientCreateValidation.parse(
      JSON.parse(req.body.data)
    );
    return UserControllers.patientCreate(req, res, next);
  }
);

//  Update User Status
userRouter.patch(
  "/:id/status",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validatedRequest(AdminValidation.userStatusUpdateValidation),
  UserControllers.updateUserStatus
);

//Update My Profile
userRouter.patch(
  "/update-my-profile",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return UserControllers.updateProfileData(req, res, next);
  }
);

// Export Routes
export const UserRoutes = userRouter;
