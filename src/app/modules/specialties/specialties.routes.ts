import { NextFunction, Request, Response, Router } from "express";
import { fileUploader } from "../../utils/fileUploader";
import { SpecialtiesControllers } from "./specialties.controllers";
import { SpecialtiesValidations } from "./specialties.validation";

// Init Route
const specialtiesRouter = Router();

//Create specialties
specialtiesRouter.post(
  "/create",
  //   auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialtiesValidations.specialtiesCreateValidation.parse(
      JSON.parse(req.body.data)
    );
    return SpecialtiesControllers.createSpecialties(req, res, next);
  }
);

//Get All specialties
specialtiesRouter.get(
  "/",
  //   auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  SpecialtiesControllers.getAllSpecialties
);

//Delete Single specialties
specialtiesRouter.delete(
  "/:specialtiesId",
  //   auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  SpecialtiesControllers.deleteSingleSpecialties
);

// Export Routes
export const SpecialtiesRoutes = specialtiesRouter;
