import { Router } from "express";
import { AuthControllers } from "./auth.controllers";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const authRoute = Router();

// Auth Login
authRoute.post("/login", AuthControllers.loginAuth);
authRoute.get("/refresh-token", AuthControllers.refreshTokenCreate);
authRoute.post(
  "/password-change",
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT, UserRole.SUPER_ADMIN),
  AuthControllers.changeUserPassword
);
authRoute.post("/generate-link", AuthControllers.generatePasswordResetLink);
authRoute.post("/reset-password", AuthControllers.userPasswordReset);
export const AuthRoutes = authRoute;
