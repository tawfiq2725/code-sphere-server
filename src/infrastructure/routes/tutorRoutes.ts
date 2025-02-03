import express from "express";
import { updateProfile } from "../../presentation/controllers/tutorCtrl";
import { authenticate } from "../../presentation/middleware/auth";
import { getProfile } from "../../presentation/controllers/userController";
import { upload } from "../../config/multerConfig";
const router = express.Router();

router.get("/profile", authenticate, getProfile);
const multerFields = [
  { name: "profileImage", maxCount: 1 },
  { name: "certificates", maxCount: 10 },
];
router.patch(
  "/profile",
  authenticate,
  upload.fields(multerFields),
  updateProfile
);

export default router;
