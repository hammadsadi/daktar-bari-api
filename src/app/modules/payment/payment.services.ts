import axios from "axios";
import config from "../../config";
import prisma from "../../shared/prisma";
import { SSLService } from "../SSL/sslservice";
const initPayment = async (appointmentId: string) => {
  const appointData = await prisma.payment.findFirstOrThrow({
    where: {
      appointmentId,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });
  const paymentData = {
    name: appointData.appointment.patient.name,
    email: appointData.appointment.patient.email,
    address: appointData.appointment.patient.address,
    contactNumber: appointData.appointment.patient.contactNumber,
    amount: appointData.amount,
    transactionId: appointData.transactionId,
  };
  const result = await SSLService.paymentInit(paymentData);

  return {
    paymentURL: result?.GatewayPageURL,
  };
};

export const PaymentServices = {
  initPayment,
};
