import { Prisma } from "@prisma/client";
import { TAuthUser } from "../../interfaces/common";
import { IPaginationOptions } from "../../interfaces/paginationOptions";
import prisma from "../../shared/prisma";
import { PaginationHelper } from "../../utils/paginationHelper";
import ApiError from "../../errors/ApiError";
import status from "http-status";

const doctorScheduleSaveToDB = async (
  user: TAuthUser,
  payload: { scheduleIds: string[] }
) => {
  //  Find Doctor
  const doctor = await prisma.doctor.findUnique({
    where: {
      email: user?.email,
    },
  });
  //   Create Doctor Schedule Object
  const doctorScheduleData = payload?.scheduleIds?.map((scheduleId) => {
    return {
      doctorId: doctor?.id as string,
      scheduleId,
    };
  });
  const result = await prisma.doctorSchedules.createMany({
    data: doctorScheduleData,
  });

  return result;
};
// Get My Schedule List

const getMyScheduleList = async (
  query: any,
  options: IPaginationOptions,
  user: TAuthUser
) => {
  // All Query Data
  const { endDate, startDate, ...filteredData } = query;

  // Pagination Data
  const { page, limit, skip } = PaginationHelper.calculatePagination(options);

  //  Schedule SearchTerm data
  const andCondition: Prisma.DoctorSchedulesWhereInput[] = [];

  //  Push Filter Data
  if (startDate && endDate) {
    andCondition.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              gte: startDate,
            },
          },
        },
        {
          schedule: {
            endDateTime: {
              lte: endDate,
            },
          },
        },
      ],
    });
  }

  // Filter Data
  if (Object.keys(filteredData)?.length > 0) {
    if (
      typeof filteredData.isBooked === "string" &&
      filteredData.isBooked === "true"
    ) {
      filteredData.isBooked = true;
    } else if (
      typeof filteredData.isBooked === "string" &&
      filteredData.isBooked === "false"
    ) {
      filteredData.isBooked = false;
    }
    andCondition.push({
      AND: Object.keys(filteredData)?.map((key) => ({
        [key]: {
          equals: (filteredData as any)[key],
        },
      })),
    });
  }

  // Make Object Data  Using ANT Operator
  const whereCondition: Prisma.ScheduleWhereInput = { AND: andCondition };

  // Get Patient Info
  const result = await prisma.doctorSchedules.findMany({
    // Search Patient By Name or Email
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      options?.sortBy && options?.sortOrder
        ? {
            [options?.sortBy]: options?.sortOrder,
          }
        : {},
  });

  //  Total Data
  const total = await prisma.doctorSchedules.count({
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

//  Delete Doctor Schedule from DB
const deleteSingleDoctorScheduleFromDB = async (
  user: TAuthUser,
  scheduleId: string
) => {
  //  Get User Info
  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  // Check Schedule Already Booked or Not
  const isScheduleAlreadyBooked = await prisma.doctorSchedules.findFirst({
    where: {
      scheduleId,
      isBooked: true,
    },
  });
  if (isScheduleAlreadyBooked) {
    throw new ApiError(
      status.BAD_REQUEST,
      "This Schedule Already Booked! You Cannot Delete it!"
    );
  }

  // Delete Schedule
  const result = await prisma.doctorSchedules.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: doctor?.id as string,
        scheduleId,
      },
    },
  });

  return result;
};
export const DoctorScheduleServices = {
  doctorScheduleSaveToDB,
  getMyScheduleList,
  deleteSingleDoctorScheduleFromDB,
};
