import multer from "multer";
import path from "path";

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

export const fileUploader = {
  upload,
};
