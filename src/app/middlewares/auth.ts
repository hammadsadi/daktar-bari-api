import { NextFunction, Request, Response } from "express";
import { JWTHelper } from "../utils/jwtHelper";
import config from "../config";
import { Secret } from "jsonwebtoken";
import { UserStatus } from "@prisma/client";

const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      // Check Token
      if (!token) {
        throw new Error("You are not authorized!");
      }
      // Verify Token
      const verifyUser = JWTHelper.tokenVerify(
        token,
        config.JWT.JWT_SECRET as Secret
      );
      // Check Account Status
      if (
        verifyUser.status === UserStatus.BLOCKED ||
        verifyUser.status === UserStatus.DELETED
      ) {
        throw new Error("Invalid Access");
      }

      //  Check Role
      if (roles.length && !roles.includes(verifyUser.role)) {
        throw new Error("You are not authorized!");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
