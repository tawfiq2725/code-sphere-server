import { Person } from "../../domain/entities/User";
import { UserInterface } from "../../domain/interface/User";
import { UserDocument } from "../../infrastructure/database/userSchema";
import { getUrl } from "../../utils/getUrl";
import { PaginationOptions } from "../../utils/queryHelper";
import { sendEmail } from "../services/applicationStatus";
import { FileUploadService } from "../services/filesUpload";

export interface UserData {
  data: Person[];
  pagination: PaginationOptions;
}

export interface Certificates {
  certificates: string[];
}

export class GetAllUsers {
  constructor(private readonly userRepository: UserInterface) {}
  async execute(options: PaginationOptions): Promise<UserData> {
    return this.userRepository.getAllUsers(options);
  }
  async execBlock(id: string): Promise<Person | null> {
    return this.userRepository.BlockUser(id);
  }

  async execUnblock(id: string): Promise<Person | null> {
    return this.userRepository.UnblockUser(id);
  }
}

export class GetAllTutor {
  constructor(private readonly userRepository: UserInterface) {}
  async execute(options: PaginationOptions): Promise<UserData> {
    const tutorList = this.userRepository.getAllTutor(options);
    return tutorList;
  }

  async execApprove(id: string): Promise<Person | null> {
    try {
      const user = await this.userRepository.approveTutor(id);

      if (!user) {
        throw new Error("Tutor not found");
      }
      const userEmail = user?.email;

      const updatedUser = await this.userRepository.update(id, {
        isTutor: true,
        tutorStatus: "approved",
      });
      await sendEmail(userEmail, true);
      if (updatedUser?.profile) {
        updatedUser.profile = await getUrl(updatedUser.profile);
      }

      return updatedUser;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async execDissAprove(id: string, reason: string): Promise<Person | null> {
    try {
      const user = await this.userRepository.disapproveTutor(id);
      if (!user) {
        throw new Error("Tutor not found");
      }

      const userEmail = user?.email;
      const updatedUser = await this.userRepository.update(id, {
        isTutor: false,
        tutorStatus: "rejected",
        reason,
      });
      await sendEmail(userEmail, false);
      if (updatedUser?.profile) {
        updatedUser.profile = await getUrl(updatedUser.profile);
      }
      return updatedUser;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
export class GetAllTutorApplication {
  constructor(private readonly userRepository: UserInterface) {}
  async execute(options: PaginationOptions): Promise<UserData> {
    const tutorList = this.userRepository.getAllTutorApplication(options);
    return tutorList;
  }
}

export class approveCertificateUsecase {
  constructor(
    private readonly userRepository: UserInterface,
    private fileUploadservice: FileUploadService
  ) {}
  async execute({
    tutorName,
    studentId,
    courseId,
    pdf,
  }: {
    tutorName: string;
    studentId: string;
    courseId: string;
    pdf: Express.Multer.File;
  }): Promise<Person | null> {
    const pdfUrl = await this.fileUploadservice.uploadCourseCertificate(
      studentId,
      pdf
    );

    const data = {
      studentId,
      courseId,
      status: "approved",
      certificateUrl: pdfUrl,
      issueDate: new Date(),
      approvedBy: tutorName,
    };

    const result = this.userRepository.approveCertificate(data);
    return result;
  }

  async exeGetCertificates(id: string): Promise<Certificates> {
    try {
      const user = await this.userRepository.findById(id);

      if (user && user.certificates) {
        user.certificates = await Promise.all(
          user.certificates.map((certificate) => getUrl(certificate))
        );
        return { certificates: user.certificates };
      }
      return { certificates: [] };
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async exeEnrollstudents(id: string): Promise<UserDocument[] | null> {
    try {
      if (!id) {
        throw new Error("Id is important");
      }
      const students = await this.userRepository.getEnrollStudents(id);
      if (students) {
        for (let student of students) {
          if (student.profile) {
            student.profile = await getUrl(student.profile);
          }
        }
      }
      return students;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
