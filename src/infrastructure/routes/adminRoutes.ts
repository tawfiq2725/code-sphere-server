import express from "express";
import {
  approveTutor,
  BlockUser,
  disapproveTutor,
  GetallCoursesAdmin,
  getAllTutorList,
  getAllTutorListApplication,
  getAllUsersList,
  ListCourse,
  UnblockUser,
  UnlistCourse,
} from "../../presentation/controllers/getAllusers";
import { authenticate } from "../../presentation/middleware/auth";
import { getTutorCertificates } from "../../presentation/controllers/tutorCtrl";
const router = express.Router();

router.get("/get-users", authenticate, getAllUsersList);
router.patch("/block-user/:id", authenticate, BlockUser);
router.patch("/unblock-user/:id", authenticate, UnblockUser);
router.get("/get-tutors", authenticate, getAllTutorList);
router.get(
  "/get-tutors/applications",
  authenticate,
  getAllTutorListApplication
);
router.patch("/approve-tutor/:tutorId", authenticate, approveTutor);
router.patch("/disapprove-tutor/:tutorId", authenticate, disapproveTutor);
router.get("/tutor/certificates/:id", authenticate, getTutorCertificates);
router.get("/get-courses", authenticate, GetallCoursesAdmin);
router.patch("/list-course/:id", authenticate, ListCourse);
router.patch("/unlist-course/:id", authenticate, UnlistCourse);
export default router;
