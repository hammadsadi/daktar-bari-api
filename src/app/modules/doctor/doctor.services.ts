import { Doctor, Prisma, UserStatus } from "@prisma/client";
import { TDoctorQuery } from "./doctor.types";
import { IPaginationOptions } from "../../interfaces/paginationOptions";
import { PaginationHelper } from "../../utils/paginationHelper";
import { DoctorSearchAbleFields } from "./doctor.constant";
import prisma from "../../shared/prisma";

const getAllDoctorFromDB = async (
  query: TDoctorQuery,
  options: IPaginationOptions
) => {
  // All Query Data
  const { searchTerm, ...filteredData } = query;

  // Pagination Data
  const { page, limit, skip } = PaginationHelper.calculatePagination(options);

  //  Doctor SearchTerm data
  const andCondition: Prisma.DoctorWhereInput[] = [];

  // Check Query Data
  if (query?.searchTerm) {
    andCondition.push({
      OR: DoctorSearchAbleFields?.map((field) => ({
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
  const whereCondition: Prisma.DoctorWhereInput = { AND: andCondition };

  // Get Doctor Info
  const result = await prisma.doctor.findMany({
    // Search Doctor By Name or Email
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
  const total = await prisma.doctor.count({
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

// Find Single Doctor From DB
const findSingleDoctorFromDB = async (id: string): Promise<Doctor | null> => {
  // Get Data From DB
  const result = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  return result;
};

//  Delete Single Doctor and User Relation Data Using Transaction
const deleteSingleDoctor = async (id: string): Promise<Doctor> => {
  // Check Data IsExist or Not
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    // Delete Doctor
    const deleteDoctor = await transactionClient.doctor.delete({
      where: {
        id,
      },
    });

    // Delete Doctor Data From User
    const deleteUserData = await transactionClient.user.delete({
      where: {
        email: deleteDoctor?.email,
      },
    });

    return deleteDoctor;
  });

  return result;
};

//  Soft Delete Single Doctor and User Relation Data Using Transaction
const softDeleteSingleDoctorFromDB = async (id: string): Promise<Doctor> => {
  // Check Data IsExist or Not
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    // Soft Delete Doctor
    const softDeletedDoctor = await transactionClient.doctor.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    // Soft Delete Doctor Data From User
    const softDeleteUserData = await transactionClient.user.update({
      where: {
        email: softDeletedDoctor?.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return softDeletedDoctor;
  });

  return result;
};

//  Update Doctor Data
const updateDoctorData = async (id: string, payload: any) => {
  const { specialties, ...doctorsData } = payload;
  // Find Doctor
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  //    Data Update Or Create Using Transaction
  await prisma.$transaction(async (transactionClient) => {
    //    Update Doctor Data
    await transactionClient.doctor.update({
      where: {
        id,
      },
      data: doctorsData,
      include: {
        doctorSpecialties: true,
      },
    });

    // Delete Specialty
    if (specialties && specialties?.length > 0) {
      // Filtered Delete specialties
      const filterDeletedData = specialties.filter(
        (specialty: any) => specialty.isDeleted
      );
      //   Delete Data
      for (const deleteSpecialtiesId of filterDeletedData) {
        await transactionClient.doctorSpecialties.deleteMany({
          where: {
            doctorId: doctorInfo.id,
            specialtiesId: deleteSpecialtiesId.specialtiesId,
          },
        });
      }
      // Filtered Create specialties
      const filterCreateData = specialties.filter(
        (specialty: any) => !specialty.isDeleted
      );
      // Create Doctor Specialties
      for (const specialty of filterCreateData) {
        await transactionClient.doctorSpecialties.create({
          data: {
            doctorId: doctorInfo.id,
            specialtiesId: specialty.specialtiesId,
          },
        });
      }
    }
  });
  const result = await prisma.doctor.findUnique({
    where: {
      id: doctorInfo.id,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });
  return result;
};

export const DoctorServices = {
  getAllDoctorFromDB,
  findSingleDoctorFromDB,
  deleteSingleDoctor,
  softDeleteSingleDoctorFromDB,
  updateDoctorData,
};
