import { Prisma, PrismaClient } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.constant";

// Init Prisma Client Constructor
const prisma = new PrismaClient();

// Calculate Pagination
const calculatePagination = (options: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}) => {
  const page: number = Number(options?.page) || 1;
  const limit: number = Number(options.limit) || 10;
  const skip: number = (Number(page) - 1) * limit;
  const sortBy: string = options?.sortBy || "createdAt";
  const sortOrder: string = options?.sortOrder || "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

const getAllAdminFromDB = async (query: any, options: any) => {
  // All Query Data
  const { searchTerm, ...filteredData } = query;

  // Pagination Data
  const { page, limit, skip } = calculatePagination(options);

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
  return result;
};

export const AdminServices = {
  getAllAdminFromDB,
};
