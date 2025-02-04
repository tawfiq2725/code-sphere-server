import { FileUploadService } from "./filesUpload";
import { UserRepository } from "../../infrastructure/repositories/UserRepository"; // Adjust the import path as needed

export class UpdateProfileService {
  private userRepository: UserRepository;
  private fileUploadService: FileUploadService;

  constructor() {
    this.userRepository = new UserRepository();
    this.fileUploadService = new FileUploadService();
  }

  async updateProfile(data: {
    updatesData: any;
    files: {
      profilePhoto?: Express.Multer.File;
      certificates?: Express.Multer.File[];
    };
  }): Promise<any> {
    const { updatesData, files } = data;
    const { email } = updatesData;

    if (!email) {
      throw new Error("Email is required to identify the user.");
    }

    const userId = await this.userRepository.findUserIdByEmail(email);
    if (!userId) {
      throw new Error(`User not found for email: ${email}`);
    }

    let profilePictureUrl: string | undefined;
    if (files.profilePhoto) {
      profilePictureUrl = await this.fileUploadService.uploadProfilePhoto(
        userId,
        files.profilePhoto
      );
    }

    let uploadedCertificates: string[] | undefined;
    if (files.certificates && files.certificates.length > 0) {
      uploadedCertificates = await this.fileUploadService.uploadCertificates(
        userId,
        files.certificates
      );
    }

    const updateFields: any = {};

    Object.keys(updatesData).forEach((key) => {
      if (["certificates", "profile"].includes(key)) {
        return;
      }
      const value = updatesData[key];
      if (value !== undefined && value !== null && value !== "") {
        updateFields[key] = value;
      }
    });

    if (profilePictureUrl) {
      updateFields.profile = profilePictureUrl;
    }

    if (uploadedCertificates && uploadedCertificates.length > 0) {
      updateFields.certificates = uploadedCertificates;
    }
    return await this.userRepository.update(userId, updateFields);
  }
}
