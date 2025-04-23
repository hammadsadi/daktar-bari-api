import { Gender } from "@prisma/client";
import { z } from "zod";

// Create Admin Validation
const adminCreateValidation = z.object({
  password: z.string({ required_error: "Password Field is Required!" }),
  admin: z.object({
    name: z.string({ required_error: "Name Field is Required!" }),
    email: z
      .string({ required_error: "Email Field is Required!" })
      .email("Invalid Email Address"),
    contactNumber: z
      .string({ required_error: "Contact Number is Required!" })
      .regex(/^\d{7,15}$/, "Contact Number must be 7 to 15 digits"),
  }),
});

// Create Doctor Validation
const doctorCreateValidation = z.object({
  password: z.string({ required_error: "Password Field is Required!" }),
  doctor: z.object({
    name: z.string({ required_error: "Name Field is Required!" }),
    email: z
      .string({ required_error: "Email Field is Required!" })
      .email("Invalid Email Address"),
    contactNumber: z
      .string({ required_error: "Contact Number is Required!" })
      .regex(/^\d{7,15}$/, "Contact Number must be 7 to 15 digits"),
    address: z.string().optional(),
    registrationNumber: z.string({
      required_error: "Registration Number is Required!",
    }),
    experience: z.number().optional(),
    gender: z.enum([Gender.FEMALE, Gender.MALE]),
    appointmentFee: z.number({ required_error: "Appointment Fee is Required" }),
    qualification: z.string({ required_error: "Qualification is Required!" }),
    currentWorkingPlace: z.string({
      required_error: "Current Working Place is Required!",
    }),
    designation: z.string({ required_error: "Designation is Required!" }),
    averageRating: z.number().optional(),
  }),
});

// Create Patient Validation
const patientCreateValidation = z.object({
  password: z.string({ required_error: "Password Field is Required!" }),
  patient: z.object({
    name: z.string({ required_error: "Name Field is Required!" }),
    email: z
      .string({ required_error: "Email Field is Required!" })
      .email("Invalid Email Address"),
    contactNumber: z
      .string({ required_error: "Contact Number is Required!" })
      .regex(/^\d{7,15}$/, "Contact Number must be 7 to 15 digits"),
    address: z.string().optional(),
  }),
});

export const AdminValidation = {
  adminCreateValidation,
  doctorCreateValidation,
  patientCreateValidation,
};
