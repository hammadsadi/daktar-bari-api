import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ICloudinaryResponse, IFile } from "../interfaces/file";
// Configuration
cloudinary.config({
  cloud_name: "da02dbjrc",
  api_key: "317671526331321",
  api_secret: "YaapRDECh9YQ7lre2zM9Ag5s9UQ", // Click 'View API Keys' above to copy your API secret
});

//  Multer Config
const storage = multer.diskStorage({
  // Destination
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },

  //    File Name
  filename: function (req, file, cb) {
    const uniqueSuffix =
      "Daktar-Bari-Telemedicine" +
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9);
    cb(null, file.originalname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

// Upload to Cloudinary
const uploadToCloudinary = async (
  file: IFile
): Promise<ICloudinaryResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      (error: Error, result: ICloudinaryResponse) => {
        fs.unlinkSync(file.path);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};
export const fileUploader = {
  upload,
  uploadToCloudinary,
};
