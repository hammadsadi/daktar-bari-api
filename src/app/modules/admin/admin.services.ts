import { PrismaClient } from "@prisma/client";

// Init Prisma Client Constructor
const prisma = new PrismaClient();

const getAllAdminFromDB = async (query: any) => {
  const result = await prisma.admin.findMany({
    // Search Admin By Name or Email
    where: {
      OR: [
        {
          name: {
            contains: query?.searchTerm,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: query?.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    },
  });
  return result;
};

export const AdminServices = {
  getAllAdminFromDB,
};
