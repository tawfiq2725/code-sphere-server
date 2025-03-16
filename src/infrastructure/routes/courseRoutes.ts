import express from "express";
import { upload } from "../../config/multerConfig";
import { updateCourseProgress } from "../../presentation/controllers/courseCtrlProgres";
import { verifyToken } from "../../presentation/middleware/auth";
import { categoryCtrlDI } from "../../presentation/container/category";
import { courseCtrlDI } from "../../presentation/container/course";
import { couponCtrlDI } from "../../presentation/container/coupon";
import { chapterCtrlDI } from "../../presentation/container/chapter";
const router = express.Router();

router.get("/get-courses/:id", courseCtrlDI.GetallCourses.bind(courseCtrlDI));
router.get("/get-course-data", courseCtrlDI.GetallCourse.bind(courseCtrlDI));
router.get(
  "/get-category/:id",
  categoryCtrlDI.getCategory.bind(categoryCtrlDI)
);
router.get(
  "/get-category-all",
  categoryCtrlDI.getAllCategory.bind(categoryCtrlDI)
);
router.get(
  "/get-chapter-front/:courseId",
  chapterCtrlDI.getChapter.bind(chapterCtrlDI)
);
router.get(
  "/get-course/:courseId",
  courseCtrlDI.GetcourseByGenerateId.bind(courseCtrlDI)
);
router.use(verifyToken(["admin", "student", "tutor"]));

router.post(
  "/add-course",
  upload.single("thumbnail"),
  courseCtrlDI.CourseCreate.bind(courseCtrlDI)
);
router.get(
  "/get-course/:courseId",
  courseCtrlDI.GetcourseByGenerateId.bind(courseCtrlDI)
);
router.patch(
  "/edit-course/:courseId",
  upload.single("thumbnail"),
  courseCtrlDI.EditCourse.bind(courseCtrlDI)
);
router.delete(
  "/delete-course/:courseId",
  courseCtrlDI.delete.bind(courseCtrlDI)
);
router.patch(
  "/toggle-visibility/:courseId",
  courseCtrlDI.toggleVisiblity.bind(courseCtrlDI)
);

// Chapters
router.post(
  "/add-chapter",
  upload.single("video"),
  chapterCtrlDI.addChapter.bind(chapterCtrlDI)
);
router.get(
  "/get-chapters/:courseId",
  chapterCtrlDI.getChapter.bind(chapterCtrlDI)
);
router.patch(
  "/update-chapter/:chapterId",
  upload.single("video"),
  chapterCtrlDI.updateChapter.bind(chapterCtrlDI)
);

// coupons
router.get("/get-coupons", couponCtrlDI.getAllCoupons.bind(couponCtrlDI));
router.post("/create-coupon", couponCtrlDI.createCoupon.bind(couponCtrlDI));
router.patch(
  "/update-coupon/:id",
  couponCtrlDI.updateCoupon.bind(couponCtrlDI)
);
router.patch(
  "/coupon/toggle/:id",
  couponCtrlDI.toggleCoupon.bind(couponCtrlDI)
);
router.delete(
  "/coupon/delete/:id",
  couponCtrlDI.deleteCoupon.bind(couponCtrlDI)
);

router.get(
  "/get-chapter-front/:courseId",
  chapterCtrlDI.getChapter.bind(chapterCtrlDI)
);

// Categories
router.post("/add-category", categoryCtrlDI.addCategory.bind(categoryCtrlDI));
router.get(
  "/get-categories",
  categoryCtrlDI.getAllCategory.bind(categoryCtrlDI)
);
router.patch(
  "/update-category/:id",
  categoryCtrlDI.updateCategory.bind(categoryCtrlDI)
);
router.patch(
  "/chapter/toggle-visibility/:id",
  categoryCtrlDI.toggleVisiblityCategory.bind(categoryCtrlDI)
);
router.patch(`/update-progress`, updateCourseProgress);
router.get(
  "/get-category-all/:id",
  categoryCtrlDI.getAllCategoryCheck.bind(categoryCtrlDI)
);

export default router;
