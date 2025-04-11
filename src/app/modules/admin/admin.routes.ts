import { Router } from "express";
import { AdminControllers } from "./admin.controllers";

// Init Route
const adminRouter = Router();

// Get All Admins
adminRouter.get("/", AdminControllers.getAllAdmin);
// Get Single Admin
adminRouter.get("/:adminId", AdminControllers.getSingleAdmin);

// Update Single Admin Data
adminRouter.patch("/:adminId", AdminControllers.updateAdminData);

// Delete Single Admin Data
adminRouter.delete("/:adminId", AdminControllers.deleteAdminData);

// Export Routes
export const AdminRoutes = adminRouter;
