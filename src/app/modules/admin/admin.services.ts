import { PrismaClient } from "@prisma/client";

// Init Prisma Client Constructor
const prisma = new PrismaClient();

const getAllAdminFromDB = async (query: any) => {
  const result = await prisma.admin.findMany({
    where: {
      name: {
        contains: query?.searchTerm,
        mode: "insensitive",
      },
    },
  });
  return result;
};

export const AdminServices = {
  getAllAdminFromDB,
};
