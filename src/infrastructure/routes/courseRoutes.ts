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
import {
  createCoupon,
  getAllCoupons,
  toggleCoupon,
  updateCoupon,
} from "../../presentation/controllers/couponCtrl";
import { updateCourseProgress } from "../../presentation/controllers/courseCtrlProgres";
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

// coupons
router.get("/get-coupons", authenticate, getAllCoupons);
router.post("/create-coupon", authenticate, createCoupon);
router.patch("/update-coupon/:id", authenticate, updateCoupon);
router.patch("/coupon/toggle/:id", authenticate, toggleCoupon);

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

// update progress chapters
router.patch(`/update-progress`, authenticate, updateCourseProgress);

// not auth
router.get("/get-category/:id", getCategory);
router.get("/get-category-all", getAllCategory);
export default router;
