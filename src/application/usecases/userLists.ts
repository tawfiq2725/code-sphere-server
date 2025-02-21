import { app } from "firebase-admin";
import { Person } from "../../domain/entities/User";
import { UserInterface } from "../../domain/interface/User";
import { PaginationOptions } from "../../utils/queryHelper";
import { FileUploadService } from "../services/filesUpload";

export class GetAllUsers {
  constructor(private readonly userRepository: UserInterface) {}
  async execute(options: PaginationOptions): Promise<Person[]> {
    return this.userRepository.getAllUsers(options);
  }
}

export class GetAllTutor {
  constructor(private readonly userRepository: UserInterface) {}
  async execute(options: PaginationOptions): Promise<Person[]> {
    const tutorList = this.userRepository.getAllTutor(options);
    return tutorList;
  }
}
export class GetAllTutorApplication {
  constructor(private readonly userRepository: UserInterface) {}
  async execute(options: PaginationOptions): Promise<Person[]> {
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
    console.log("starting.........................7");
    const pdfUrl = await this.fileUploadservice.uploadCourseCertificate(
      studentId,
      pdf
    );
    console.log("starting.........................8");
    const data = {
      studentId,
      courseId,
      status: "approved",
      certificateUrl: pdfUrl,
      issueDate: new Date(),
      approvedBy: tutorName,
    };
    console.log("starting.........................9");
    console.log("check this data", data);

    const result = this.userRepository.approveCertificate(data);
    return result;
  }
}
