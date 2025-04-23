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

export const AdminValidation = {
  adminCreateValidation,
};
