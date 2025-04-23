import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controllers";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../utils/fileUploader";
import { AdminValidation } from "./user.validation";

// Init Route
const userRouter = Router();

userRouter.post(
  "/",
  auth("ADMIN", "SUPER_ADMIN"),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = AdminValidation.adminCreateValidation.parse(
      JSON.parse(req.body.data)
    );
    return UserControllers.createAdmin(req, res, next);
  }
);

// Export Routes
export const UserRoutes = userRouter;
