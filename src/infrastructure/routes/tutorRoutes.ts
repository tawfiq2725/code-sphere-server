import express from "express";
import { userControllerDI } from "../../presentation/container/user";
import { upload } from "../../config/multerConfig";
import { verifyToken } from "../../presentation/middleware/auth";
import { tutorControllerDI } from "../../presentation/container/tutor";
const router = express.Router();

router.use(verifyToken(["tutor", "admin"]));
router.get("/profile", userControllerDI.getProfile.bind(userControllerDI));
const multerFields = [
  { name: "profileImage", maxCount: 1 },
  { name: "certificates", maxCount: 10 },
];
router.patch(
  "/profile",
  upload.fields(multerFields),
  tutorControllerDI.updateProfile.bind(tutorControllerDI)
);
router.get(
  "/enroll-students/:id",
  tutorControllerDI.enrollStudents.bind(tutorControllerDI)
);
router.post(
  "/api/approve-certificate",

  upload.single("pdf"),
  tutorControllerDI.approveCourseCertificate.bind(tutorControllerDI)
);

router.get(
  "/get-students/:id",
  tutorControllerDI.getStudents.bind(tutorControllerDI)
);
router.get(
  "/my-courses/:id",
  tutorControllerDI.myCourses.bind(tutorControllerDI)
);
router.get(
  "/dashboard/tutor/:id",
  tutorControllerDI.tutorDashboard.bind(tutorControllerDI)
);
export default router;
