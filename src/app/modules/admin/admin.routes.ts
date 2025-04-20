import { Router } from "express";
import { AdminControllers } from "./admin.controllers";
import validatedRequest from "../../shared/validatedRequest";
import { AdminValidation } from "./admin.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

// Init Route
const adminRouter = Router();

// Get All Admins
adminRouter.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminControllers.getAllAdmin
);
// Get Single Admin
adminRouter.get(
  "/:adminId",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminControllers.getSingleAdmin
);

// Update Single Admin Data
adminRouter.patch(
  "/:adminId",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validatedRequest(AdminValidation.adminValidationSchema),
  AdminControllers.updateAdminData
);

// Delete Single Admin Data
adminRouter.delete(
  "/:adminId",
  auth(UserRole.SUPER_ADMIN),
  AdminControllers.deleteAdminData
);

// Soft Delete Single Admin Data
adminRouter.delete(
  "/soft/:adminId",
  auth(UserRole.SUPER_ADMIN),
  AdminControllers.softDeleteAdminData
);

// Export Routes
export const AdminRoutes = adminRouter;
