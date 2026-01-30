import express from "express";
import { OtpController } from "./otp.controllers.js";

const router = express.Router();

router.post("/send", OtpController.sendOtp);
router.post("/verify", OtpController.verifyOtp);

export default router;
