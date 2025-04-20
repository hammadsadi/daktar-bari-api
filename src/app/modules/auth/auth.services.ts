import prisma from "../../shared/prisma";
import bcrypt from "bcrypt";
import { JWTHelper } from "../../utils/jwtHelper";
import jwt, { Secret } from "jsonwebtoken";
import { UserStatus } from "@prisma/client";
import config from "../../config";
// Auth Login
const authLogin = async (payload: { email: string; password: string }) => {
  // Get User Data
  const authData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload?.email,
      status: UserStatus.ACTIVE,
    },
  });

  // Match Password
  const passwordMatch: boolean = await bcrypt.compare(
    payload?.password,
    authData.password
  );
  if (!passwordMatch) {
    throw new Error("Invalid Credentials!");
  }

  // Generate Access Token
  const accessToken = JWTHelper.generateToken(
    {
      email: authData?.email,
      role: authData.role,
      status: authData.status,
    },
    config.JWT.JWT_SECRET as string,
    config.JWT.JWT_EXPIRES_IN as string
  );

  // Generate Refresh Token

  const refreshToken = JWTHelper.generateToken(
    {
      email: authData?.email,
      role: authData.role,
      status: authData.status,
    },
    config.JWT.REFRESH_TOKEN_SECRET as string,
    config.JWT.REFRESH_TOKEN_EXPIRES_IN as string
  );
  return {
    accessToken,
    needPasswordChange: authData.needPasswordChange,
    refreshToken,
  };
};

// Create Refresh Token
const createRefreshToken = async (token: string) => {
  let decoded;
  try {
    // Token Verify
    decoded = JWTHelper.tokenVerify(
      token,
      config.JWT.REFRESH_TOKEN_SECRET as Secret
    );
  } catch (error) {
    throw new Error("Your are Not Authorized!");
  }

  //  Get User
  const authData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decoded?.email,
      status: UserStatus.ACTIVE,
    },
  });

  // Generate Access Token after Verifying The Refresh Token
  const accessToken = JWTHelper.generateToken(
    {
      email: authData?.email,
      role: authData.role,
      status: authData.status,
    },
    config.JWT.JWT_SECRET as string,
    config.JWT.JWT_EXPIRES_IN as string
  );

  return {
    accessToken,
    needPasswordChange: authData.needPasswordChange,
  };
};

// Change Password
const userPasswordChange = async (userData: any, payload: any) => {
  // Get User Data
  const loggedInUser = await prisma.user.findUniqueOrThrow({
    where: {
      email: userData?.email,
      status: UserStatus.ACTIVE,
    },
  });

  // Match Password
  const passwordMatch: boolean = await bcrypt.compare(
    payload?.oldPassword,
    loggedInUser.password
  );
  if (!passwordMatch) {
    throw new Error("Password does not match!");
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(payload?.newPassword, 12);

  // Update Password
  await prisma.user.update({
    where: {
      email: loggedInUser?.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });
  return {
    message: "Password Changed Successfully",
  };
};

export const AuthServices = {
  authLogin,
  createRefreshToken,
  userPasswordChange,
};
