import express from "express";
import { upload } from "../../config/multerConfig";
import refresh from "../../presentation/middleware/refreshAuth";
import { verifyToken } from "../../presentation/middleware/auth";
import { userControllerDI } from "../../presentation/container/user";
import { otpControllerDI } from "../../presentation/container/otp";
import { offerCtrlDI } from "../../presentation/container/offer";
import { membershiCtrlDI } from "../../presentation/container/membership";
import { courseCtrlDI } from "../../presentation/container/course";
import { categoryCtrlDI } from "../../presentation/container/category";
import { chapterCtrlDI } from "../../presentation/container/chapter";

const router = express.Router();

// auth
router.post("/user", userControllerDI.createUser.bind(userControllerDI));
router.post(
  "/send-otp",
  otpControllerDI.generateOtpHandler.bind(otpControllerDI)
);
router.post(
  "/resend-otp",
  otpControllerDI.resendOtpHandler.bind(otpControllerDI)
);
router.post(
  "/verify-otp",
  otpControllerDI.verifyOtpHandler.bind(otpControllerDI)
);
router.post("/login", userControllerDI.loginUser.bind(userControllerDI));
router.post("/refresh", refresh);
router.post(
  "/forgot-password",
  userControllerDI.generateOtpHandlerF.bind(userControllerDI)
);
router.post(
  "/verify-forgot-password",
  otpControllerDI.verifyOtpHandler.bind(otpControllerDI)
);
router.post(
  "/new-password",
  userControllerDI.newPassword.bind(userControllerDI)
);

router.post(
  "/api/auth/google",
  userControllerDI.googleAuth.bind(userControllerDI)
);
router.post(
  "/auth/set-role",
  userControllerDI.roleSelection.bind(userControllerDI)
);
router.get("/api/offers", offerCtrlDI.getOffers.bind(offerCtrlDI));
router.get(
  "/get-memberships",
  membershiCtrlDI.getMemberships.bind(membershiCtrlDI)
);
router.get(
  "/api/user/find-user/:id",
  userControllerDI.getUserById.bind(userControllerDI)
);
router.get("/logout", userControllerDI.logout.bind(userControllerDI));
router.get("/get-courses/:id", courseCtrlDI.GetallCourses.bind(courseCtrlDI));
router.get("/get-course-data", courseCtrlDI.GetallCourse.bind(courseCtrlDI));
router.get(
  "/get-category/:id",
  categoryCtrlDI.getCategory.bind(categoryCtrlDI)
);
router.get(
  "/get-category-all",
  categoryCtrlDI.getAllCategory.bind(categoryCtrlDI)
);
router.get(
  "/get-chapter-front/:courseId",
  chapterCtrlDI.getChapter.bind(chapterCtrlDI)
);

// protected routes
router.use(verifyToken(["student"]));

router.get("/get-profile", userControllerDI.getProfile.bind(userControllerDI));
router.get(
  "/api/user/find-user/:id",
  userControllerDI.getUserById.bind(userControllerDI)
);
router.post(
  "/api/user/change-password",
  userControllerDI.changePassword.bind(userControllerDI)
);
router.patch(
  "/api/user/update-profile-image",
  upload.single("profileImage"),
  userControllerDI.updateUserProfileImage.bind(userControllerDI)
);

router.get(
  "/get-memberships",
  membershiCtrlDI.getMemberships.bind(membershiCtrlDI)
);
router.get(
  "/get-membership/:id",
  membershiCtrlDI.getMembershipById.bind(membershiCtrlDI)
);
router.get(
  "/get-membership/order/:id",
  membershiCtrlDI.getMembershipByOId.bind(membershiCtrlDI)
);
router.get(
  "/get-membership/category/courses/:id",
  membershiCtrlDI.getCoursesByMembershipId.bind(membershiCtrlDI)
);
router.get(
  "/get-certifcates/:id",
  membershiCtrlDI.getCertificatesByStudent.bind(membershiCtrlDI)
);
// // coupon apply
router.post(
  "/api/verify-coupon",
  userControllerDI.verifyCoupon.bind(userControllerDI)
);
router.get(
  "/student/tutor/:id",
  userControllerDI.getTutor.bind(userControllerDI)
);

export default router;
