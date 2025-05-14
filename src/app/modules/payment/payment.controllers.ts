import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { PaymentServices } from "./payment.services";
import sendResponse from "../../shared/SendResponse";
import status from "http-status";

/**
 * @Method POST
 * @Dsc Payment Init
 * @Return Data
 */
const paymentInit = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await PaymentServices.initPayment();
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Payment Initiate Successful!",
      data: result,
    });
  }
);

export const PaymentControllers = {
  paymentInit,
};
