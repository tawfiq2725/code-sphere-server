import express from "express";
// import  } from "../../presentation/middleware/auth";
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

router.post("/add-course", upload.single("thumbnail"), CourseCreate);
router.get("/get-courses/:id", GetallCourses);

router.get("/get-course-data", GetallCourse);
router.get("/get-course/:courseId", GetcourseByGenerateId);
router.patch("/edit-course/:courseId", upload.single("thumbnail"), EditCourse);
router.delete("/delete-course/:courseId", deleteCourse);
router.patch("/toggle-visibility/:courseId", toggleVisiblity);

// Chapters
router.post("/add-chapter", upload.single("video"), addChapter);
router.get("/get-chapters/:courseId", getChapter);
router.patch(
  "/update-chapter/:chapterId",
  upload.single("video"),
  updateChapter
);

// coupons
router.get("/get-coupons", getAllCoupons);
router.post("/create-coupon", createCoupon);
router.patch("/update-coupon/:id", updateCoupon);
router.patch("/coupon/toggle/:id", toggleCoupon);

// Not auth
router.get("/get-chapter-front/:courseId", getChapter);

// Categories
router.post("/add-category", addCategory);
router.get("/get-categories", getAllCategory);
router.patch("/update-category/:id", updateCategory);
router.patch("/chapter/toggle-visibility/:id", toggleVisiblityCategory);
router.patch(`/update-progress`, updateCourseProgress);

// not auth
router.get("/get-category/:id", getCategory);
router.get("/get-category-all", getAllCategory);
export default router;
