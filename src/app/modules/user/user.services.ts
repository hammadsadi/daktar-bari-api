import { Admin, Doctor, Patient, Prisma, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../shared/prisma";
import { fileUploader } from "../../utils/fileUploader";
import { IFile } from "../../interfaces/file";
import { Request } from "express";
import { IPaginationOptions } from "../../interfaces/paginationOptions";
import { PaginationHelper } from "../../utils/paginationHelper";
import { UserSearchAbleFields } from "./user.constants";
import ApiError from "../../errors/ApiError";
import status from "http-status";

const getAllUsersFromDB = async (query: any, options: IPaginationOptions) => {
  // All Query Data
  const { searchTerm, ...filteredData } = query;

  // Pagination Data
  const { page, limit, skip } = PaginationHelper.calculatePagination(options);

  //  User SearchTerm data
  const andCondition: Prisma.UserWhereInput[] = [];

  // Check Query Data
  if (query?.searchTerm) {
    andCondition.push({
      OR: UserSearchAbleFields?.map((field) => ({
        [field]: {
          contains: query?.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // Filter Data
  if (Object.keys(filteredData)?.length > 0) {
    andCondition.push({
      AND: Object.keys(filteredData)?.map((key) => ({
        [key]: {
          equals: (filteredData as any)[key],
        },
      })),
    });
  }

  // Make Object Data  Using ANT Operator
  const whereCondition: Prisma.UserWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  // Get User Info
  const result = await prisma.user.findMany({
    // Search User By Name or Email
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      options?.sortBy && options?.sortOrder
        ? {
            [options?.sortBy]: options?.sortOrder,
          }
        : {
            createdAt: "asc",
          },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      // Relational Data
      admin: true,
      doctor: true,
      patient: true,
    },
  });

  //  Total Data
  const total = await prisma.user.count({
    where: whereCondition,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    result,
  };
};

// Admin Save to DB
const adminSaveToDB = async (req: Request): Promise<Admin> => {
  const file = req.file as IFile;
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
const doctorSaveToDB = async (req: Request): Promise<Doctor> => {
  const file = req.file as IFile;
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
const patientSaveToDB = async (req: Request): Promise<Patient> => {
  const file = req.file as IFile;
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

//  Update User Status
const updateUserStatus = async (id: string, payload: UserRole) => {
  // Find Data
  const isExistUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!isExistUser) {
    throw new ApiError(status.NOT_FOUND, "User Not Found");
  }

  // Status Update
  const userStatusUpdated = await prisma.user.update({
    where: {
      id: id,
    },
    data: payload,
  });

  return userStatusUpdated;
};

//  Get My Profile Data
const getMyProfileData = async (payload: any) => {
  //  Get User Data
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
    },
  });

  // Get Profile Related Data
  let profileData;
  if (userInfo.role === UserRole.SUPER_ADMIN) {
    profileData = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.ADMIN) {
    profileData = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.DOCTOR) {
    profileData = await prisma.doctor.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.PATIENT) {
    profileData = await prisma.patient.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  }
  return { ...userInfo, ...profileData };
};
export const UserServices = {
  adminSaveToDB,
  doctorSaveToDB,
  patientSaveToDB,
  getAllUsersFromDB,
  updateUserStatus,
  getMyProfileData,
};
