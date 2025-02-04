import express from "express";
import {
  changePassword,
  createUser,
  generateOtpHandlerF,
  getProfile,
  getUserById,
  googleAuth,
  loginUser,
  logout,
  newPassword,
  roleSelection,
  updateUserProfileImage,
} from "../../presentation/controllers/userController";
import HttpStatus from "../../utils/statusCodes";
import sendResponseJson from "../../utils/message";
import {
  generateOtpHandler,
  verifyOtpHandler,
} from "../../presentation/controllers/otpController";
import { upload } from "../../config/multerConfig";
import { authenticate } from "../../presentation/middleware/auth";

const router = express.Router();

router.get("/check", (req: express.Request, res: express.Response) => {
  sendResponseJson(res, HttpStatus.OK, "Checking the Util", true);
});
router.post("/user", createUser);
router.post("/send-otp", generateOtpHandler);
router.post("/resend-otp", generateOtpHandler);
router.post("/verify-otp", verifyOtpHandler);
router.post("/login", loginUser);
router.post("/forgot-password", generateOtpHandlerF);
router.post("/verify-forgot-password", verifyOtpHandler);
router.post("/new-password", newPassword);
router.get("/logout", logout);
router.get("/get-profile", getProfile);
// Google Auth
router.post("/api/auth/google", googleAuth);
router.post("/auth/set-role", roleSelection);
router.get("/api/user/find-user/:id", getUserById);
router.post("/api/user/change-password", changePassword);
router.patch(
  "/api/user/update-profile-image",
  upload.single("profileImage"),
  authenticate,
  updateUserProfileImage
);
export default router;
