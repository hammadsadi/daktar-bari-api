import { NextFunction, Request, Response, Router } from "express";

import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { PaymentControllers } from "./payment.controllers";

// Init Route
const paymentRouter = Router();

// Init payment
paymentRouter.post(
  "/payment-init/:appointmentId",
  PaymentControllers.paymentInit
);

// Export Routes
export const PaymentRoutes = paymentRouter;
