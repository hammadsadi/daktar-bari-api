import { TAuthUser } from "../../interfaces/common";
import { IPaginationOptions } from "../../interfaces/paginationOptions";
import prisma from "../../shared/prisma";
import { v4 as uuidv4 } from "uuid";
import { PaginationHelper } from "../../utils/paginationHelper";
import { Prisma, UserRole } from "@prisma/client";

//  Appointment Save to DB
const appointmentSaveToDB = async (
  authInfo: TAuthUser,
  payload: { doctorId: string; scheduleId: string }
) => {
  //  Get Patient Info
  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      email: authInfo?.email,
    },
  });
  //   Get Doctor Info
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload?.doctorId,
    },
  });

  //   Check Schedule Data
  const doctorSchedule = await prisma.doctorSchedules.findFirstOrThrow({
    where: {
      doctorId: doctorInfo.id,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  //    Generate Video Calling ID
  const videoCallingId = uuidv4();

  //   Create Appointment and Update Doctor Schedule Data Using Transaction
  const result = await prisma.$transaction(async (transactionClient) => {
    //   Create Appointment Data
    const appointmentData = await transactionClient.appointment.create({
      data: {
        patientId: patientInfo.id,
        doctorId: doctorInfo.id,
        scheduleId: doctorSchedule.scheduleId,
        videoCallingId,
      },
    });

    //  Update Doctor Schedule Data
    await transactionClient.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorInfo?.id,
          scheduleId: doctorSchedule.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appointmentData.id,
      },
    });

    // Generate Transaction ID
    const today = new Date();
    const transactionId =
      "Daktar-bari" +
      "-" +
      today.getFullYear() +
      "-" +
      today.getMonth() +
      "-" +
      today.getDate() +
      "-" +
      today.getHours() +
      "-" +
      today.getMinutes() +
      "-" +
      today.getSeconds() +
      "-" +
      Math.ceil(Math.random()) * 100000;
    //  Create Payment Data
    await transactionClient.payment.create({
      data: {
        amount: doctorInfo?.appointmentFee,
        appointmentId: appointmentData.id,
        transactionId,
      },
    });

    return appointmentData;
  });
  return result;
};

//  Get My  Appointment
const getMyAppointmentsFromDB = async (
  authInfo: TAuthUser,
  query: any,
  options: IPaginationOptions
) => {
  // All Query Data
  const { ...filteredData } = query;
  // Pagination Data
  const { page, limit, skip } = PaginationHelper.calculatePagination(options);

  //  Doctor SearchTerm data
  const andCondition: Prisma.AppointmentWhereInput[] = [];

  //  Add Patient and Doctor Info Condition
  if (authInfo?.role === UserRole.PATIENT) {
    andCondition.push({
      patient: {
        email: authInfo?.email,
      },
    });
  } else if (authInfo?.role === UserRole.DOCTOR) {
    andCondition.push({
      doctor: {
        email: authInfo?.email,
      },
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
  const whereCondition: Prisma.AppointmentWhereInput = { AND: andCondition };

  // Get Doctor Info
  const result = await prisma.appointment.findMany({
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
    include:
      authInfo?.role === UserRole.DOCTOR
        ? {
            patient: {
              include: {
                medicalReports: true,
                patientHealthData: true,
              },
            },
            schedule: true,
          }
        : {
            doctor: true,
            schedule: true,
          },
  });

  //  Total Data
  const total = await prisma.appointment.count({
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

const getAllAppointmentsFromDB = async (
  query: any,
  options: IPaginationOptions
) => {
  // All Query Data
  const { ...filteredData } = query;
  // Pagination Data
  const { page, limit, skip } = PaginationHelper.calculatePagination(options);

  //  Doctor SearchTerm data
  const andCondition: Prisma.AppointmentWhereInput[] = [];

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
  const whereCondition: Prisma.AppointmentWhereInput = { AND: andCondition };

  // Get Doctor Info
  const result = await prisma.appointment.findMany({
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
    include: {
      doctor: true,
      patient: true,
      schedule: true,
      doctorSchedules: true,
    },
  });

  //  Total Data
  const total = await prisma.appointment.count({
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
export const AppointmentServices = {
  appointmentSaveToDB,
  getMyAppointmentsFromDB,
  getAllAppointmentsFromDB,
};
