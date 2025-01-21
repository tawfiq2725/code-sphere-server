import express from "express";
import { updateProfile } from "../../presentation/controllers/tutorCtrl";
import { authenticate } from "../../presentation/middleware/auth";
import { getProfile } from "../../presentation/controllers/userController";
const router = express.Router();
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 * 1024,
    fieldSize: 10 * 1024 * 1024,
  },
});

const multerFields = [
  { name: "profilePhoto", maxCount: 1 },
  { name: "certificates", maxCount: 10 },
];

router.get("/profile", authenticate, getProfile);
router.put(
  "/profile/:id",
  authenticate,
  upload.fields(multerFields),
  updateProfile
);

export default router;
