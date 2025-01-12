import express from "express";
import {
  createUser,
  loginUser,
  logout,
  newPassword,
} from "../../presentation/controllers/userController";
import HttpStatus from "../../utils/statusCodes";
import sendResponseJson from "../../utils/message";
import {
  generateOtpHandler,
  verifyOtpHandler,
} from "../../presentation/controllers/otpController";
import passport from "passport";

const router = express.Router();

router.get("/check", (req: express.Request, res: express.Response) => {
  sendResponseJson(res, HttpStatus.OK, "Checking the Util", true);
});
router.post("/user", createUser);
router.post("/send-otp", generateOtpHandler);
router.post("/resend-otp", generateOtpHandler);
router.post("/verify-otp", verifyOtpHandler);
router.post("/login", loginUser);
router.post("/forgot-password", generateOtpHandler);
router.post("/verify-forgot-password", verifyOtpHandler);
router.post("/new-password", newPassword);
router.get("/logout", logout);

// Google Auth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const userEmail = (req.user as { email: string }).email || "";

    // Redirect the user with the email in the URL
    res.redirect(
      `http://localhost:3000/auth/role-page?email=${encodeURIComponent(
        userEmail
      )}`
    );
  }
);

router.post("/auth/set-role");

export default router;
