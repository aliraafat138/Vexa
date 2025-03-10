import {providerTypes, userModel} from "../../../DB/Models/User.Model.js";
import {
  emailEvent,
  subjectType,
} from "../../../Utilis/email/events/email.event.js";
import {asyncHandler} from "../../../Utilis/error/error.js";
import {compareHash, generateHash} from "../../../Utilis/security/hash.js";
import {generateToken} from "../../../Utilis/security/token.js";
import {successResponse} from "../../../Utilis/successResponse/response.js";
import {OAuth2Client} from "google-auth-library";

export const login = asyncHandler(async (req, res, next) => {
  const {email, password} = req.body;
  const user = await userModel.findOne({email, provider: providerTypes.system});
  if (!user) {
    return next(new Error("User Not Found", {cause: 404}));
  }
  if (!user.confirmEmail) {
    return next(new Error("Please ConfirmEmail First", {cause: 400}));
  }
  if (!compareHash({plainText: password, hashValue: user.password})) {
    return next(new Error("Invalid Login", {cause: 400}));
  }
  const accessToken = generateToken({
    payload: {id: user._id},
    signature: process.env.TOKEN_SIGNATURE,
  });
  return successResponse({res, data: {TOKEN: {accessToken}}});
});
export const loginWithGmail = asyncHandler(async (req, res, next) => {
  const {idToken} = req.body;
  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID, 
    });
    const payload = ticket.getPayload();
    return payload;
    
  }
  const payload = await verify();

  if (!payload.email_verified) {
    return next(new Error("Invalid-Account", {cause: 400}));
  }
  let user = await userModel.findOne({email: payload.email});
  if (!user) {
    user = await userModel.create({
      userName: payload.name,
      email: payload.email,
      confirmEmail: payload.email_verified,
      image: payload.picture,
      provider: providerTypes.google,
    });
  }
  if (user.provider != providerTypes.google) {
    return next(new Error("Invalid Provider", {cause: 400}));
  }
  const accessToken = generateToken({
    payload: {id: user._id},
    signature: process.env.TOKEN_SIGNATURE,
  });
  return successResponse({res, data: {accessToken}});
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const {email} = req.body;
  const user = await userModel.findOne({email});
  if (!user) {
    return next(new Error("Invalid Account", {cause: 404}));
  }
  if (!user.confirmEmail) {
    return next(new Error("PleasE Confirm Email First", {cause: 404}));
  }
  emailEvent.emit("forgot-Password", {
    id: user._id,
    email,
    subject: subjectType.resetPassword,
  });

  return successResponse({res});
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const {email, password, code} = req.body;
  const user = await userModel.findOne({email});
  if (!user) {
    return next(new Error("Invalid Account", {cause: 404}));
  }
  if (!user.confirmEmail) {
    return next(new Error("PleasE Confirm Email First", {cause: 404}));
  }
  if (!compareHash({plainText: code, hashValue: user.resetPasswordOTP})) {
    return next(new Error("Invalid Code resetPassword", {cause: 400}));
  }

  await userModel.updateOne(
    {email},
    {
      password: generateHash({plainText: password}),
      changeTimeCredential: Date.now(),
      $unset: {resetPasswordOTP: 0},
    }
  );
  return successResponse({res});
});
