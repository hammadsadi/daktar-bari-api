import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../shared/prisma";
import { Prisma, Schedule } from "@prisma/client";
import { IFilterSchedule, ISchedulePayload } from "./schedule.interfaces";
import { IPaginationOptions } from "../../interfaces/paginationOptions";
import { PaginationHelper } from "../../utils/paginationHelper";
import e from "express";
import { TAuthUser } from "../../interfaces/common";

// Schedule Save to DB
const scheduleSaveToDB = async (
  payload: ISchedulePayload
): Promise<Schedule[]> => {
  const { startDate, endDate, startTime, endTime } = payload;

  const currentDate = new Date(startDate); // Start date
  const lastDate = new Date(endDate); // End date
  // Increase Time by 30 minutes until endDateTime
  const intervalTime = 30;
  // Create an array of dates
  const scheduleList = [];
  // Loop through the dates
  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );
    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );
    //  Increase Time by 30 minutes until endDateTime
    while (startDateTime < endDateTime) {
      const scheduleData = {
        startDateTime: startDateTime,
        endDateTime: addMinutes(startDateTime, intervalTime),
      };
      const isExist = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduleData.startDateTime,
          endDateTime: scheduleData.endDateTime,
        },
      });
      // If Schedule is not exist then save to DB
      if (!isExist) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });
        scheduleList.push(result);
      }
      startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime);
    }
    // Set Date to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return scheduleList;
};

// Get Schedule List

const getScheduleList = async (
  query: IFilterSchedule,
  options: IPaginationOptions,
  user: TAuthUser
) => {
  // All Query Data
  const { endDate, startDate, ...filteredData } = query;

  // Pagination Data
  const { page, limit, skip } = PaginationHelper.calculatePagination(options);

  //  Schedule SearchTerm data
  const andCondition: Prisma.ScheduleWhereInput[] = [];

  //  Push Filter Data
  if (startDate && endDate) {
    andCondition.push({
      AND: [
        {
          startDateTime: {
            gte: startDate,
          },
        },
        {
          endDateTime: {
            lte: endDate,
          },
        },
      ],
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
  const whereCondition: Prisma.ScheduleWhereInput = { AND: andCondition };

  const doctorSchedule = await prisma.doctorSchedules.findMany({
    where: {
      doctor: {
        email: user?.email,
      },
    },
  });
  const doctorScheduleIds = doctorSchedule?.map(
    (schedule) => schedule.scheduleId
  );

  // Get Patient Info
  const result = await prisma.schedule.findMany({
    // Search Patient By Name or Email
    where: {
      ...whereCondition,
      id: {
        notIn: doctorScheduleIds,
      },
    },
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
  const total = await prisma.schedule.count({
    where: {
      ...whereCondition,
      id: {
        notIn: doctorScheduleIds,
      },
    },
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

// Get Single Schedule from DB
const getSingleScheduleFromDB = async (id: string) => {
  const singleSchedule = await prisma.schedule.findUniqueOrThrow({
    where: {
      id: id,
    },
    include: {
      doctorSchedules: true,
    },
  });

  return singleSchedule;
};

// Delete Single Schedule from DB
const deleteSingleScheduleFromDB = async (id: string) => {
  const singleScheduleDeleted = await prisma.schedule.delete({
    where: {
      id: id,
    },
  });

  return singleScheduleDeleted;
};
export const ScheduleService = {
  scheduleSaveToDB,
  getScheduleList,
  getSingleScheduleFromDB,
  deleteSingleScheduleFromDB,
};
