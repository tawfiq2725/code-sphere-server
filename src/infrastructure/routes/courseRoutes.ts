import express from "express";
import { authenticate } from "../../presentation/middleware/auth";
import {
  CourseCreate,
  GetallCourses,
  EditCourse,
  deleteCourse,
  toggleVisiblity,
  GetallCourse,
  GetcourseByGenerateId,
} from "../../presentation/controllers/courseCtrl";
import { upload } from "../../config/multerConfig";
import {
  addChapter,
  getChapter,
  updateChapter,
} from "../../presentation/controllers/chapterCtrl";
const router = express.Router();

router.post(
  "/add-course",
  authenticate,
  upload.single("thumbnail"),
  CourseCreate
);
router.get("/get-courses", authenticate, GetallCourses);
router.get("/get-course-data", GetallCourse);
router.get("/get-course/:courseId", GetcourseByGenerateId);
router.patch(
  "/edit-course/:courseId",
  upload.single("thumbnail"),
  authenticate,
  EditCourse
);
router.delete("/delete-course/:courseId", authenticate, deleteCourse);
router.patch("/toggle-visibility/:courseId", authenticate, toggleVisiblity);

// Chapters
router.post("/add-chapter", authenticate, upload.single("video"), addChapter);
router.get("/get-chapters/:courseId", authenticate, getChapter);
router.patch(
  "/update-chapter/:chapterId",
  upload.single("video"),
  authenticate,
  updateChapter
);
export default router;
