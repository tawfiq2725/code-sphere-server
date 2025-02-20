import express from "express";
import {
  approveTutor,
  BlockUser,
  disapproveTutor,
  GetallCoursesAdmin,
  getAllTutorList,
  getAllTutorListApplication,
  getAllUsersList,
  UnblockUser,
  toggleCourse,
  approveOrRejectCourse,
} from "../../presentation/controllers/getAllusers";
import { authenticate } from "../../presentation/middleware/auth";
import { getTutorCertificates } from "../../presentation/controllers/tutorCtrl";
import {
  createMembership,
  getAllMembershipOrders,
  getAllMemberships,
  getMembershipOrderById,
  toggleMembershipStatus,
  updateMembership,
} from "../../presentation/controllers/membershipCtrl";
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
router.patch("/toggle-course/:id", authenticate, toggleCourse);
router.patch(
  "/api/approve-or-reject-course/:courseId",
  authenticate,
  approveOrRejectCourse
);

router.post("/add-membership", authenticate, createMembership);
router.patch("/edit-membership/:id", authenticate, updateMembership);
router.patch("/toggle-membership/:id", authenticate, toggleMembershipStatus);
router.get("/get-memberships", authenticate, getAllMemberships);
router.get("/get-memberships/orders", authenticate, getAllMembershipOrders);
router.get("/get-memberships/orders/:id", authenticate, getMembershipOrderById);

export default router;
