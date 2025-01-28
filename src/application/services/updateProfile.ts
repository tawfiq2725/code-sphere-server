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

    let profilePictureUrl;
    if (files.profilePhoto) {
      profilePictureUrl = await this.fileUploadService.uploadProfilePhoto(
        userId,
        files.profilePhoto
      );
    }

    const uploadedCertificates = files.certificates
      ? await this.fileUploadService.uploadCertificates(
          userId,
          files.certificates
        )
      : undefined;

    const updateFields: any = {
      ...updatesData,
      ...(profilePictureUrl && { profile: profilePictureUrl }),
      ...(uploadedCertificates && { certificates: uploadedCertificates }),
    };

    return await this.userRepository.update(userId, updateFields);
  }
}
