import { Patient, Prisma, UserStatus } from "@prisma/client";
import { IPaginationOptions } from "../../interfaces/paginationOptions";
import { PaginationHelper } from "../../utils/paginationHelper";
import { TPatientQuery } from "./patients.type";
import { patientSearchAbleFields } from "./patient.constants";
import prisma from "../../shared/prisma";

// Get All Patients
const getAllPatientsFromDB = async (
  query: TPatientQuery,
  options: IPaginationOptions
) => {
  // All Query Data
  const { searchTerm, ...filteredData } = query;

  // Pagination Data
  const { page, limit, skip } = PaginationHelper.calculatePagination(options);

  //  Patient SearchTerm data
  const andCondition: Prisma.PatientWhereInput[] = [];

  // Check Query Data
  if (query?.searchTerm) {
    andCondition.push({
      OR: patientSearchAbleFields?.map((field) => ({
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
  const whereCondition: Prisma.PatientWhereInput = { AND: andCondition };

  // Get Patient Info
  const result = await prisma.patient.findMany({
    // Search Patient By Name or Email
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
    include: {
      medicalReports: true,
      patientHealthData: true,
    },
  });

  //  Total Data
  const total = await prisma.patient.count({
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

// Find Single Patients From DB
const findSinglePatientsFromDB = async (
  id: string
): Promise<Patient | null> => {
  // Get Data From DB
  const result = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  return result;
};

// Hard Delete Single Patient and User Relation Data Using Transaction
const deleteSinglePatient = async (id: string): Promise<Patient> => {
  // Check Data IsExist or Not
  await prisma.patient.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    // Delete Patient
    const deletePatient = await transactionClient.patient.delete({
      where: {
        id,
      },
    });

    // Delete Patient Data From User
    const deleteUserData = await transactionClient.user.delete({
      where: {
        email: deletePatient?.email,
      },
    });

    return deletePatient;
  });

  return result;
};

//  Soft Delete Single Patient and User Relation Data Using Transaction
const softDeleteSinglePatientFromDB = async (id: string): Promise<Patient> => {
  // Check Data IsExist or Not
  await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    // Soft Delete Patient
    const softDeletedPatient = await transactionClient.patient.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    // Soft Delete Patient Data From User
    const softDeleteUserData = await transactionClient.user.update({
      where: {
        email: softDeletedPatient?.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return softDeletedPatient;
  });

  return result;
};

// Update Patient Data
const updatePatientData = async (id: string, payload: any) => {
  const { medicalReport, patientHealthData, ...patientInfo } = payload;

  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
    },
  });

  //  Patient Data Create or Update
  const result = await prisma.$transaction(async (transactionClient) => {
    //  Update Patient Data
    const updatedPatient = await transactionClient.patient.update({
      where: {
        id: id,
      },
      data: patientInfo,
    });
    //  Create or Update Patient Health Data
    if (patientHealthData) {
      await transactionClient.patientHealthData.upsert({
        where: {
          patientId: updatedPatient.id,
        },
        update: patientHealthData,
        create: { ...patientHealthData, patientId: updatedPatient.id },
      });
    }
    //  Create  Patient Report Data
    if (medicalReport) {
      await transactionClient.medicalReport.create({
        data: { ...medicalReport, patientId: updatedPatient.id },
      });
    }
  });

  const response = await prisma.patient.findUnique({
    where: {
      id: id,
    },
    include: {
      medicalReports: true,
      patientHealthData: true,
    },
  });

  return response;
};

export const PatientServices = {
  getAllPatientsFromDB,
  findSinglePatientsFromDB,
  deleteSinglePatient,
  softDeleteSinglePatientFromDB,
  updatePatientData,
};
