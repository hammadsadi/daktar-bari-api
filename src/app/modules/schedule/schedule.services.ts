import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../shared/prisma";
import { Schedule } from "@prisma/client";
import { ISchedulePayload } from "./schedule.interfaces";

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

export const ScheduleService = {
  scheduleSaveToDB,
};
