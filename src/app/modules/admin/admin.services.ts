import { Prisma, PrismaClient } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.constant";

// Init Prisma Client Constructor
const prisma = new PrismaClient();

const getAllAdminFromDB = async (query: any) => {
  // All Query Data
  const { searchTerm, ...filteredData } = query;

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
  });
  return result;
};

export const AdminServices = {
  getAllAdminFromDB,
};
