/**
 * @Method GET
 * @Dsc GET ALL Patients
 * @Return Data
 */

import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import pick from "../../utils/pick";
import { filterQueryData } from "./patient.constants";
import sendResponse from "../../shared/SendResponse";
import status from "http-status";
import { PatientServices } from "./patient.services";

const getAllPatients = catchAsync(async (req: Request, res: Response) => {
  // Select Valid Key and Value
  const filter = pick(req.query, filterQueryData);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const resData = await PatientServices.getAllPatientsFromDB(filter, options);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Patients Retrieved Successful",
    meta: resData.meta,
    data: resData.result,
  });
});

/**
 * @Method GET
 * @Dsc GET Single Patient
 * @Params patientId
 * @Return Data
 */

const getSinglePatient = catchAsync(async (req: Request, res: Response) => {
  // Get Id From Params
  const { patientId } = req.params;
  const resData = await PatientServices.findSinglePatientsFromDB(patientId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Patient Retrieved Successful",
    data: resData,
  });
});

/**
 * @Method DELETE
 * @Dsc DELETE Single Patient Data
 * @Params patientId
 * @Return Data
 */

const deletePatientData = catchAsync(async (req: Request, res: Response) => {
  // Get Id From Params
  const { patientId } = req.params;
  const resData = await PatientServices.deleteSinglePatient(patientId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Patient Data Deleted Successful",
    data: resData,
  });
});

/**
 * @Method DELETE
 * @Dsc Soft DELETE Single Patient Data
 * @Params patientId
 * @Return Data
 */

const softDeletePatientData = catchAsync(
  async (req: Request, res: Response) => {
    // Get Id From Params
    const { patientId } = req.params;
    const resData = await PatientServices.softDeleteSinglePatientFromDB(
      patientId
    );
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Patient Data Deleted Successful",
      data: resData,
    });
  }
);

/**
 * @Method PATCH
 * @Dsc Update Single Patient Data
 * @Params patientId
 * @Return Data
 */

const updatePatientData = catchAsync(async (req: Request, res: Response) => {
  // Get Id From Params
  const { patientId } = req.params;
  const resData = await PatientServices.updatePatientData(patientId, req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Patient Data Updated Successful",
    data: resData,
  });
});

export const PatientsControllers = {
  getAllPatients,
  getSinglePatient,
  deletePatientData,
  softDeletePatientData,
  updatePatientData,
};
