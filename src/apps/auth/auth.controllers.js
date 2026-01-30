// import { AuthService } from "./auth.service.js";
// import { sendSuccess } from "../../utils/responseHandler.js";

// export class AuthController {
//   // static async register(req, res) {
//   //   try {
//   //     const { email, password, firstName, lastName, phone } = req?.body;

//   //     const result = await AuthService.register({
//   //       email,
//   //       password,
//   //       firstName,
//   //       lastName,
//   //       phone,
//   //     });
//   //     return sendSuccess(res, result, "User registered successfully", 200);
//   //   } catch (err) {
//   //     return sendError(
//   //       res,
//   //       err.message,
//   //       err.status || 500,
//   //       err.field ? { [err.field]: err.message } : undefined,
//   //     );
//   //   }
//   // }
//   static register = asyncHandler(async (req, res) => {
//     const result = await AuthService.register(req.body);

//     return successResponse(res, {
//       message: "User registered successfully",
//       data: result,
//     });
//   });

//   static async verifyUser(req, res) {
//     const { email } = req?.body;
//     try {
//       const user = await AuthService.verifyUser({ email });

//       return sendSuccess(res, user, "User verified successfully", 200);
//     } catch (err) {
//       return sendError(
//         res,
//         err.message,
//         err.status || 500,
//         err.field ? { [err.field]: err.message } : undefined,
//       );
//     }
//   }

//   // static async login(req, res) {
//   //   const { email, password, ip, device_id } = req?.body;
//   //   try {
//   //     const data = await AuthService.login({
//   //       email,
//   //       password,
//   //       ip,
//   //       device_id,
//   //       userAgent: req?.headers["user-agent"],
//   //     });

//   //     return sendSuccess(res, data, "Login Successfull", 200);
//   //   } catch (err) {
//   //     console.log(err);
//   //     return sendError(
//   //       res,
//   //       err.message,
//   //       err.status || 500,
//   //       err.field ? { [err.field]: err.message } : undefined,
//   //     );
//   //   }
//   // }

//   static login = asyncHandler(async (req, res) => {
//     const data = await AuthService.login({
//       ...req.body,
//       userAgent: req.headers["user-agent"],
//     });

//     return successResponse(res, {
//       message: "Login successful",
//       data,
//     });
//   });

//   static async refresh(req, res) {
//     try {
//       const { refresh_token } = req?.body;
//       const data = await AuthService.refreshToken(refresh_token);
//       return sendSuccess(res, data, "Access token refreshed");
//     } catch (err) {
//       return sendError(res, err.message, err.status || 500);
//     }
//   }

//   static async forgotPassword(req, res) {
//     try {
//       const { email } = req?.body;
//       const result = await AuthService.forgotPassword(email);
//       return sendSuccess(res, result, result.message);
//     } catch (err) {
//       return sendError(res, err.message, err.status || 500);
//     }
//   }

//   static async resetPassword(req, res) {
//     try {
//       const { otp, token, new_password } = req?.body;

//       const result = await AuthService.resetPassword({
//         otp,
//         token,
//         new_password,
//       });

//       return sendSuccess(res, result, result.message);
//     } catch (err) {
//       return sendError(res, err.message, err.status || 500);
//     }
//   }
// }

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

    const result = await AuthService.forgotPassword(email);

    return successResponse(res, {
      message: result.message,
      data: result,
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
