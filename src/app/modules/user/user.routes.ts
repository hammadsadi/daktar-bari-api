import { Router } from "express";
import { UserControllers } from "./user.controllers";
import auth from "../../middlewares/auth";

// Init Route
const userRouter = Router();

userRouter.post("/", auth("ADMIN", "SUPER_ADMIN"), UserControllers.createAdmin);

// Export Routes
export const UserRoutes = userRouter;
