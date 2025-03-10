import Joi from "joi";
import {Types} from "mongoose";

export const validateObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? value
    : helper.message("invalid ObjectId");
};
export const generalFields = {
  userName: Joi.string().min(3).max(20).alphanum(),
  email: Joi.string().email({
    minDomainSegments: 2,
    maxDomainSegments: 3,
    tlds: {allow: ["com", "net"]},
  }),
  password: Joi.string().pattern(
    new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  ),
  confirmPassword: Joi.string().valid(Joi.ref("password")),
  phone: Joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
  age: Joi.number().min(2).max(130),
  id: Joi.string().custom(validateObjectId),
};

export const validation = (schema) => {
  return (req, res, next) => {
    const inputData = {...req.body, ...req.query, ...req.params};
    const validationResult = schema.validate(inputData, {abortEarly: false});
    if (validationResult.error) {
      return res
        .status(400)
        .json({
          message: "validationError",
          validationResult: validationResult.error.details,
        });
    }
    return next();
  };
};
