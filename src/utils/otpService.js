import nodemailer from "nodemailer";
import { config } from "../config.js";
import { Token } from "./token.js";

export default class OTPService {
  // Generate 6-digit OTP
  static generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Create JWT token with OTP
  static generateOtpToken(email, otp) {
    return Token.signOTP({ email, otp });
  }

  // Send OTP email
  static async sendOtpEmail(email, otp) {
    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: false,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });

    await transporter.sendMail({
      from: `"Jaswant" <${config.smtp.user}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
    });
  }

  // Complete flow: generate, sign, send
  static async createAndSendOtp(email) {
    const otp = this.generateOtp();
    const token = this.generateOtpToken(email, otp);

    await this.sendOtpEmail(email, otp);

    return { otp, token };
  }
}
