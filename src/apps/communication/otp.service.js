// import nodemailer from "nodemailer";
// import crypto from "crypto";
// import { config } from "../../config.js";
// import { Utils } from "../../utils/index.js";

// const OTP_TTL_MS = Utils.parseDuration(process.env.OTP_EXPIRES_IN);

// export default class OTPService {
//   // Generate 6-digit OTP
//   static generateOtp() {
//     return Math.floor(100000 + Math.random() * 900000).toString();
//   }

//   // Create hash with expiry encoded
//   static createOtpHash(otp, expiresAt) {
//     const data = `${otp}.${expiresAt}`;
//     const hash = crypto.createHash("sha256").update(data).digest("hex");
//     return `${hash}.${expiresAt}`;
//   }

//   // SMTP transporter
//   static getTransporter() {
//     return nodemailer.createTransport({
//       host: config.smtp.host,
//       port: config.smtp.port,
//       secure: false,
//       auth: {
//         user: config.smtp.user,
//         pass: config.smtp.pass,
//       },
//     });
//   }

//   // SEND OTP → returns otpHash (with expiry)
//   static async sendOtp(email) {
//     const otp = this.generateOtp();
//     const expiresAt = Date.now() + OTP_TTL_MS;

//     const otpHash = this.createOtpHash(otp, expiresAt);

//     const transporter = this.getTransporter();

//     await transporter.sendMail({
//       from: `"Communication" <${config.smtp.user}>`,
//       to: email,
//       subject: "Your OTP Code",
//       text: `Your OTP code is: ${otp}. It expires in 10 minutes.`,
//     });

//     return otpHash;
//   }

//   // VERIFY OTP → returns detailed result
//   static verifyOtp(otp, otpHash) {
//     if (!otp || !otpHash) {
//       return { valid: false, reason: "INVALID_PAYLOAD" };
//     }

//     const [hash, expiresAt] = otpHash.split(".");

//     if (!hash || !expiresAt) {
//       return { valid: false, reason: "INVALID_HASH" };
//     }

//     // ⏰ Expiry check
//     if (Date.now() > Number(expiresAt)) {
//       return { valid: false, reason: "OTP_EXPIRED" };
//     }

//     const data = `${otp}.${expiresAt}`;
//     const expectedHash = crypto.createHash("sha256").update(data).digest("hex");

//     if (expectedHash !== hash) {
//       return { valid: false, reason: "OTP_INVALID" };
//     }

//     return { valid: true };
//   }
// }

import nodemailer from "nodemailer";
import crypto from "crypto";
import { config } from "../../config.js";
import { Utils } from "../../utils/index.js";
import { ApiError } from "../../utils/ApiError.js";

const OTP_TTL_MS = Utils.parseDuration(process.env.OTP_EXPIRES_IN);

export default class OTPService {
  // ================================
  // GENERATE 6-DIGIT OTP
  // ================================
  static generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // ================================
  // CREATE HASH WITH EXPIRY
  // ================================
  static createOtpHash(otp, expiresAt) {
    const data = `${otp}.${expiresAt}`;
    const hash = crypto.createHash("sha256").update(data).digest("hex");
    return `${hash}.${expiresAt}`;
  }

  // ================================
  // SMTP TRANSPORTER
  // ================================
  static getTransporter() {
    return nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: false,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });
  }

  // ================================
  // SEND OTP
  // ================================
  static async sendOtp(email) {
    if (!email) {
      throw new ApiError(400, "Email is required", {
        email: "Email cannot be empty",
      });
    }

    const otp = this.generateOtp();
    const expiresAt = Date.now() + OTP_TTL_MS;

    const otpHash = this.createOtpHash(otp, expiresAt);

    const transporter = this.getTransporter();

    try {
      await transporter.sendMail({
        from: `"Communication" <${config.smtp.user}>`,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}. It expires in 10 minutes.`,
      });
    } catch (error) {
      throw new ApiError(500, "Failed to send OTP email");
    }

    return otpHash;
  }

  // ================================
  // VERIFY OTP
  // ================================
  static verifyOtp(otp, otpHash) {
    if (!otp || !otpHash) {
      throw new ApiError(400, "Invalid request payload", {
        otp: "OTP is required",
      });
    }

    const [hash, expiresAt] = otpHash.split(".");

    if (!hash || !expiresAt) {
      throw new ApiError(400, "Invalid OTP hash");
    }

    // ⏰ Expiry check
    if (Date.now() > Number(expiresAt)) {
      throw new ApiError(400, "OTP has expired", {
        otp: "OTP expired",
      });
    }

    const data = `${otp}.${expiresAt}`;
    const expectedHash = crypto.createHash("sha256").update(data).digest("hex");

    if (expectedHash !== hash) {
      throw new ApiError(400, "Invalid OTP", {
        otp: "OTP does not match",
      });
    }

    return { valid: true };
  }
}
