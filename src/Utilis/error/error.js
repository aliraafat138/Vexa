import {error} from "console";

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return next(error);
    });
  };
};

export const globalErrorHandling = (error, req, res, next) => {
  return res
    .status(error.status || 400)
    .json({error, msg: error.message, stack: error.stack});
};
