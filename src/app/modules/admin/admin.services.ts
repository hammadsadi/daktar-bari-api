import { Prisma, PrismaClient } from "@prisma/client";

// Init Prisma Client Constructor
const prisma = new PrismaClient();

const getAllAdminFromDB = async (query: any) => {
  //  Admin SearchTerm data
  const andCondition: Prisma.AdminWhereInput[] = [];

  // Admin Searchable Fields
  const adminSearchAbleFields = ["name", "email"];

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
