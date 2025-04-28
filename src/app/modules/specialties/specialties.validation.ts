import { z } from "zod";

const specialtiesCreateValidation = z.object({
  title: z.string({ required_error: "Specialties Title is Required!" }),
});

export const SpecialtiesValidations = {
  specialtiesCreateValidation,
};
