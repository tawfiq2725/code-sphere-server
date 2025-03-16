import { config } from "dotenv";
config();
import { Request, Response } from "express";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";
import { UpdateProfileService } from "../../application/services/updateProfile";
import { approveCertificateUsecase } from "../../application/usecases/userLists";
import {
  getmyCoursesUsecase,
  getStudentsUsecase,
} from "../../application/usecases/loginUser";
import { getUrl } from "../../utils/getUrl";

export class TutorController {
  constructor(
    private uploadTutorService: UpdateProfileService,
    private Certificates: approveCertificateUsecase,
    private Students: getStudentsUsecase,
    private getCourse: getmyCoursesUsecase
  ) {}
  public async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const updatesData = req.body;
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      const profilePhoto = files?.profileImage?.[0];
      const certificates = files?.certificates || [];
      const updatedUser = await this.uploadTutorService.updateProfile({
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
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
        false
      );
    }
  }

  public async getTutorCertificates(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const id = req.params.id;
      const certificates = await this.Certificates.exeGetCertificates(id);
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Tutor Certificates",
        true,
        certificates
      );
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }

  public async enrollStudents(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const students = await this.Certificates.exeEnrollstudents(id);
      sendResponseJson(res, HttpStatus.OK, "Enrolled Students", true, students);
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }
  public async approveCourseCertificate(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { tutorName, studentId, courseId } = req.body;
      const pdf = req.file;
      if (!pdf) {
        sendResponseJson(
          res,
          HttpStatus.BAD_REQUEST,
          "No PDF file uploaded",
          false
        );
        return;
      }
      const result = await this.Certificates.execute({
        tutorName,
        studentId,
        courseId,
        pdf,
      });
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Certificate Approved",
        true,
        result
      );
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }

  public async getStudents(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const students = await this.Students.execute(id);
      sendResponseJson(res, HttpStatus.OK, "Students", true, students);
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }

  public async myCourses(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const students = await this.getCourse.execute(id);
      sendResponseJson(res, HttpStatus.OK, "Students", true, students);
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }

  public async tutorDashboard(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const tutorDatas = await this.Students.exeGetDashboard(id);
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Tutor Dashboards",
        true,
        tutorDatas
      );
    } catch (err: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, err.message, false);
    }
  }
}
