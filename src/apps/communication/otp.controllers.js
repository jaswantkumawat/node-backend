// import OTPService from "./otp.service.js";
// import { sendError, sendSuccess } from "../../utils/responseHandler.js";

// export const sendOtp = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const otpHash = await OTPService.sendOtp(email);

//     sendSuccess(res, { otpHash }, "OTP sent successfully", 200);
//   } catch (err) {
//     sendError(
//       res,
//       err.message,
//       err.status || 500,
//       err.field ? { [err.field]: err.message } : undefined,
//     );
//   }
// };

// export const verifyOtp = async (req, res) => {
//   try {
//     const { otp, otpHash } = req.body;

//     const result = OTPService.verifyOtp(otp, otpHash);

//     if (!result.valid) {
//       let message = "OTP verification failed";

//       if (result.reason === "OTP_EXPIRED") {
//         message = "OTP has expired";
//       } else if (result.reason === "OTP_INVALID") {
//         message = "Invalid OTP";
//       }

//       return sendError(res, message, 400);
//     }

//     sendSuccess(res, { valid: true }, "OTP verified successfully", 200);
//   } catch (err) {
//     sendError(
//       res,
//       err.message,
//       err.status || 500,
//       err.field ? { [err.field]: err.message } : undefined,
//     );
//   }
// };

import OTPService from "./otp.service.js";
import { successResponse } from "../../utils/responseHandler.js";
import { Utils } from "../../utils/index.js";

export class OtpController {
  // ================================
  // SEND OTP
  // ================================
  static sendOtp = Utils.asyncHandler(async (req, res) => {
    const { email } = req.body;

    const otpHash = await OTPService.sendOtp(email);

    return successResponse(res, {
      message: "OTP sent successfully",
      data: { otpHash },
    });
  });

  // ================================
  // VERIFY OTP
  // ================================
  static verifyOtp = Utils.asyncHandler(async (req, res) => {
    const { otp, otpHash } = req.body;

    const result = OTPService.verifyOtp(otp, otpHash);

    // If invalid → service SHOULD throw, but keeping safety here
    if (!result.valid) {
      // This should ideally never run if service throws ApiError
      throw new ApiError(400, "OTP verification failed");
    }

    return successResponse(res, {
      message: "OTP verified successfully",
      data: { valid: true },
    });
  });
}
