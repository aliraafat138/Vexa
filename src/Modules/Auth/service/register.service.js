import {userModel} from "../../../DB/Models/User.Model.js";
import {emailEvent} from "../../../Utilis/email/events/email.event.js";
import {asyncHandler} from "../../../Utilis/error/error.js";
import {compareHash, generateHash} from "../../../Utilis/security/hash.js";
import {successResponse} from "../../../Utilis/successResponse/response.js";

export const signup = asyncHandler(async (req, res, next) => {
  const {userName, email, password} = req.body;
  if (await userModel.findOne({email})) {
    return next(new Error("Email Exist", {cause: 409}));
  }
  console.log("Signup email:", email);

  const hashPassword = generateHash({plainText: password});
  const user = await userModel.create({
    userName,
    email,
    password: hashPassword,
  });
  emailEvent.emit("SendConfirmEmail", {id: user._id, email});
  return successResponse({res, data: {user}});
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const {email, code} = req.body;
  const user = await userModel.findOne({email});
  if (!user) {
    return next(new Error("User Not Found", {cause: 404}));
  }
  if (user.confirmEmail) {
    return next(new Error("User Already Confirmed", {cause: 409}));
  }
  if (!compareHash({plainText: code, hashValue: user.confirmEmailOTP})) {
    return next(new Error("Invalid Code", {cause: 400}));
  }
  await userModel.updateOne(
    {email},
    {confirmEmail: true, $unset: {confirmEmailOTP: 0}}
  );
  return successResponse({res, data: {user}});
});
