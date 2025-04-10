import { Router } from "express";
import { AdminControllers } from "./admin.controllers";

// Init Route
const adminRouter = Router();

adminRouter.get("/", AdminControllers.getAllAdmin);

// Export Routes
export const AdminRoutes = adminRouter;
