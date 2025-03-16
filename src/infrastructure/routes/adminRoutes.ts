import express from "express";
import { verifyToken } from "../../presentation/middleware/auth";

import { userControllerDI } from "../../presentation/container/user";
import { offerCtrlDI } from "../../presentation/container/offer";
import { tutorControllerDI } from "../../presentation/container/tutor";
import { adminCtrlDI } from "../../presentation/container/admin";
import { categoryCtrlDI } from "../../presentation/container/category";
import { membershiCtrlDI } from "../../presentation/container/membership";

const router = express.Router();

router.use(verifyToken(["admin"]));

router.get("/get-users", adminCtrlDI.getAllUsersList.bind(adminCtrlDI));
router.patch("/block-user/:id", adminCtrlDI.BlockUser.bind(adminCtrlDI));
router.patch("/unblock-user/:id", adminCtrlDI.UnblockUser.bind(adminCtrlDI));
router.get("/get-tutors", adminCtrlDI.getAllTutorList.bind(adminCtrlDI));
router.get(
  "/get-tutors/applications",
  adminCtrlDI.getAllTutorListApplication.bind(adminCtrlDI)
);
router.patch(
  "/approve-tutor/:tutorId",
  adminCtrlDI.approveTutor.bind(adminCtrlDI)
);
router.patch(
  "/disapprove-tutor/:tutorId",
  adminCtrlDI.disapproveTutor.bind(adminCtrlDI)
);
router.get(
  "/tutor/certificates/:id",
  tutorControllerDI.getTutorCertificates.bind(tutorControllerDI)
);
router.get("/get-courses", adminCtrlDI.GetallCoursesAdmin.bind(adminCtrlDI));
router.patch("/toggle-course/:id", adminCtrlDI.toggleCourse.bind(adminCtrlDI));
router.patch(
  "/api/approve-or-reject-course/:courseId",
  adminCtrlDI.approveOrRejectCourse.bind(adminCtrlDI)
);
router.get(
  "/api/user/find-user/:id",
  userControllerDI.getUserById.bind(userControllerDI)
);

router.post(
  "/add-membership",
  membershiCtrlDI.createMembership.bind(membershiCtrlDI)
);
router.patch(
  "/edit-membership/:id",
  membershiCtrlDI.updateMembership.bind(membershiCtrlDI)
);
router.patch(
  "/toggle-membership/:id",
  membershiCtrlDI.toggleMembershipStatus.bind(membershiCtrlDI)
);
router.get(
  "/get-memberships",
  membershiCtrlDI.getAllMemberships.bind(membershiCtrlDI)
);
router.get(
  "/get-memberships/orders",
  membershiCtrlDI.getAllMembershipOrders.bind(membershiCtrlDI)
);
router.get(
  "/get-memberships/orders/:id",
  membershiCtrlDI.getMembershipOrderById.bind(membershiCtrlDI)
);
router.get(
  "/get-categories",
  categoryCtrlDI.getAllCategory.bind(categoryCtrlDI)
);
router.post("/create-offer", offerCtrlDI.createOffer.bind(offerCtrlDI));
router.put("/update-offer/:id", offerCtrlDI.updateOffer.bind(offerCtrlDI));
router.get("/get-offer/:id", offerCtrlDI.getOffer.bind(offerCtrlDI));
router.get("/get-offers", offerCtrlDI.getOffers.bind(offerCtrlDI));
router.patch("/toggle-offer/:id", offerCtrlDI.toggleOffer.bind(offerCtrlDI));
export default router;
