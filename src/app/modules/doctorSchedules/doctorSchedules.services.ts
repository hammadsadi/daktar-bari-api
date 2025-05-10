import { TAuthUser } from "../../interfaces/common";
import prisma from "../../shared/prisma";

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

export const DoctorScheduleServices = {
  doctorScheduleSaveToDB,
};
