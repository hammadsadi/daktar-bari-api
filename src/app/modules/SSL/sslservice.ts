import axios from "axios";
import config from "../../config";
import ApiError from "../../errors/ApiError";
import status from "http-status";

const paymentInit = async (appointmentData: any) => {
  try {
    const data = {
      store_id: config.SSLCOMMERZ.STORE_ID,
      store_passwd: config.SSLCOMMERZ.STORE_PASSWD,
      total_amount: appointmentData?.amount,
      currency: "BDT",
      tran_id: appointmentData?.transactionId, // use unique tran_id for each api call
      success_url: config.SSLCOMMERZ.SUCCESS_URL,
      fail_url: config.SSLCOMMERZ.FAIL_URL,
      cancel_url: config.SSLCOMMERZ.CANCEL_URL,
      ipn_url: "http://localhost:3030/ipn",
      shipping_method: "N/A",
      product_name: "Appointment.",
      product_category: "Health",
      product_profile: "general",
      cus_name: appointmentData.name,
      cus_email: appointmentData.email,
      cus_add1: "Dhaka",
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: appointmentData.contactNumber,
      cus_fax: "01711111111",
      ship_name: "N/A",
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "N/A",
    };
    const response = await axios({
      method: "POST",
      url: config.SSLCOMMERZ.SSL_COMMERZ_API,
      data: data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return response.data;
  } catch (error) {
    throw new ApiError(status.BAD_REQUEST, "Payment Initiate Failed");
  }
};

export const SSLService = {
  paymentInit,
};
