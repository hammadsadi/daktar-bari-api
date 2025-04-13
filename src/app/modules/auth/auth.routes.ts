import { Router } from "express";
import { AUthControllers } from "./auth.controllers";

const authRoute = Router();

// Auth Login
authRoute.post("/login", AUthControllers.loginAuth);

export const AuthRoutes = authRoute;
