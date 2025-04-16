import { Router } from "express";
import { AuthControllers } from "./auth.controllers";

const authRoute = Router();

// Auth Login
authRoute.post("/login", AuthControllers.loginAuth);
authRoute.get("/refresh-token", AuthControllers.refreshTokenCreate);

export const AuthRoutes = authRoute;
