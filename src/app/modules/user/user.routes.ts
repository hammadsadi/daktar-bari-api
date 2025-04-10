import { Router } from "express";
import { UserControllers } from "./user.controllers";

// Init Route
const userRouter = Router();

userRouter.post("/", UserControllers.createAdmin);

// Export Routes
export const UserRoutes = userRouter;
