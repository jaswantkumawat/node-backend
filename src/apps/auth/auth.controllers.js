

import { AuthService } from "./auth.service.js";
import { successResponse } from "../../utils/responseHandler.js";
import { Utils } from "../../utils/index.js";

export class AuthController {
  // ================================
  // REGISTER
  // ================================
  static register = Utils.asyncHandler(async (req, res) => {
    const result = await AuthService.register(req.body);

    return successResponse(res, {
      statusCode: 201,
      message: "User registered successfully",
      data: result,
    });
  });

  // ================================
  // VERIFY USER
  // ================================
  static verifyUser = Utils.asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await AuthService.verifyUser({ email });

    return successResponse(res, {
      message: "User verified successfully",
      data: user,
    });
  });

  // ================================
  // LOGIN
  // ================================
  static login = Utils.asyncHandler(async (req, res) => {
    const data = await AuthService.login({
      ...req.body,
      userAgent: req.headers["user-agent"],
    });

    return successResponse(res, {
      message: "Login successful",
      data,
    });
  });

  // ================================
  // REFRESH TOKEN
  // ================================
  static refresh = Utils.asyncHandler(async (req, res) => {
    const { refresh_token } = req.body;

    const data = await AuthService.refreshToken(refresh_token);

    return successResponse(res, {
      message: "Access token refreshed",
      data,
    });
  });

  // ================================
  // FORGOT PASSWORD
  // ================================
static forgotPassword = Utils.asyncHandler(async (req, res) => {
  const { email } = req.body;

  await AuthService.forgotPassword(email);

  return successResponse(res, {
    message: "Password reset initiated",
  });
});


  // ================================
  // RESET PASSWORD
  // ================================
  static resetPassword = Utils.asyncHandler(async (req, res) => {
    const { otp, token, new_password } = req.body;

    const result = await AuthService.resetPassword({
      otp,
      token,
      new_password,
    });

    return successResponse(res, {
      message: result.message,
      data: result,
    });
  });
}
