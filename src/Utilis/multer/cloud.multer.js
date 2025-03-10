import multer from "multer";
export const fileValidations = {
  image: ["image/png", "image/jpeg", "image/gif", "image/jpg"],
  video: ["video/mp4", "video/webm", "video/ogg"],
};
export const uploadFile = (fileValidation = []) => {
  const storage = multer.diskStorage({});
  function fileFilter(req, file, cb) {
    if (fileValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(`invalid  format:${file.mimetype}`, false);
    }
  }
  return multer({fileFilter, storage});
};
