import { Router } from "express";
import { AdminControllers } from "./admin.controllers";
import validatedRequest from "../../shared/validatedRequest";
import { AdminValidation } from "./admin.validation";

// Init Route
const adminRouter = Router();

// Get All Admins
adminRouter.get("/", AdminControllers.getAllAdmin);
// Get Single Admin
adminRouter.get("/:adminId", AdminControllers.getSingleAdmin);

// Update Single Admin Data
adminRouter.patch(
  "/:adminId",
  validatedRequest(AdminValidation.adminValidationSchema),
  AdminControllers.updateAdminData
);

// Delete Single Admin Data
adminRouter.delete("/:adminId", AdminControllers.deleteAdminData);

// Soft Delete Single Admin Data
adminRouter.delete("/soft/:adminId", AdminControllers.softDeleteAdminData);

// Export Routes
export const AdminRoutes = adminRouter;
