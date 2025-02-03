import express from "express";
import { authenticate } from "../../presentation/middleware/auth";
import {
  CourseCreate,
  GetallCourses,
  EditCourse,
  deleteCourse,
  GetallCourse,
  GetcourseByGenerateId,
  toggleVisiblity,
} from "../../presentation/controllers/courseCtrl";
import { upload } from "../../config/multerConfig";
import {
  addChapter,
  getChapter,
  updateChapter,
} from "../../presentation/controllers/chapterCtrl";
import {
  addCategory,
  getAllCategory,
  updateCategory,
  toggleVisiblityCategory,
  getCategory,
} from "../../presentation/controllers/categoryCtrl";
const router = express.Router();

router.post(
  "/add-course",
  authenticate,
  upload.single("thumbnail"),
  CourseCreate
);
router.get("/get-courses/:id", authenticate, GetallCourses);

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

// Not auth
router.get("/get-chapter-front/:courseId", getChapter);

// Categories
router.post("/add-category", authenticate, addCategory);
router.get("/get-categories", authenticate, getAllCategory);
router.patch("/update-category/:id", authenticate, updateCategory);
router.patch(
  "/chapter/toggle-visibility/:id",
  authenticate,
  toggleVisiblityCategory
);
// not auth
router.get("/get-category/:id", getCategory);
router.get("/get-category-all", getAllCategory);
export default router;
