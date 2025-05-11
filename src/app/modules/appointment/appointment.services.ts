import { TAuthUser } from "../../interfaces/common";
import prisma from "../../shared/prisma";
import { v4 as uuidv4 } from "uuid";

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
      today.getSeconds();
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

export const AppointmentServices = {
  appointmentSaveToDB,
};
