import prisma from "../../shared/prisma";
import bcrypt from "bcrypt";
import { JWTHelper } from "../../utils/jwtHelper";
import jwt from "jsonwebtoken";
// Auth Login
const authLogin = async (payload: { email: string; password: string }) => {
  // Get User Data
  const authData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload?.email,
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
    "sadihammad",
    "1m"
  );
  // Generate Refresh Token

  const refreshToken = JWTHelper.generateToken(
    {
      email: authData?.email,
      role: authData.role,
      status: authData.status,
    },
    "sadihammadsadi",
    "30d"
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
    decoded = jwt.verify(token, "sadihammadsadi");
  } catch (error) {
    throw new Error("Your are Not Authorized!");
  }

  //  Get User
  const authData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decoded?.email,
    },
  });

  // Generate Access Token
  const accessToken = JWTHelper.generateToken(
    {
      email: authData?.email,
      role: authData.role,
      status: authData.status,
    },
    "sadihammad",
    "1m"
  );

  return {
    accessToken,
    needPasswordChange: authData.needPasswordChange,
  };
};

export const AuthServices = {
  authLogin,
  createRefreshToken,
};
