import express from "express";
import {
  createUser,
  loginUser,
} from "../../presentation/controllers/userController";
import HttpStatus from "../../utils/statusCodes";
import sendResponseJson from "../../utils/message";
import {
  generateOtpHandler,
  verifyOtpHandler,
} from "../../presentation/controllers/otpController";

const router = express.Router();

router.get("/check", (req: express.Request, res: express.Response) => {
  sendResponseJson(res, HttpStatus.OK, "Checking the Util", true);
});
router.post("/user", createUser);
router.post("/send-otp", generateOtpHandler);
router.post("/verify-otp", verifyOtpHandler);
router.post("/login", loginUser);

export default router;
