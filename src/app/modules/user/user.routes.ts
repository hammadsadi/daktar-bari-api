import { Router } from "express";
import { UserControllers } from "./user.controllers";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../utils/fileUploader";

// Init Route
const userRouter = Router();

userRouter.post(
  "/",
  fileUploader.upload.single("file"),
  auth("ADMIN", "SUPER_ADMIN"),
  UserControllers.createAdmin
);

// Export Routes
export const UserRoutes = userRouter;
