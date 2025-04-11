import { Prisma } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.constant";
import prisma from "../../shared/prisma";
import { PaginationHelper } from "../../utils/paginationHelper";

const getAllAdminFromDB = async (query: any, options: any) => {
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

  // Filter Data
  if (Object.keys(filteredData)?.length > 0) {
    andCondition.push({
      AND: Object.keys(filteredData)?.map((key) => ({
        [key]: filteredData[key],
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

export const AdminServices = {
  getAllAdminFromDB,
};
