import { NextFunction, Request, Response } from "express";
import { JWTHelper } from "../utils/jwtHelper";
import config from "../config";
import { Secret } from "jsonwebtoken";
import { UserStatus } from "@prisma/client";
import ApiError from "../errors/ApiError";
import status from "http-status";
import { TAuthUser } from "../interfaces/common";

const auth = (...roles: string[]) => {
  return (
    req: Request & { user?: TAuthUser },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;

      // Check Token
      if (!token) {
        throw new ApiError(status.UNAUTHORIZED, "You are not authorized!");
      }
      // Verify Token
      const verifyUser = JWTHelper.tokenVerify(
        token,
        config.JWT.JWT_SECRET as Secret
      );
      // // Check Account Status
      // if (
      //   verifyUser.status === UserStatus.BLOCKED ||
      //   verifyUser.status === UserStatus.DELETED
      // ) {
      //   throw new ApiError(status.BAD_REQUEST, "Invalid Access");
      // }

      //  Check Role
      if (roles.length && !roles.includes(verifyUser.role)) {
        throw new ApiError(status.FORBIDDEN, "Forbidden!");
      }
      req.user = verifyUser as TAuthUser;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
