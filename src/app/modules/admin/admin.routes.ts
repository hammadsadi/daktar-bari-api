import { Router } from "express";
import { AdminControllers } from "./admin.controllers";

// Init Route
const adminRouter = Router();

// Get All Admins
adminRouter.get("/", AdminControllers.getAllAdmin);
// Get Single Admin
adminRouter.get("/:adminId", AdminControllers.getSingleAdmin);

// Export Routes
export const AdminRoutes = adminRouter;
