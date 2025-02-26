import express from "express";
import {
  approveCourseCertificate,
  enrollStudents,
  getStudents,
  updateProfile,
} from "../../presentation/controllers/tutorCtrl";
import { getProfile } from "../../presentation/controllers/userController";
import { upload } from "../../config/multerConfig";
import { verifyToken } from "../../presentation/middleware/auth";
const router = express.Router();

router.use(verifyToken(["tutor"]));
router.get("/profile", getProfile);
const multerFields = [
  { name: "profileImage", maxCount: 1 },
  { name: "certificates", maxCount: 10 },
];
router.patch("/profile", upload.fields(multerFields), updateProfile);
router.get("/enroll-students/:id", enrollStudents);
router.post(
  "/api/approve-certificate",

  upload.single("pdf"),
  approveCourseCertificate
);

router.get("/get-students/:id", getStudents);
export default router;
