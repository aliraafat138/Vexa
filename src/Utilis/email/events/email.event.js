import EventEmitter from "events";
export const emailEvent = new EventEmitter();
import {customAlphabet} from "nanoid";
import {generateHash} from "../../security/hash.js";
import {confirmEmailTemplate} from "../template/confirmEmailTemp.js";
import {userModel} from "../../../DB/Models/User.Model.js";
import {sendEmail} from "../send.email.js";
export const subjectType = {
  confirmEmail: "confirmEmail",
  resetPassword: "resetPassword",
};

export const sendCode = async ({
  data,
  subject = subjectType.confirmEmail,
} = {}) => {
  const {id, email} = data;
  const OTP = customAlphabet("0123456789", 4)();
  const hashOTP = generateHash({plainText: OTP});
  const html = confirmEmailTemplate({code: OTP});
  let updateData = {};
  switch (subject) {
    case subjectType.confirmEmail:
      updateData = {confirmEmailOTP: hashOTP};
      break;
    case subjectType.resetPassword:
      updateData = {resetPasswordOTP: hashOTP};
      break;
    default:
      break;
  }
  await userModel.updateOne({_id: id}, updateData);
  await sendEmail({to: email, html, subject});
};
emailEvent.on("forgot-Password", async (data) => {
  await sendCode({data, subject: subjectType.resetPassword});
});

emailEvent.on("SendConfirmEmail", async (data) => {
  await sendCode({data, subject: subjectType.confirmEmail});
});
