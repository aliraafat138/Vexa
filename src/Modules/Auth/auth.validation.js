import Joi from "joi";
import {generalFields} from "../../middleware/validation.middleware.js";

export const signup = Joi.object()
  .keys({
    userName: generalFields.userName.required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    confirmPassword: generalFields.confirmPassword
      .valid(Joi.ref("password"))
      .required(),
  })
  .required();

export const login = Joi.object()
  .keys({
    email: generalFields.email.required(),
    password: generalFields.password.required(),
  })
  .required();

export const confirmEmail = Joi.object()
  .keys({
    email: generalFields.email.required(),
    code: Joi.string()
      .pattern(new RegExp(/^\d{4}$/))
      .required(),
  })
  .required();

export const forgetPassword = Joi.object()
  .keys({
    email: generalFields.email.required(),
  })
  .required();

export const resetPassword = Joi.object()
  .keys({
    email: generalFields.email.required(),
    code: Joi.string()
      .pattern(new RegExp(/^\d{4}$/))
      .required(),
    password: generalFields.password.required(),
  })
  .required();
