import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../shared/prisma";
//  Init Prisma Client

// Admin Save to DB
const adminSaveToDB = async (data: any) => {
  // Hash Password
  const hashedPassword = await bcrypt.hash(data?.password, 12);

  // User Data
  const userData = {
    email: data?.admin?.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  // Create Data Using Transaction
  const result = await prisma.$transaction(async (transactionClient) => {
    // Create User
    const createdUserData = await transactionClient.user.create({
      data: userData,
    });

    // Create Admin Data
    const adminData = await transactionClient.admin.create({
      data: data?.admin,
    });
    return adminData;
  });
  return result;
};

export const UserServices = {
  adminSaveToDB,
};
