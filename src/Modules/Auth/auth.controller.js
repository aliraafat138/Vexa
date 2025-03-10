import {Router} from "express";
import {confirmEmail, signup} from "./service/register.service.js";
import {
  forgotPassword,
  login,
  loginWithGmail,
  resetPassword,
} from "./service/login.service.js";
import {validation} from "../../middleware/validation.middleware.js";
import * as validators from "./auth.validation.js";
const router = Router();
router.post("/signup", validation(validators.signup), signup);
router.patch(
  "/confirmEmail",
  validation(validators.confirmEmail),
  confirmEmail
);
router.post("/login", validation(validators.login), login);
router.patch(
  "/forgetPassword",
  validation(validators.forgetPassword),
  forgotPassword
);
router.post("/loginWithgmail", loginWithGmail);
router.patch(
  "/resetPassword",
  validation(validators.resetPassword),
  resetPassword
);
export default router;
