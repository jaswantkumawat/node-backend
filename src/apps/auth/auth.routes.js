import { Router } from "express";
import { AuthController } from "./auth.controllers.js";
import {
  registerValidator,
  verifyUserValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from "./auth.validators.js";
import { validate } from "./validate.middleware.js";

const router = Router();

router.post("/register", registerValidator, validate, AuthController.register);

router.post(
  "/verify-user",
  verifyUserValidator,
  validate,
  AuthController.verifyUser,
);

router.post("/login", loginValidator, validate, AuthController.login);

router.post("/refresh", AuthController.refresh);

router.post(
  "/forgot-password",
  forgotPasswordValidator,
  validate,
  AuthController.forgotPassword,
);

router.post(
  "/reset-password",
  resetPasswordValidator,
  validate,
  AuthController.resetPassword,
);

export default router;
