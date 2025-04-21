import prisma from "../../shared/prisma";
import bcrypt from "bcrypt";
import { JWTHelper } from "../../utils/jwtHelper";
import jwt, { Secret } from "jsonwebtoken";
import { UserStatus } from "@prisma/client";
import config from "../../config";
import ApiError from "../../errors/ApiError";
import status from "http-status";
import sendMail from "../../utils/sendMail";
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

//  Forgot Password Link Generate
const forgotPasswordGenerate = async (payload: { email: string }) => {
  // Get User
  const userData = await prisma.user.findUnique({
    where: {
      email: payload?.email,
      status: UserStatus.ACTIVE,
    },
  });
  // Check Status
  if (!userData) {
    throw new ApiError(status.NOT_FOUND, "User Not Found!");
  }

  // Token Generate
  const passwordResetToken = JWTHelper.generateToken(
    { email: userData?.email, role: userData?.role },
    config.JWT.FORGOT_PASSWORD_TOKEN as string,
    config.JWT.FORGOT_PASSWORD_TOKEN_EXPIRE_IN as string
  );

  // Generate Link
  const resetLink =
    config.CLIENT_API_BASE_URL +
    `/reset-pass?id=${userData.id}&token=${passwordResetToken}`;
  const emailTemplate = `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Password Reset - Telemedicine Healthcare</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f6f8;
        color: #333;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #007bff;
        color: #fff !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      }
      .footer {
        margin-top: 20px;
        font-size: 13px;
        color: #888;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Password Reset Request</h2>
      <p>Dear ${userData.role},</p>
      <p>
        We received a request to reset your password for your
        <strong>Telemedicine Healthcare</strong> account. If you made this request,
        please click the button below to set a new password.
      </p>

      <p style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" class="button">Reset Password</a>
      </p>

      <p>
        If you did not request a password reset, please ignore this email. This
        link will expire in 30 minutes for security purposes.
      </p>

      <p>Thank you,<br />The Telemedicine Health Care Team</p>

      <div class="footer">
        &copy; 2025 Telemedicine Health Care. All rights reserved.
      </div>
    </div>
  </body>
</html>`;

  // Send Email
  await sendMail(
    userData.email,
    "Reset Your Password - Telemedicine Healthcare",
    emailTemplate
  );
};

// Password Reset
const passwordReset = async (
  token: string,
  payload: { id: string; password: string }
) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  // Verify Token
  const verifyUser = JWTHelper.tokenVerify(
    token,
    config.JWT.FORGOT_PASSWORD_TOKEN as string
  );
  if (!verifyUser) {
    throw new ApiError(status.FORBIDDEN, "Forbidden!");
  }
  // Hash Password
  const hashedPassword = await bcrypt.hash(payload?.password, 12);
  // Update Password
  const result = await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return result;
};

export const AuthServices = {
  authLogin,
  createRefreshToken,
  userPasswordChange,
  forgotPasswordGenerate,
  passwordReset,
};
