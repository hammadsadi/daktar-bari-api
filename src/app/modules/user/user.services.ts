import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../shared/prisma";
import { fileUploader } from "../../utils/fileUploader";
import { IFile } from "../../interfaces/file";
//  Init Prisma Client

// Admin Save to DB
const adminSaveToDB = async (req: any) => {
  const file: IFile = req.file;
  if (file) {
    const uploadedImage = await fileUploader.uploadToCloudinary(file);
    console.log(uploadedImage);

    req.body.admin.profilePhoto = uploadedImage?.secure_url;
  }
  // Hash Password
  const hashedPassword = await bcrypt.hash(req.body?.password, 12);
  // User Data
  const userData = {
    email: req.body?.admin?.email,
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
      data: req.body?.admin,
    });
    return adminData;
  });
  return result;
};

export const UserServices = {
  adminSaveToDB,
};
