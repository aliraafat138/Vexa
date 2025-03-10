import {Router} from "express";
const router = Router();
import {fileValidations, uploadFile} from "../../Utilis/multer/cloud.multer.js";
import {authentication} from "../../middleware/auth.middleware.js";
import {createPost} from "./service/video.service.js";
router.post(
  "/createPost",
  authentication,
  uploadFile(fileValidations.video).array("attachment", 1),
  createPost
);
export default router;
