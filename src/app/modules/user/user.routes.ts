import { Router } from "express";
import { UserCOntrollers } from "./user.controllers";

// Init Route
const userRouter = Router();

userRouter.post("/", UserCOntrollers.createAdmin);

// Export Routes
export const UserRoutes = userRouter;
