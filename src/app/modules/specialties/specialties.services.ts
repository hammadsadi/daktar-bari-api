import { Request } from "express";
import { IFile } from "../../interfaces/file";
import { fileUploader } from "../../utils/fileUploader";
import prisma from "../../shared/prisma";

// specialties to DB
const specialtiesSaveToDB = async (req: Request) => {
  const file = req.file as IFile;
  if (file) {
    const uploadedFile = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadedFile?.secure_url;
  }
  const result = await prisma.specialties.create({
    data: req.body,
  });

  return result;
};

// Get All Specialties from DB
const getAllSpecialtiesFromDB = async () => {
  const result = await prisma.specialties.findMany();

  return result;
};

// specialties Delete from DB
const specialtiesDeleteFromDB = async (specialtiesId: string) => {
  const result = await prisma.specialties.delete({
    where: {
      id: specialtiesId,
    },
  });

  return result;
};

export const SpecialtiesServices = {
  specialtiesSaveToDB,
  specialtiesDeleteFromDB,
  getAllSpecialtiesFromDB,
};
