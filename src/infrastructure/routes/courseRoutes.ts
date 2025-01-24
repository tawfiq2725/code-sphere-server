import express from "express";
import { authenticate } from "../../presentation/middleware/auth";
import {
  CourseCreate,
  GetallCourses,
  EditCourse,
  deleteCourse,
  toggleVisiblity,
} from "../../presentation/controllers/courseCtrl";
import { upload } from "../../config/multerConfig";
const router = express.Router();

router.post(
  "/add-course",
  authenticate,
  upload.single("thumbnail"),
  CourseCreate
);
router.get("/get-courses", authenticate, GetallCourses);
router.patch(
  "/edit-course/:courseId",
  upload.single("thumbnail"),
  authenticate,
  EditCourse
);
router.delete("/delete-course/:courseId", authenticate, deleteCourse);
router.patch("/toggle-visibility/:courseId", authenticate, toggleVisiblity);
export default router;
