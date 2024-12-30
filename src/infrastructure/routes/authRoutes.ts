import express from "express";
import { createUser } from "../../presentation/controllers/userController";
import HttpStatus from "../../utils/statusCodes";
import sendResponseJson from "../../utils/message";

const router = express.Router();

router.get("/check", (req: express.Request, res: express.Response) => {
  sendResponseJson(res, HttpStatus.OK, "Checking the Util", true);
});
router.post("/user", createUser);

export default router;
