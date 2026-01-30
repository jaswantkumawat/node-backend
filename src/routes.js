import { Router } from "express";
import authRoutes from "./apps/auth/auth.routes.js";
import communicationRoutes from "./apps/communication/otp.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/communication/otp", communicationRoutes);

export default router;
