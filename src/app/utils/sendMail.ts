import nodemailer from "nodemailer";
import config from "../config";

const sendMail = async (to: string, sub: string, htmlTemp: any) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: config.SEND_EMAIL.EMAIL,
      pass: config.SEND_EMAIL.APP_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Daktar Bari Telemedicine Healthcare" <devteamsaadi@gmail.com>', // sender address
    to: to, // list of receivers
    subject: sub, // Subject line
    // text: "Hello world?"
    html: htmlTemp, // html body
  });
};

export default sendMail;
