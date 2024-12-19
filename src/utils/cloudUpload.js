
import multer, { diskStorage } from "multer";


import { AppError } from "./appError.js";
import { fileValidation } from "./multer.js";


export const cloudUpload = ({ allowType = fileValidation.image }={}) => {
  const storage = diskStorage({});
  //FileFilter
  const fileFilter = (req, file, cb) => {
    console.log(file);
    if (allowType.includes(file.mimetype)) {
      return cb(null, true);
    }
    cb(new AppError("invalid file format", 400), false);
  };
  return multer({
    storage,
    fileFilter,
 
  });
};
