import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../shared/prisma";
import { fileUploader } from "../../utils/fileUploader";
import { IFile } from "../../interfaces/file";

// Admin Save to DB
const adminSaveToDB = async (req: any) => {
  const file: IFile = req.file;
  if (file) {
    const uploadedImage = await fileUploader.uploadToCloudinary(file);

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

// Doctor Save to DB
const doctorSaveToDB = async (req: any) => {
  const file: IFile = req.file;
  if (file) {
    const uploadedImage = await fileUploader.uploadToCloudinary(file);

    req.body.doctor.profilePhoto = uploadedImage?.secure_url;
  }
  // Hash Password
  const hashedPassword = await bcrypt.hash(req.body?.password, 12);

  // User Data
  const userData = {
    email: req.body?.doctor?.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  // Create Data Using Transaction
  const result = await prisma.$transaction(async (transactionClient) => {
    // Create User
    const createdUserData = await transactionClient.user.create({
      data: userData,
    });

    // Create Doctor Data
    const doctorData = await transactionClient.doctor.create({
      data: req.body?.doctor,
    });
    return doctorData;
  });
  return result;
};

// Patient Save to DB
const patientSaveToDB = async (req: any) => {
  const file: IFile = req.file;
  if (file) {
    const uploadedImage = await fileUploader.uploadToCloudinary(file);

    req.body.patient.profilePhoto = uploadedImage?.secure_url;
  }
  // Hash Password
  const hashedPassword = await bcrypt.hash(req.body?.password, 12);

  // User Data
  const userData = {
    email: req.body?.patient?.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  // Create Data Using Transaction
  const result = await prisma.$transaction(async (transactionClient) => {
    // Create User
    const createdUserData = await transactionClient.user.create({
      data: userData,
    });

    // Create Patient Data
    const patientData = await transactionClient.patient.create({
      data: req.body?.patient,
    });
    return patientData;
  });
  return result;
};

export const UserServices = {
  adminSaveToDB,
  doctorSaveToDB,
  patientSaveToDB,
};
