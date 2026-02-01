import { Router } from "express";
import { AuthController } from "./auth.controllers.js";
import {
  registerValidator,
  verifyUserValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  refreshSessionValidator,
} from "./auth.validators.js";
import { validate } from "./validate.middleware.js";

const router = Router();

router.post("/register", registerValidator, validate, AuthController.register);

router.patch(
  "/verify-user",
  verifyUserValidator,
  validate,
  AuthController.verifyUser,
);

router.post("/login", loginValidator, validate, AuthController.login);

router.post("/refresh-session",refreshSessionValidator, validate, AuthController.refresh);

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
