import { BloodGroup, Gender, MaritalStatus } from "@prisma/client";

export type TPatientQuery = {
  name?: string | undefined;
  email?: string | undefined;
  searchTerm?: string;
  contactNumber?: string | undefined;
};

//  Patient Health Data Types
interface IPatientHealthData {
  dateOfBirth: string;
  gender: Gender;
  bloodGroup: BloodGroup;
  hasAllergies?: boolean;
  hasDiabetes?: boolean;
  height: string;
  weight: string;
  smokingStatus?: boolean;
  dietaryPreferences?: string;
  pregnancyStatus?: boolean;
  mentalHealthHistory?: string;
  immunizationStatus?: string;
  hasPastSurgeries?: boolean;
  recentAnxiety?: boolean;
  recentDepression?: boolean;
  maritalStatus?: MaritalStatus;
}

//  Medical Report Type
interface IMedicalReport {
  reportName: string;
  reportLink: string;
}

//  Patient Update Data Types
export type TPatientUpdate = {
  name: string;
  contactNumber: string;
  address?: string;
  patientHealthData: IPatientHealthData;
  medicalReport: IMedicalReport;
};
