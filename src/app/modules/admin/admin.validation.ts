import { z } from "zod";

// Update Admin Validation Schema
const adminValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    contactNumber: z.string().optional(),
  }),
});

export const AdminValidation = {
  adminValidationSchema,
};
