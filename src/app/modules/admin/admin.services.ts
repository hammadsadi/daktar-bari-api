import { Admin, Prisma, UserStatus } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.constant";
import prisma from "../../shared/prisma";
import { PaginationHelper } from "../../utils/paginationHelper";
import { IPaginationOptions } from "../../interfaces/paginationOptions";
import { TAdminQuery } from "./admin.types";

const getAllAdminFromDB = async (
  query: TAdminQuery,
  options: IPaginationOptions
) => {
  // All Query Data
  const { searchTerm, ...filteredData } = query;

  // Pagination Data
  const { page, limit, skip } = PaginationHelper.calculatePagination(options);

  //  Admin SearchTerm data
  const andCondition: Prisma.AdminWhereInput[] = [];

  // Check Query Data
  if (query?.searchTerm) {
    andCondition.push({
      OR: adminSearchAbleFields?.map((field) => ({
        [field]: {
          contains: query?.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // Push Active Data Condition
  andCondition.push({
    isDeleted: false,
  });

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
  const whereCondition: Prisma.AdminWhereInput = { AND: andCondition };

  // Get Admin Info
  const result = await prisma.admin.findMany({
    // Search Admin By Name or Email
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
  });

  //  Total Data
  const total = await prisma.admin.count({
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

// Find Single Admin From DB
const findSingleAdminFromDB = async (id: string): Promise<Admin | null> => {
  // Get Data From DB
  const result = await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  return result;
};

// Admin Data Update
const adminDataUpdate = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin> => {
  //  Check Exist Data
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  // Update Data
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });

  return result;
};

//  Delete Single Admin and User Relation Data Using Transaction
const deleteSingleAdmin = async (id: string): Promise<Admin> => {
  // Check Data IsExist or Not
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    // Delete Admin
    const deleteAdmin = await transactionClient.admin.delete({
      where: {
        id,
      },
    });

    // Delete Admin Data From User
    const deleteUserData = await transactionClient.user.delete({
      where: {
        email: deleteAdmin?.email,
      },
    });

    return deleteAdmin;
  });

  return result;
};

//  Soft Delete Single Admin and User Relation Data Using Transaction
const softDeleteSingleAdminFromDB = async (id: string): Promise<Admin> => {
  // Check Data IsExist or Not
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    // Soft Delete Admin
    const softDeletedAdmin = await transactionClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    // Soft Delete Admin Data From User
    const softDeleteUserData = await transactionClient.user.update({
      where: {
        email: softDeletedAdmin?.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return softDeletedAdmin;
  });

  return result;
};

export const AdminServices = {
  getAllAdminFromDB,
  findSingleAdminFromDB,
  adminDataUpdate,
  deleteSingleAdmin,
  softDeleteSingleAdminFromDB,
};
