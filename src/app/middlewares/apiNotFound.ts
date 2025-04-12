import { NextFunction, Request, Response } from "express";
import status from "http-status";

const apiNotFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(status.NOT_FOUND).json({
    success: false,
    message: "API Not Found",
    error: {
      path: req.originalUrl,
      Message: "Your Requested Path is Not Found...!",
    },
  });
};

export default apiNotFound;
