// import bcrypt from "bcryptjs";
// import User from "../user/user.model.js";
// import Profile from "../profile/profile.model.js";
// import OTPService from "../../utils/otpService.js";
// import { Token } from "../../utils/token.js";
// import RefreshToken from "./refreshToken.model.js";
// import { config } from "../../config.js";

// export class AuthService {
//   // ============================================================================
//   // REGISTER (it will register user and profile(if profile data available))
//   // ============================================================================
//   static async register({ email, password, firstName, lastName, phone }) {
//     let user = await User.findOne({ email });

//     if (user?.verified) {
//       throw new ApiError(409, "User already exists", {
//         email: "Email already registered",
//       });
//     }

//     // Create user if not exists
//     if (!user) {
//       const hashedPassword = await bcrypt.hash(password, 10);

//       user = await User.create({
//         email,
//         password: hashedPassword,
//       });

//       if (firstName || lastName || phone) {
//         await Profile.create({
//           userId: user._id,
//           profileType: "USER",
//           firstName,
//           lastName,
//           phone,
//         });
//       }
//     }

//     return user;
//   }

//   // ================================
//   // VERIFY USER
//   // ================================
//   static async verifyUser({ email }) {
//     const user = await User.findOne({ email });
//     if (!user) throw { status: 404, message: "User not found" };

//     if (user.verified) {
//       throw { status: 400, message: "User already verified" };
//     }

//     user.verified = true;
//     await user.save();

//     return {
//       id: user._id,
//       email: user.email,
//     };
//   }

//   // ================================
//   // LOGIN
//   // ================================
//   static async login({ email, password, ip, userAgent, device_id }) {
//     const user = await User.findOne({ email });
//     if (!user) throw { status: 401, message: "user not found with this email" };

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) throw { status: 401, message: "Invalid password" };

//     // Access Token
//     const accessToken = Token.signAccess({
//       sub: user._id.toString(),
//       email: user.email,
//     });

//     // Refresh Token
//     const refreshToken = Token.generateRefresh();
//     const { refreshTokenHash, expiresAt } = Token.hashRefresh(refreshToken);

//     await RefreshToken.create({
//       user: user._id,
//       tokenHash: refreshTokenHash,
//       expiresAt,
//       ip,
//       userAgent,
//       deviceId: device_id,
//     });
//     return {
//       accessToken,
//       refreshToken,
//     };
//   }

//   // ================================
//   // REFRESH TOKEN
//   // ================================
//   static async refreshToken(refresh_token) {
//     const { refreshTokenHash } = Token.hashRefresh(refresh_token);

//     const storedToken = await RefreshToken.findOne({
//       tokenHash: refreshTokenHash,
//       revoked: false,
//       expiresAt: { $gt: new Date() },
//     });

//     if (!storedToken) {
//       throw { status: 401, message: "Invalid refresh token" };
//     }

//     // Rotate token
//     storedToken.revoked = true;
//     await storedToken.save();

//     const {
//       refreshToken,
//       refreshTokenHash: newHash,
//       expiresAt,
//     } = Token.signRefresh();

//     await RefreshToken.create({
//       user: storedToken.user,
//       tokenHash: newHash,
//       expiresAt,
//       ip: storedToken.ip,
//       userAgent: storedToken.userAgent,
//       deviceId: storedToken.deviceId,
//     });

//     const user = await User.findById(storedToken.user);

//     const access_token = Token.signAccess({
//       sub: user._id.toString(),
//       email: user.email,
//     });

//     return {
//       access_token,
//       refresh_token: refreshToken,
//       refresh_expires_at: expiresAt,
//     };
//   }

//   // ================================
//   // FORGOT PASSWORD
//   // ================================
//   static async forgotPassword(email) {
//     const user = await User.findOne({ email });
//     if (!user) throw { status: 404, message: "User not found" };

//     if (!user.verified) {
//       throw { status: 400, message: "User not verified" };
//     }

//     const { token } = await OTPService.createAndSendOtp(email);

//     return {
//       message: "OTP sent to email",
//       token,
//     };
//   }

//   // ================================
//   // RESET PASSWORD
//   // ================================
//   static async resetPassword({ otp, token, new_password }) {
//     const decoded = Token.verify(token, config.jwtSecret);

//     if (decoded.otp !== otp) {
//       throw { status: 400, message: "Invalid OTP" };
//     }

//     const user = await User.findOne({ email: decoded.email });
//     if (!user) throw { status: 404, message: "User not found" };

//     user.password = await bcrypt.hash(new_password, 10);
//     await user.save();

//     return {
//       message: "Password reset successful",
//     };
//   }
// }

import bcrypt from "bcryptjs";
import User from "../user/user.model.js";
import Profile from "../profile/profile.model.js";
import OTPService from "../../utils/otpService.js";
import { Token } from "../../utils/token.js";
import RefreshToken from "./refreshToken.model.js";
import { config } from "../../config.js";
import { ApiError } from "../../utils/ApiError.js";

export class AuthService {
  // ============================================================================
  // REGISTER
  // ============================================================================
static async register({ email, password, firstName, lastName, phone }) {
  const existingUser = await User.findOne({ email });

  // User already exists
  if (existingUser) {
    throw new ApiError(409, "User already registered", {
      email: "Email already registered",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
  });

  if (firstName || lastName || phone) {
    await Profile.create({
      userId: user._id,
      profileType: "USER",
      firstName,
      lastName,
      phone,
    });
  }

  return user;
}


  // ================================
  // VERIFY USER
  // ================================
  static async verifyUser({ email }) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(404, "User not found", {
        email: "No account exists with this email",
      });
    }

    if (user.verified) {
      throw new ApiError(400, "User already verified");
    }

    user.verified = true;
    await user.save();

    return {
      id: user._id,
      email: user.email,
    };
  }

  // ================================
  // LOGIN
  // ================================
  static async login({ email, password, ip, userAgent, device_id }) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(401, "Invalid credentials", {
        email: "Email not registered",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials", {
        password: "Incorrect password",
      });
    }

    // Access Token
    const accessToken = Token.signAccess({
      sub: user._id.toString(),
      email: user.email,
    });

    // Refresh Token
    const refreshToken = Token.generateRefresh();
    const { refreshTokenHash, expiresAt } = Token.hashRefresh(refreshToken);

    await RefreshToken.create({
      user: user._id,
      tokenHash: refreshTokenHash,
      expiresAt,
      ip,
      userAgent,
      deviceId: device_id,
    });

    return {
      accessToken,
      refreshToken,
      refresh_expires_at:expiresAt
    };
  }

  // ================================
  // REFRESH TOKEN
  // ================================
  static async refreshToken(refresh_token) {
    if (!refresh_token) {
      throw new ApiError(400, "Refresh token is required");
    }

    const { refreshTokenHash } = Token.hashRefresh(refresh_token);

    const storedToken = await RefreshToken.findOne({
      tokenHash: refreshTokenHash,
      revoked: false,
      expiresAt: { $gt: new Date() },
    });

    if (!storedToken) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    // Revoke old token
    storedToken.revoked = true;
    await storedToken.save();

    const {
      refreshToken,
      refreshTokenHash: newHash,
      expiresAt,
    } = Token.signRefresh();

    await RefreshToken.create({
      user: storedToken.user,
      tokenHash: newHash,
      expiresAt,
      ip: storedToken.ip,
      userAgent: storedToken.userAgent,
      deviceId: storedToken.deviceId,
    });

    const user = await User.findById(storedToken.user);

    const access_token = Token.signAccess({
      sub: user._id.toString(),
      email: user.email,
    });

    return {
      access_token,
      refresh_token: refreshToken,
      refresh_expires_at: expiresAt,
    };
  }

  // ================================
  // FORGOT PASSWORD
  // ================================
static async forgotPassword(email) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found", {
      email: "No account exists with this email",
    });
  }

  // No verification checks
  // No OTP logic
  // No external calls

  return true;
}


  // ================================
  // RESET PASSWORD
  // ================================
  static async resetPassword({ otp, token, new_password }) {
    let decoded;

    try {
      decoded = Token.verify(token, config.jwtSecret);
    } catch {
      throw new ApiError(401, "Invalid or expired reset token");
    }

    if (decoded.otp !== otp) {
      throw new ApiError(400, "Invalid OTP", {
        otp: "OTP does not match",
      });
    }

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.password = await bcrypt.hash(new_password, 10);
    await user.save();

    return {
      message: "Password reset successful",
    };
  }
}
