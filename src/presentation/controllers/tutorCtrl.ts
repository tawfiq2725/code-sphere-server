import { config } from "dotenv";
config();
import { Request, Response } from "express";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";
import { UpdateProfileService } from "../../application/services/updateProfile";
import { approveCertificateUsecase } from "../../application/usecases/userLists";
import { FileUploadService } from "../../application/services/filesUpload";
import {
  getmyCoursesUsecase,
  getStudentsUsecase,
} from "../../application/usecases/loginUser";
import { getUrl } from "../../utils/getUrl";
import { ReportsRepository } from "../../infrastructure/repositories/ReportsRepository";

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatesData = req.body;
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const profilePhoto = files?.profileImage?.[0];
    const certificates = files?.certificates || [];

    const updateProfileService = new UpdateProfileService();

    const updatedUser = await updateProfileService.updateProfile({
      updatesData,
      files: { profilePhoto, certificates },
    });

    if (updatedUser.profile) {
      updatedUser.profile = await getUrl(updatedUser.profile);
    }

    if (updatedUser.certificates) {
      for (let certificate of updatedUser.certificates) {
        certificate = await getUrl(certificate);
      }
    }

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
    if (user && user.certificates) {
      user.certificates = await Promise.all(
        user.certificates.map((certificate) => getUrl(certificate))
      );

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

export const enrollStudents = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const repo = new UserRepository();
    const students = await repo.getEnrollStudents(id);
    for (let student of students) {
      student.profile = await getUrl(student.profile);
    }
    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Enrolled Students",
      true,
      students
    );
  } catch (error: any) {
    return sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};

export const approveCourseCertificate = async (req: Request, res: Response) => {
  try {
    console.log("starting................................1");
    const { tutorName, studentId, courseId } = req.body;
    console.log("starting................................2");

    const pdf = req.file;
    console.log("starting................................3");
    console.log("check this pdf", pdf);

    if (!pdf) {
      return sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "No PDF file uploaded",
        false
      );
    }

    const repo = new UserRepository();
    console.log("starting................................4");
    const fileUploadservice = new FileUploadService();
    console.log("starting................................5");
    const approve = new approveCertificateUsecase(repo, fileUploadservice);
    console.log("starting................................6");

    const result = await approve.execute({
      tutorName,
      studentId,
      courseId,
      pdf,
    });
    console.log("final");

    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Certificate Approved",
      true,
      result
    );
  } catch (error: any) {
    return sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};

export const getStudents = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const repo = new UserRepository();
    const getUserusecase = new getStudentsUsecase(repo);
    const students = await getUserusecase.execute(id);

    return sendResponseJson(res, HttpStatus.OK, "Students", true, students);
  } catch (error: any) {
    return sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};
export const myCourses = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const repo = new UserRepository();
    const getUserusecase = new getmyCoursesUsecase(repo);
    const students = await getUserusecase.execute(id);
    for (let student of students) {
      if (student.thumbnail) {
        student.thumbnail = await getUrl(student.thumbnail);
      }
    }
    return sendResponseJson(res, HttpStatus.OK, "Students", true, students);
  } catch (error: any) {
    return sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};

export const tutorDashboard = async (req: Request, res: Response) => {
  const { id } = req.params;
  const repo = new ReportsRepository();
  const tutorDatas = await repo.getTutorDashboard(id);
  return sendResponseJson(
    res,
    HttpStatus.OK,
    "Tutor Dashboards",
    true,
    tutorDatas
  );
};
