import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controllers";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../utils/fileUploader";
import { AdminValidation } from "./user.validation";

// Init Route
const userRouter = Router();

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
  auth("ADMIN", "SUPER_ADMIN"),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = AdminValidation.patientCreateValidation.parse(
      JSON.parse(req.body.data)
    );
    return UserControllers.patientCreate(req, res, next);
  }
);

// Export Routes
export const UserRoutes = userRouter;
