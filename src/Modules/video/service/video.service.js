import {videoModel} from "../../../DB/Models/Video.Model.js";
import {asyncHandler} from "../../../Utilis/error/error.js";
import {cloud} from "../../../Utilis/multer/cloudinary.js";
import {successResponse} from "../../../Utilis/successResponse/response.js";

export const createPost = asyncHandler(async (req, res, next) => {
  let attachments = [];
  for (const file of req.files) {
    const {secure_url, public_id} = await cloud.uploader.upload(file.path, {
      folder: `${process.env.APP_NAME}/Video`,
      resource_type: "video",
    });
    attachments.push({secure_url, public_id});
  }

  const post = await videoModel.create({
    createdBy: req.user._id,
    attachments,
  });
  return successResponse({res, status: 201, data: {post}});
});
