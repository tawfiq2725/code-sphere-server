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
// import { authenticate } from "../../presentation/middleware/auth";
import { getTutorCertificates } from "../../presentation/controllers/tutorCtrl";
import {
  createMembership,
  getAllMembershipOrders,
  getAllMemberships,
  getMembershipOrderById,
  toggleMembershipStatus,
  updateMembership,
} from "../../presentation/controllers/membershipCtrl";
import { verifyToken } from "../../presentation/middleware/auth";
import {
  createOffer,
  getOffer,
  getOffers,
  toggleOffer,
  updateOffer,
} from "../../presentation/controllers/offerCtrl";
import { getUserById } from "../../presentation/controllers/userController";
import { getAllCategory } from "../../presentation/controllers/categoryCtrl";

const router = express.Router();

router.use(verifyToken(["admin"]));

router.get("/get-users", getAllUsersList);
router.patch("/block-user/:id", BlockUser);
router.patch("/unblock-user/:id", UnblockUser);
router.get("/get-tutors", getAllTutorList);
router.get("/get-tutors/applications", getAllTutorListApplication);
router.patch("/approve-tutor/:tutorId", approveTutor);
router.patch("/disapprove-tutor/:tutorId", disapproveTutor);
router.get("/tutor/certificates/:id", getTutorCertificates);
router.get("/get-courses", GetallCoursesAdmin);
router.patch("/toggle-course/:id", toggleCourse);
router.patch("/api/approve-or-reject-course/:courseId", approveOrRejectCourse);
router.get("/api/user/find-user/:id", getUserById);

router.post("/add-membership", createMembership);
router.patch("/edit-membership/:id", updateMembership);
router.patch("/toggle-membership/:id", toggleMembershipStatus);
router.get("/get-memberships", getAllMemberships);
router.get("/get-memberships/orders", getAllMembershipOrders);
router.get("/get-memberships/orders/:id", getMembershipOrderById);
router.get("/get-categories", getAllCategory);
router.post("/create-offer", createOffer);
router.put("/update-offer/:id", updateOffer);
router.get("/get-offer/:id", getOffer);
router.get("/get-offers", getOffers);
router.patch("/toggle-offer/:id", toggleOffer);
export default router;
