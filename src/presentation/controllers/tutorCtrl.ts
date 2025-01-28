import { config } from "dotenv";
config();
import { Request, Response } from "express";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";
import { UpdateProfileService } from "../../application/services/updateProfile";

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatesData = req.body;
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const profilePhoto = files?.profilePhoto?.[0];
    const certificates = files?.certificates || [];

    const updateProfileService = new UpdateProfileService();

    const updatedUser = await updateProfileService.updateProfile({
      updatesData,
      files: { profilePhoto, certificates },
    });

    sendResponseJson(
      res,
      HttpStatus.OK,
      "Profile updated successfully",
      true,
      updatedUser
    );
  } catch (error: any) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

export const getTutorCertificates = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userRepository = new UserRepository();
    const id = req.params.id;
    console.log("check this id", id);
    const user = await userRepository.findById(id);
    console.log("check this user", user);
    if (user) console.log("check this user", user.certificates);
    if (user) {
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Tutor Certificates",
        true,
        user.certificates
      );
    } else {
      sendResponseJson(res, HttpStatus.NOT_FOUND, "User not found", false);
    }
  } catch (error: any) {
    sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};
