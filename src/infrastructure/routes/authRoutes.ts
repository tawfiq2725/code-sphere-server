import express from "express";
import { createUser } from "../../presentation/controllers/userController";

const router = express.Router();

router.get("/check", (req: express.Request, res: express.Response) => {
  res.status(200).json({
    message: "Check",
    success: true,
  });
});
router.post("/user", createUser);

export default router;
