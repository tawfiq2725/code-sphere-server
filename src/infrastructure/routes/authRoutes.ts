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
  verifyCoupon,
} from "../../presentation/controllers/userController";
import HttpStatus from "../../utils/statusCodes";
import sendResponseJson from "../../utils/message";
import {
  generateOtpHandler,
  verifyOtpHandler,
} from "../../presentation/controllers/otpController";
import { upload } from "../../config/multerConfig";

import {
  getCertificatesByStudent,
  getCoursesByMembershipId,
  getMembershipById,
  getMemberships,
} from "../../presentation/controllers/membershipCtrl";
import refresh from "../../presentation/middleware/refreshAuth";
import { verifyToken } from "../../presentation/middleware/auth";

const router = express.Router();

// auth
router.post("/user", createUser);
router.post("/send-otp", generateOtpHandler);
router.post("/resend-otp", generateOtpHandler);
router.post("/verify-otp", verifyOtpHandler);
router.post("/login", loginUser);
router.post("/refresh", refresh);
router.post("/forgot-password", generateOtpHandlerF);
router.post("/verify-forgot-password", verifyOtpHandler);
router.post("/new-password", newPassword);
router.get("/logout", logout);
router.post("/api/auth/google", googleAuth);
router.post("/auth/set-role", roleSelection);
// protected routes
router.use(verifyToken(["student"]));

router.get("/get-profile", getProfile);
router.get("/api/user/find-user/:id", getUserById);
router.post("/api/user/change-password", changePassword);
router.patch(
  "/api/user/update-profile-image",
  upload.single("profileImage"),

  updateUserProfileImage
);

// user side
router.get("/get-memberships", getMemberships);
router.get("/get-membership/:id", getMembershipById);
router.get("/get-membership/category/courses/:id", getCoursesByMembershipId);
router.get("/get-certifcates/:id", getCertificatesByStudent);
// coupon apply
router.post("/api/verify-coupon", verifyCoupon);

export default router;
