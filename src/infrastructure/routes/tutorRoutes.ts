import express from "express";
import {
  getTutorProfile,
  updateProfile,
} from "../../presentation/controllers/tutorCtrl";
import { authenticate } from "../../presentation/middleware/auth";
import { upload } from "../../application/services/multerConfig";
const router = express.Router();

router.get("/profile", authenticate, getTutorProfile);
router.put(
  "/profile/:id",
  authenticate,
  upload.array("certificates", 5),
  updateProfile
);

export default router;
