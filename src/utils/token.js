import jwt from "jsonwebtoken";
import crypto from "crypto";
import { config } from "../config.js";
import { Utils } from "./index.js";

export const Token = {
  /* ---------------- ACCESS ---------------- */
  signAccess(payload) {
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });
  },

  /* ---------------- REFRESH (OPAQUE) ---------------- */
  generateRefresh() {
    return crypto.randomBytes(40).toString("hex");
  },

  hashRefresh(token) {
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const ttlMs = Utils.parseDuration(config.jwtRefreshExpiresIn);
    const expiresAt = new Date(Date.now() + ttlMs);

    return {
      refreshTokenHash,
      expiresAt,
    };
  },

  /* ---------------- COMBINED HELPER ---------------- */
  signRefresh() {
    const refreshToken = this.generateRefresh();
    const { refreshTokenHash, expiresAt } = this.hashRefresh(refreshToken);

    return {
      refreshToken,
      refreshTokenHash,
      expiresAt,
    };
  },

  /* ---------------- VERIFY ---------------- */
  verify(token, secret) {
    return jwt.verify(token, secret);
  },

  /* ---------------- OTP ---------------- */
  signOTP(payload) {
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.otpExpiresIn,
    });
  },
};
